<script setup lang="ts">
import { reactive, ref } from "vue";
import { api } from "../api/client.ts";
import { call } from "../state/session.ts";
import TagInput from "./TagInput.vue";

export interface ProfileData {
  role: "FOUNDER" | "BUILDER" | "BOTH";
  name: string;
  university: string;
  major: string;
  graduationYear: number;
  skills: string[];
  experience: string;
  interests: string[];
  location: string;
  latitude: number;
  longitude: number;
  availability: number;
}

const props = defineProps<{ initial: ProfileData | null }>();
const emit = defineEmits<{ saved: [] }>();

const creating = props.initial === null;
const form = reactive<ProfileData>(
  props.initial
    ? { ...props.initial, skills: [...props.initial.skills], interests: [...props.initial.interests] }
    : {
        role: "BUILDER",
        name: "",
        university: "",
        major: "",
        graduationYear: new Date().getFullYear() + 1,
        skills: [],
        experience: "",
        interests: [],
        location: "",
        latitude: 42.3601,
        longitude: -71.0942,
        availability: 10,
      },
);

/** Boston-area campuses, so most people never have to type coordinates. */
const PLACES = [
  { label: "MIT", location: "MIT campus", latitude: 42.3601, longitude: -71.0942 },
  { label: "Harvard", location: "Harvard campus", latitude: 42.377, longitude: -71.1167 },
  { label: "Northeastern", location: "Northeastern campus", latitude: 42.3398, longitude: -71.0892 },
  { label: "Boston University", location: "BU campus", latitude: 42.3505, longitude: -71.1054 },
  { label: "Tufts", location: "Tufts campus", latitude: 42.4075, longitude: -71.119 },
  { label: "Wellesley", location: "Wellesley campus", latitude: 42.2936, longitude: -71.3056 },
];
const place = ref("");
const customPlace = ref(!creating && !PLACES.some((each) => each.location === props.initial?.location));

function pickPlace() {
  const chosen = PLACES.find((each) => each.label === place.value);
  customPlace.value = place.value === "custom";
  if (!chosen) return;
  form.location = chosen.location;
  form.latitude = chosen.latitude;
  form.longitude = chosen.longitude;
  if (!form.university) form.university = chosen.label;
}

const error = ref<string | null>(null);
const busy = ref(false);

async function save() {
  busy.value = true;
  error.value = null;
  const { role, ...rest } = form;
  const body = {
    ...rest,
    graduationYear: Number(form.graduationYear),
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    availability: Number(form.availability),
  };
  const result = creating
    ? await call("/profiles/create", (session) => api.profiles.create({ ...body, role, session }))
    : await call("/profiles/update", (session) => api.profiles.update({ ...body, session }));
  busy.value = false;
  if (result.ok) emit("saved");
  else error.value = result.message;
}
</script>

<template>
  <form class="stack" @submit.prevent="save">
    <fieldset v-if="creating" class="role">
      <legend class="label">I am a…</legend>
      <label><input v-model="form.role" type="radio" value="BUILDER" /> Builder <small>looking for a startup to join</small></label>
      <label><input v-model="form.role" type="radio" value="FOUNDER" /> Founder <small>looking for teammates</small></label>
      <label><input v-model="form.role" type="radio" value="BOTH" /> Both</label>
      <span class="hint">You can't change this later.</span>
    </fieldset>

    <div class="grid2">
      <div class="field">
        <label for="pf-name">Name</label>
        <input id="pf-name" v-model="form.name" type="text" required />
      </div>
      <div class="field">
        <label for="pf-uni">University</label>
        <input id="pf-uni" v-model="form.university" type="text" required />
      </div>
      <div class="field">
        <label for="pf-major">Major</label>
        <input id="pf-major" v-model="form.major" type="text" />
      </div>
      <div class="field">
        <label for="pf-year">Graduation year</label>
        <input id="pf-year" v-model.number="form.graduationYear" type="number" min="1900" step="1" required />
      </div>
    </div>

    <TagInput id="pf-skills" v-model="form.skills" label="Skills" hint="For example: software engineering, design, sales." />
    <TagInput id="pf-interests" v-model="form.interests" label="Interests" hint="Industries or problems you care about." />

    <div class="field">
      <label for="pf-exp">Experience</label>
      <textarea id="pf-exp" v-model="form.experience" placeholder="Past projects, jobs or classes that show what you can do."></textarea>
    </div>

    <div class="grid2">
      <div class="field">
        <label for="pf-place">Where are you based?</label>
        <select id="pf-place" v-model="place" @change="pickPlace">
          <option value="" disabled>{{ customPlace || initial ? "Change location…" : "Choose a campus…" }}</option>
          <option v-for="each in PLACES" :key="each.label" :value="each.label">{{ each.label }}</option>
          <option value="custom">Somewhere else</option>
        </select>
        <span class="hint">Used to rank people near you. Others only see how well you match.</span>
      </div>
      <div class="field">
        <label for="pf-avail">Hours per week you can give</label>
        <input id="pf-avail" v-model.number="form.availability" type="number" min="0" step="1" required />
      </div>
    </div>

    <div v-if="customPlace || form.location" class="grid2">
      <div class="field">
        <label for="pf-loc">Location name</label>
        <input id="pf-loc" v-model="form.location" type="text" required />
      </div>
      <div v-if="customPlace" class="grid2">
        <div class="field">
          <label for="pf-lat">Latitude</label>
          <input id="pf-lat" v-model.number="form.latitude" type="number" step="any" min="-90" max="90" />
        </div>
        <div class="field">
          <label for="pf-lng">Longitude</label>
          <input id="pf-lng" v-model.number="form.longitude" type="number" step="any" min="-180" max="180" />
        </div>
      </div>
    </div>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>
    <div class="row">
      <button class="btn" type="submit" :disabled="busy">{{ busy ? "Saving…" : creating ? "Create profile" : "Save changes" }}</button>
    </div>
  </form>
</template>

<style scoped>
.role {
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
}
.role small {
  color: var(--color-text-muted);
}
</style>
