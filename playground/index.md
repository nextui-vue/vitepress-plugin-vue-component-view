<script setup>
import Button from './Button.vue'
</script>

# Demo

Renders a tab bar displaying a **Preview** and **Source Code**; the preview result is a counter button.

::: component-view
<Button />
:::

This is achieved using the following code:

```markdown
<script setup>
import Button from '../Button.vue'
</script>

::: component-view
<Button />
:::
```

`vitepress-plugin-component` strives to adapt to VitePress themes as closely as possible. You can switch themes via the navigation bar and then observe the changes within the tabs.
