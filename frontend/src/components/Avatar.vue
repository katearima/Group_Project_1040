<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{ username: string; size?: number }>(), { size: 44 });

const COLORS = ["#1f3fbf", "#e8552e", "#3e6b2f", "#9b4fa0", "#b8860b"];
const color = computed(() => {
  let hash = 0;
  for (const char of props.username) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
});
</script>

<template>
  <span
    class="avatar"
    aria-hidden="true"
    :style="{ background: color, width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.45}px` }"
    >{{ username.slice(0, 1).toUpperCase() }}</span
  >
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  flex: none;
}
</style>
