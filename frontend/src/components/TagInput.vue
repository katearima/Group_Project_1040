<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ id: string; label: string; hint?: string; placeholder?: string }>();
const model = defineModel<string[]>({ required: true });
const draft = ref("");

function add() {
  const text = draft.value.trim();
  if (text && !model.value.includes(text)) model.value = [...model.value, text];
  draft.value = "";
}
function remove(entry: string) {
  model.value = model.value.filter((each) => each !== entry);
}
function onKey(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    add();
  } else if (event.key === "Backspace" && draft.value === "" && model.value.length > 0) {
    model.value = model.value.slice(0, -1);
  }
}
</script>

<template>
  <div class="field">
    <label :for="props.id">{{ label }}</label>
    <div v-if="model.length" class="row wrap" role="list">
      <span v-for="entry in model" :key="entry" class="chip" role="listitem">
        {{ entry }}
        <button type="button" :aria-label="`Remove ${entry}`" @click="remove(entry)">×</button>
      </span>
    </div>
    <input :id="props.id" v-model="draft" type="text" :placeholder="placeholder ?? 'Type, then press Enter'" @keydown="onKey" @blur="add" />
    <span v-if="hint" class="hint">{{ hint }}</span>
  </div>
</template>
