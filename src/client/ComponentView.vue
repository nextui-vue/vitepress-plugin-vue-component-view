<script setup lang="ts" generic="T">
import { computed, ref, useId, watch } from "vue";
import { useData } from "vitepress";
import { useLocaleMappings } from "./useLocaleMappings";

import type { LocaleMappings } from "./useLocaleMappings";

const localMappings: LocaleMappings = {
    en: {
        previewLabel: "Preview",
        codeLabel: "Source Code",
    },
    zh: {
        previewLabel: "预览",
        codeLabel: "源代码",
    },
};

const props = defineProps<{
    src: string;
    highlightedSrc?: string;
    previewLabel?: string;
    codeLabel?: string;
}>();

const { lang } = useData();
const { get } = useLocaleMappings();

const labels = computed(() => {
    const mappings = { ...localMappings, ...(get() ?? {}) };
    // Default to English mappings if no locale-specific mappings are found
    const { previewLabel: preview, codeLabel: code } =
        mappings[lang.value] ?? localMappings.en;
    return [
        {
            label: preview,
            value: "preview",
        },
        { label: code, value: "code" },
    ] as const;
});

const decodedSrc = ref("");
const highlightedSrc = ref("");
const activedTab = ref<"preview" | "code">("preview");
const copied = ref(false);
const tabGroupId = useId();

watch(
    [() => props.src, () => props.highlightedSrc],
    async ([src, highlight = ""]) => {
        try {
            decodedSrc.value = atob(src);
        } catch (e) {
            decodedSrc.value = src;
        }

        try {
            highlightedSrc.value = atob(highlight);
        } catch (e) {
            highlightedSrc.value = highlight;
        }

        try {
            atob(src);
        } catch (e) {}
    },
    {
        immediate: true,
    },
);

async function copyCode() {
    await navigator.clipboard.writeText(decodedSrc.value);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}
</script>

<template>
    <div class="vp-component-tabs">
        <header>
            <template v-for="{ label, value } in labels" :key="value">
                <input
                    :id="`tab-${tabGroupId}-${value}`"
                    type="radio"
                    :name="`vp-component-tabs-${tabGroupId}`"
                    style="position: fixed; opacity: 0; pointer-events: none"
                    :data-checked="activedTab === value"
                />
                <label
                    :for="`tab-${tabGroupId}-${value}`"
                    @click="activedTab = value"
                    >{{ label }}</label
                >
            </template>
        </header>

        <main v-show="activedTab === 'preview'">
            <slot />
        </main>

        <div
            v-show="activedTab === 'code'"
            :class="`language-vue${activedTab === 'code' ? ' active' : ''}`"
            style="margin: 0px"
        >
            <button title="" class="copy"></button>
            <span class="lang">Vue</span>
            <span v-html="highlightedSrc" />
        </div>
    </div>
</template>

<style>
.vp-component-tabs {
    margin: 16px 0;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    row-gap: 16px;
}

.vp-component-tabs > header {
    display: flex;
    position: relative;
    border-radius: 8px;
    overflow-x: auto;
    overflow-y: hidden;
}

.vp-component-tabs > header input + label {
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-code-tab-text-color);
    white-space: nowrap;
    cursor: pointer;
    transition:
        color 0.25s,
        background-color 0.25s;
}

.vp-component-tabs > header input + label::after {
    content: "";
    position: absolute;
    height: 4px;
    border-radius: 2px;
    left: 8px;
    right: 8px;
    bottom: -1px;
    transition: background-color 0.25s;
}
.vp-component-tabs > header input[data-checked="true"] + label::after {
    background-color: var(--vp-code-tab-active-bar-color);
}
.vp-component-tabs > header input[data-checked="true"] + label,
.vp-component-tabs > header label:hover {
    color: var(--vp-code-tab-active-text-color);
}

.vp-component-tabs > main {
    padding: 20px;
    background-color: var(--vp-nav-bg-color);
    border-radius: 8px;
    outline: 1px solid var(--vp-c-divider);
}

.vp-component-tabs > section {
    background-color: var(--vp-code-block-bg);
    border-radius: 8px;
    padding: 24px;
    overflow: auto;
}
</style>
