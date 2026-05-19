<script setup lang="ts">
import { ref } from "vue";

const counter = ref(0);
const pressed = ref(false);
</script>

<template>
    <button
        class="my-button"
        :data-pressed="pressed"
        @click="counter++"
        @mousedown="pressed = true"
        @mouseup="pressed = false"
        @touchstart="pressed = true"
        @touchend="pressed = false"
    >
        Counter: {{ counter }}
    </button>
</template>

<style>
.my-button {
    --color: var(--vp-c-brand-1);
    background-color: color(from var(--color) srgb r g b / 0.05);
    color: var(--color);
    border: 1px solid var(--color);
    padding: 4px 12px;
    border-radius: 16px;
    cursor: pointer;
    transform-origin: center;
    transition: transform 0.1s ease-in-out;
    will-change: transform;
}

.my-button[data-pressed="true"] {
    transform: scale(0.98);
}

.my-button:focus {
    outline: 2px solid var(--color);
    outline-offset: 2px;
}
</style>
