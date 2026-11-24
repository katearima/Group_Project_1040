<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../api/client.ts";
import { call } from "../state/session.ts";
import { useNav } from "../state/nav.ts";
import { percent } from "../state/format.ts";
import { usePolling } from "../state/polling.ts";
import { useToast } from "../state/toast.ts";
import Avatar from "../components/Avatar.vue";

interface Candidate {
  user: string;
  score: number;
}

const { go } = useNav();
const { show } = useToast();

const feed = ref<Candidate[]>([]);
const loaded = ref(false);
const error = ref<string | null>(null);
const hasPublished = ref<boolean | null>(null);
const working = ref<string | null>(null);

async function refresh() {
  const result = await call<{ feed: Candidate[] }>("/recommendations/feed", (session) => api.recommendations.feed({ session }));
  if (result.ok) {
    feed.value = result.data.feed;
    error.value = null;
  } else error.value = result.message;
  loaded.value = true;
}

onMounted(async () => {
  const mine = await call<{ visible: boolean }>("/profiles/mine", (session) => api.profiles.mine({ session }));
  hasPublished.value = mine.ok ? mine.data.visible : false;
});
usePolling(refresh, 10000);

async function interested(candidate: Candidate) {
  working.value = candidate.user;
  const result = await call<{ matched: boolean }>("/matching/show-interest", (session) =>
    api.matching["show-interest"]({ session, other: candidate.user }),
  );
  working.value = null;
  if (!result.ok) {
    show(result.message, "error");
    await refresh();
    return;
  }
  feed.value = feed.value.filter((each) => each.user !== candidate.user);
  if (result.data.matched) {
    show(`It's a match with ${candidate.user}! Say hello in Messages.`);
    go("messages");
  } else show(`Interest sent to ${candidate.user}. You'll be notified if they say yes.`);
}
</script>

<template>
  <main class="page">
    <h1>Discover</h1>
    <p class="lead">People ranked by how well they fit what you're looking for. Show interest, and if they do too, it's a match.</p>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>
    <p v-else-if="!loaded" class="muted" role="status">Finding people…</p>

    <div v-else-if="feed.length === 0" class="empty">
      <template v-if="hasPublished === false">
        <strong>Publish your profile to get recommendations</strong>
        <p>Your feed fills in once your profile is live.</p>
        <button class="btn" type="button" @click="go('profile')">Go to your profile</button>
      </template>
      <template v-else>
        <strong>No recommendations right now</strong>
        <p>New people appear here as they publish. Widening your preferences can help.</p>
        <button class="btn secondary" type="button" @click="go('profile')">Adjust preferences</button>
      </template>
    </div>

    <ul v-else class="list">
      <li v-for="candidate in feed" :key="candidate.user" class="card person">
        <Avatar :username="candidate.user" :size="52" />
        <div class="who">
          <strong>{{ candidate.user }}</strong>
          <div class="score" :aria-label="`${percent(candidate.score)} percent match`">
            <span class="bar"><span class="fill" :style="{ width: `${percent(candidate.score)}%` }"></span></span>
            <span class="pct">{{ percent(candidate.score) }}% match</span>
          </div>
        </div>
        <button class="btn" type="button" :disabled="working === candidate.user" @click="interested(candidate)">
          {{ working === candidate.user ? "Sending…" : "Show interest" }}
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.person {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
}
.who {
  flex: 1;
  min-width: 0;
}
.who strong {
  font-size: var(--text-lg);
}
.score {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.bar {
  flex: 0 1 180px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-border);
  overflow: hidden;
}
.fill {
  display: block;
  height: 100%;
  background: var(--color-green);
}
.pct {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
@media (max-width: 520px) {
  .person {
    flex-wrap: wrap;
  }
  .btn {
    width: 100%;
  }
}
</style>
