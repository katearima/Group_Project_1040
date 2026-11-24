<script setup lang="ts">
import { ref } from "vue";
import { useSession } from "../state/session.ts";

const { state, register, signIn } = useSession();

const mode = ref<"sign-in" | "register">("sign-in");
const username = ref("");
const password = ref("");
const error = ref<string | null>(null);
const busy = ref(false);

async function submit() {
  busy.value = true;
  error.value = null;
  const refusal =
    mode.value === "register"
      ? await register(username.value.trim(), password.value)
      : await signIn(username.value.trim(), password.value);
  busy.value = false;
  if (refusal) error.value = refusal;
}

function switchMode() {
  mode.value = mode.value === "sign-in" ? "register" : "sign-in";
  error.value = null;
}
</script>

<template>
  <main class="welcome">
    <div class="intro">
      <h1>Startup Matchmaker</h1>
      <p class="lead">Meet the founders and builders you'd want to start something with.</p>
      <ul class="points">
        <li><strong>Founders</strong> find builders who can ship their idea.</li>
        <li><strong>Builders</strong> find a startup worth joining.</li>
        <li>Both sides say yes, and then you can talk.</li>
      </ul>
    </div>

    <form class="card stack" @submit.prevent="submit">
      <h2>{{ mode === "sign-in" ? "Sign in" : "Create your account" }}</h2>
      <p v-if="state.notice" class="alert info" role="status">{{ state.notice }}</p>
      <div class="field">
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" autocomplete="username" required />
        <span v-if="mode === 'register'" class="hint">3 to 32 letters, numbers, underscores or hyphens. Others see this name.</span>
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
          required
        />
        <span v-if="mode === 'register'" class="hint">At least 8 characters.</span>
      </div>
      <p v-if="error" class="alert" role="alert">{{ error }}</p>
      <button class="btn" type="submit" :disabled="busy || !username || !password">
        {{ busy ? "One moment…" : mode === "sign-in" ? "Sign in" : "Create account" }}
      </button>
      <p class="switch">
        {{ mode === "sign-in" ? "New here?" : "Already have an account?" }}
        <button type="button" class="link" @click="switchMode">
          {{ mode === "sign-in" ? "Create an account" : "Sign in" }}
        </button>
      </p>
    </form>
  </main>
</template>

<style scoped>
.welcome {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-4);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-12);
  align-items: center;
}
@media (max-width: 760px) {
  .welcome {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding-top: var(--space-6);
  }
}
.intro h1 {
  font-size: 3.5rem;
  color: var(--color-accent);
}
.points {
  padding-left: var(--space-4);
  color: var(--color-text-muted);
}
form h2 {
  margin: 0;
  font-size: var(--text-xl);
}
.switch {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.link {
  border: 0;
  background: none;
  padding: 0;
  color: var(--color-accent);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}
</style>
