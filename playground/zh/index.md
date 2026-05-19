<script setup>
import Button from '../Button.vue'
</script>

# 演示

渲染一个显示**预览**和**源代码**的tab条，预览的结果是一个计数器按钮

::: component-view
<Button />
:::

它是通过下面的代码实现的：

```markdown
<script setup>
import Button from '../Button.vue'
</script>

::: component-view
<Button />
:::
```

`vitepress-plugin-component`会尽可能的适配vitepress主题，你可以在导航栏中切换主题，然后再观察tabs中的变化。
