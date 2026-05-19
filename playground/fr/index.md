<script setup>
import Button from '../Button.vue'
</script>

# Démo

Affiche une barre d'onglets présentant un **Aperçu** et le **Code source** ; le résultat de l'aperçu est un bouton-compteur.

:::tip
This not configure locale for the `component-view`, It will default to English.
:::

::: component-view
<Button />
:::

Ceci est réalisé à l'aide du code suivant :

```markdown
<script setup>
import Button from '../Button.vue'
</script>

::: component-view
<Button />
:::
```

`vitepress-plugin-component` s'efforce de s'adapter aux thèmes VitePress aussi fidèlement que possible. Vous pouvez changer de thème via la barre de navigation, puis observer les changements au sein des onglets.
