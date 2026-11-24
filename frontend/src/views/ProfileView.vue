<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api } from "../api/client.ts";
import { call } from "../state/session.ts";
import { useNav } from "../state/nav.ts";
import { useToast } from "../state/toast.ts";
import PreferencesForm from "../components/PreferencesForm.vue";
import ProfileForm, { type ProfileData } from "../components/ProfileForm.vue";

type Mine = ProfileData & { profile: string; startupPitch: string | null; visible: boolean };

const { go } = useNav();
const { show } = useToast();

const mine = ref<Mine | null>(null);
const loaded = ref(false);
const error = ref<string | null>(null);
const editing = ref(false);
const pitch = ref("");
const pitchError = ref<string | null>(null);
const publishError = ref<string | null>(null);
const busy = ref(false);

async function load() {
  const result = await call<Mine>("/profiles/mine", (session) => api.profiles.mine({ session }));
  if (result.ok) {
    mine.value = result.data;
    pitch.value = result.data.startupPitch ?? "";
  } else if (result.error === "NOT_FOUND") mine.value = null;
  else error.value = result.message;
  loaded.value = true;
}
onMounted(load);

const isFounder = computed(() => mine.value?.role === "FOUNDER" || mine.value?.role === "BOTH");

/** What is still missing before the profile can be published, in plain words. */
const missing = computed(() => {
  const profile = mine.value;
  if (!profile) return [];
  const list: string[] = [];
  if (!profile.name.trim()) list.push("a name");
  if (!profile.location.trim()) list.push("a location");
  if (profile.skills.length === 0) list.push("at least one skill");
  if (profile.interests.length === 0) list.push("at least one interest");
  if (isFounder.value && !profile.startupPitch) list.push("a startup pitch");
  return list;
});

async function saved() {
  editing.value = false;
  show("Profile saved.");
  await load();
}

async function savePitch() {
  pitchError.value = null;
  busy.value = true;
  const result = await call("/profiles/set-pitch", (session) => api.profiles["set-pitch"]({ session, pitch: pitch.value }));
  busy.value = false;
  if (result.ok) {
    show("Pitch saved.");
    await load();
  } else pitchError.value = result.message;
}

async function publish() {
  publishError.value = null;
  busy.value = true;
  const result = await call("/profiles/publish", (session) => api.profiles.publish({ session }));
  busy.value = false;
  if (result.ok) {
    show("Your profile is live. Finding your first matches…");
    await load();
    go("discover");
  } else publishError.value = result.message;
}
</script>

<template>
  <main class="page">
    <h1>Your profile</h1>
    <p class="lead">This is what powers your recommendations. Publish it to appear in other people's feeds.</p>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>
    <p v-else-if="!loaded" class="muted" role="status">Loading…</p>

    <section v-else-if="!mine" class="card">
      <h2>Create your profile</h2>
      <ProfileForm :initial="null" @saved="saved" />
    </section>

    <template v-else>
      <section class="card stack">
        <div class="row wrap">
          <h2 class="name">{{ mine.name }}</h2>
          <span class="badge" :class="mine.visible ? 'good' : 'warn'">{{ mine.visible ? "Published" : "Draft, not visible yet" }}</span>
          <span class="badge">{{ mine.role === "BOTH" ? "Founder and builder" : mine.role === "FOUNDER" ? "Founder" : "Builder" }}</span>
          <span class="spacer"></span>
          <button v-if="!editing" class="btn secondary small" type="button" @click="editing = true">Edit</button>
        </div>

        <template v-if="!editing">
          <p class="muted">{{ mine.university }}<template v-if="mine.major"> · {{ mine.major }}</template> · Class of {{ mine.graduationYear }} · {{ mine.location }} · {{ mine.availability }} h/week</p>
          <div class="row wrap"><span v-for="skill in mine.skills" :key="`s-${skill}`" class="chip">{{ skill }}</span></div>
          <div class="row wrap"><span v-for="interest in mine.interests" :key="`i-${interest}`" class="chip interest">{{ interest }}</span></div>
          <p v-if="mine.experience">{{ mine.experience }}</p>
        </template>
        <ProfileForm v-else :initial="mine" @saved="saved" />
      </section>

      <section v-if="isFounder" class="card stack pitch">
        <h2>Startup pitch</h2>
        <div class="field">
          <label for="pitch">What are you building, and who do you need?</label>
          <textarea id="pitch" v-model="pitch" placeholder="One or two sentences are enough."></textarea>
        </div>
        <p v-if="pitchError" class="alert" role="alert">{{ pitchError }}</p>
        <div class="row"><button class="btn secondary" type="button" :disabled="busy || !pitch.trim()" @click="savePitch">Save pitch</button></div>
      </section>

      <section v-if="!mine.visible" class="card stack publish">
        <h2>Publish</h2>
        <p v-if="missing.length" class="muted">Before you can publish, add {{ missing.join(", ") }}.</p>
        <p v-else class="muted">Everything is in place. Publishing makes you visible to people with a complementary role.</p>
        <p v-if="publishError" class="alert" role="alert">{{ publishError }}</p>
        <div class="row"><button class="btn" type="button" :disabled="busy || missing.length > 0" @click="publish">Publish profile</button></div>
      </section>

      <h2 class="section-title">Matching preferences</h2>
      <section class="card"><PreferencesForm /></section>
    </template>
  </main>
</template>

<style scoped>
.card + .card {
  margin-top: var(--space-4);
}
.name {
  margin: 0;
  font-size: var(--text-xl);
}
.chip.interest {
  background: #f9e7c2;
}
</style>
