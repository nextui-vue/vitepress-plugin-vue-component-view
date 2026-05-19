# Vitepress Plugin Component

[English](README.md)

一个 VitePress 插件，用于生成一个双标签页组件：一个用于组件预览，另一个用于显示其源代码。

## 功能

- [x] **组件预览** 直接在文档中查看组件的渲染输出。
- [x] **语法高亮** 兼容VitePress的语法高亮。
- [x] **代码复制** 一键复制组件的源代码。
- [x] **深色模式支持** 自动适应 VitePress 的浅色和深色主题。
- [x] **轻量级** 无复杂的依赖项, 仅 `2kb` / gzip:`1kb`。
- [x] **国际化支持** 默认支持中文和英语，可通过配置来支持其他语言。

## 安装

```bash
npm install vitepress-plugin-component --save-dev
```

## 配置

### 添加Markdown插件

将插件添加到VitePress的配置文件中（`.vitepress/config.js` 或 `.vitepress/config.ts`）：

```ts
import { defineConfig } from 'vitepress'
import { componentViewMarkdownPlugin } from 'vitepress-plugin-component'

export default defineConfig({
  // ... 其他配置

  markdown: {
    config: (md) => {
      md.use(componentViewMarkdownPlugin)
    }
  },
})
```

### 配置客户端

vitepress从`.vitepress/theme/index.js` 或 `.vitepress/theme/index.ts`中解析主题，同样我们在这里配置客户端。

```ts
// theme/index.ts
import DefaultTheme from "vitepress/theme";
import { enhanceAppWithComponentView } from 'vitepress-plugin-component/client'

export default {
  extends: DefaultTheme, // 使用vitepress的默认主题
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app)
  }
}
```

`enhanceAppWithComponentView`函数内部会在传递的根组件上自动注册预览组件。

### 配置国际化

插件从vitepress中的`locales.lang`选项获取语言配置，并默认支持`zh`和`en`两种语言。你也可以手动配置其他语言甚至覆盖默认语言。

在客户端配置中配置国际化

```ts
export default {
  // 其他配置
  enhanceApp({ app }) {
    enhanceAppWithComponentView(app, {
      // 通过localeMappings选项配置对应的语言
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

## 示例

这是一个Button组件的示例：

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0)
</script>

<template>
  <button class="my-button" @click="count++">
    点击了 {{ count }} 次
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

Vitepress支持[在markdown文件中导入Vue组件](https://vitepress.dev/zh/guide/using-vue#using-components), 我们以同样的方式导入Button组件：

```bash
<script setup>
import Button from './Button.vue'
</script>
```

然后使用指定的语法：

```markdown
::: component-view
<Button />
:::
```

以下是完整的示例代码，在markdown文件内：

```markdown
<script setup>
import Button from './Button.vue'
</script>

# 这将渲染一个带有点击次数的按钮以及一个显示**预览**和**源代码**的tab条

::: component-view
<Button />
:::

##
```

你可以前往此处的[查看效果](https://vitepress-plugin-component-playgrou.vercel.app/)。
## 许可证

[MIT](LICENSE)
