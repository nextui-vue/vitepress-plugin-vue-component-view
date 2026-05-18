import MarkdownIt from "markdown-it";
import markdownItContainer from "markdown-it-container";
import type Token from "markdown-it/lib/token.mjs";
import { Buffer } from "node:buffer";
import path from "node:path";
import fs from "node:fs";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import type { MarkdownEnv } from "vitepress";

export const CONTAINER_NAME = "component-view";

function extractComponents<
  T extends Array<{ component: string; filepath: string }>,
>(src: string): T {
  const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const match = regex.exec(src);
  const code = match ? match[1] : "";

  const components = [] as T;
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });
  traverse(ast, {
    ImportDeclaration(path) {
      const node = path.node;
      const [specifier] = node.specifiers;
      components.push({
        component: specifier.local.name,
        filepath: node.source.value,
      });
    },
  });
  return components;
}

export const componentViewMarkdownPlugin = (md: MarkdownIt) => {
  md.use(markdownItContainer, CONTAINER_NAME, {
    validate: (params: string) => {
      return new RegExp(`^${CONTAINER_NAME}`).test(params.trim());
    },
    render: (tokens: Token[], idx: number) => {
      const token = tokens[idx];
      const content = token.meta?.componentViewSource?.trim() ?? "";
      const component = token.meta?.components?.find(({ component }) =>
        new RegExp(`^<${component}\\b`).test(content),
      );

      const componentContent = component?.filepath
        ? fs.readFileSync(component?.filepath, "utf-8")
        : content;

      const highlightContent =
        md.options.highlight?.(componentContent, "html", "") ?? "";
      if (token.nesting === 1) {
        return `<ComponentView src="${Buffer.from(content).toString("base64")}" highlightedSrc="${Buffer.from(highlightContent).toString("base64")}">\n`;
      } else {
        return `</ComponentView>`;
      }
    },
  });

  md.core.ruler.after("block", "component-view-source", (state) => {
    const sourceLines = state.src.split(/\r?\n/);
    const components = extractComponents(state.src);

    state.tokens.forEach((token) => {
      if (
        token.type !== `container_${CONTAINER_NAME}_open` ||
        token.nesting !== 1 ||
        !token.map
      ) {
        return;
      }

      const [startLine, endLine] = token.map;
      const source = sourceLines.slice(startLine + 1, endLine).join("\n");

      token.meta ??= {};
      token.meta.componentViewSource = source;
      token.meta.components = components.map(({ component, filepath }) => {
        const { realPath, path: _path } = state.env as MarkdownEnv;
        const resolvedPath = path.resolve(
          path.dirname(realPath ?? _path),
          filepath,
        );
        return { component, filepath: resolvedPath };
      });
    });
  });
};
