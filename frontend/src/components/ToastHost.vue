<script setup lang="ts">
import { useToast } from "../state/toast.ts";

const { toasts } = useToast();
</script>

<template>
  <div class="toasts" aria-live="polite">
    <p v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.kind">{{ toast.text }}</p>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 50;
  width: min(440px, 92vw);
}
.toast {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  background: var(--color-text);
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.toast.error {
  background: var(--color-danger);
}
</style>
