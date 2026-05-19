# Vitepress Plugin Component

[简体中文](README-zh-CN.md)

A VitePress plugin to display Vue components in your documentation with an automatically generated two-tab interface: one for the component's preview and another to show its source code.

## Features

- [x] **Component Preview** - Directly view the rendered output of your component within the documentation.
- [x] **Syntax Highlighting** - Compatible with VitePress's syntax highlighting.
- [x] **Code Copying** - One-click copy for the component's source code.
- [x] **Dark Mode Support** - Automatically adapts to VitePress's light and dark themes.
- [x] **Lightweight** - No complex dependencies, only `2kb` / gzip:`1kb`.
- [x] **Internationalization Support** - Default support for Chinese and English, configurable for other languages.

## Installation

```bash
npm install vitepress-plugin-component --save-dev
```

## Configuration

### Add Markdown Plugin

Add the plugin to your VitePress configuration file (`.vitepress/config.js` or `.vitepress/config.ts`):

```ts
import { defineConfig } from 'vitepress'
import { componentViewMarkdownPlugin } from 'vitepress-plugin-component'

export default defineConfig({
  // ... other configurations

  markdown: {
    config: (md) => {
      md.use(componentViewMarkdownPlugin)
    }
  },
})
```

### Configure Client

VitePress resolves themes from `.vitepress/theme/index.js` or `.vitepress/theme/index.ts`, and we configure the client here as well.

```ts
// theme/index.ts
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from 'vitepress-plugin-component/client'

export default {
  extends: DefaultTheme, // Use VitePress's default theme
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app)
  }
}
```

The `enhanceAppWithComponentView` function automatically registers the preview component on the passed root component.

### Configure Internationalization

The plugin gets language configuration from the `locales.lang` option in VitePress and supports `zh` and `en` languages by default. You can also manually configure other languages or even override the default languages.

Configure internationalization in the client configuration:

```ts
export default {
  // Other configurations
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app, {
      // Configure corresponding languages through localeMappings option
      localeMappings: {
        fr: {
          previewLabel: "foo",
          codeLabel: "bar",
        },
      },
    });
  },
};
```

## Example

This is an example of button SFC:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0)
</script>

<template>
  <button class="my-button" @click="count++">
    Clicked {{ count }} times
  </button>
</template>

<style>
.my-button {
  background-color: #3eaf7c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

VitePress supports [importing Vue components in markdown files](https://vitepress.dev/guide/using-vue#using-components), we import the Button component in the same way:

```bash
<script setup>
import Button from './Button.vue'
</script>
```

Then use the specified syntax:

```markdown
::: component-view
<Button />
:::
```

Here is the complete example code in a markdown file:

```markdown
<script setup>
import Button from './Button.vue'
</script>

# This will render a button with click count and a tab bar showing **Preview** and **Source Code**

::: component-view
<Button />
:::

##
```

You can view the component's preview and source code in the tabs above.

You can check out the [live demo here](https://vitepress-plugin-component-playgrou.vercel.app/).

## Notes

- Component paths should be relative to the project root.
- Current version supports simple Vue components; complex components might require additional configuration. - Components must be valid Single File Components (SFCs).
## License

[MIT](LICENSE)
