<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../api/client.ts";
import { call } from "../state/session.ts";
import { useToast } from "../state/toast.ts";
import TagInput from "./TagInput.vue";

const { show } = useToast();

const skills = ref<string[]>([]);
const interests = ref<string[]>([]);
const universities = ref<string[]>([]);
const distance = ref<number | null>(null);
const availability = ref<number | null>(null);
const error = ref<string | null>(null);
const busy = ref(false);
const loaded = ref(false);

onMounted(async () => {
  const result = await call<{
    skills: string[];
    interests: string[];
    universities: string[];
    distance: number | null;
    availability: number | null;
  }>("/recommendations/preferences", (session) => api.recommendations.preferences({ session }));
  if (result.ok) {
    skills.value = [...result.data.skills];
    interests.value = [...result.data.interests];
    universities.value = [...result.data.universities];
    distance.value = result.data.distance;
    availability.value = result.data.availability;
  } else error.value = result.message;
  loaded.value = true;
});

async function save() {
  busy.value = true;
  error.value = null;
  const result = await call("/recommendations/set-preferences", (session) =>
    api.recommendations["set-preferences"]({
      session,
      skills: skills.value,
      interests: interests.value,
      universities: universities.value,
      ...(typeof distance.value === "number" ? { distance: distance.value } : {}),
      ...(typeof availability.value === "number" ? { availability: availability.value } : {}),
    }),
  );
  busy.value = false;
  if (result.ok) show("Preferences saved. Your feed is updating.");
  else error.value = result.message;
}
</script>

<template>
  <form class="stack" @submit.prevent="save">
    <p class="hint">Tell us what you'd like in a teammate. Leave anything blank to not filter on it.</p>
    <TagInput id="pr-skills" v-model="skills" label="Skills you want" />
    <TagInput id="pr-interests" v-model="interests" label="Interests you want to share" />
    <TagInput id="pr-unis" v-model="universities" label="Preferred universities" />
    <div class="grid2">
      <div class="field">
        <label for="pr-dist">Farthest distance (km)</label>
        <input id="pr-dist" v-model.number="distance" type="number" min="0" step="any" placeholder="No limit" />
      </div>
      <div class="field">
        <label for="pr-avail">Hours per week they should have</label>
        <input id="pr-avail" v-model.number="availability" type="number" min="0" step="any" placeholder="Any" />
      </div>
    </div>
    <p v-if="error" class="alert" role="alert">{{ error }}</p>
    <div class="row">
      <button class="btn" type="submit" :disabled="busy || !loaded">{{ busy ? "Saving…" : "Save preferences" }}</button>
    </div>
  </form>
</template>
