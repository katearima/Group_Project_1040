<script setup lang="ts">
import { ref } from "vue";
import { api } from "../api/client.ts";
import { call } from "../state/session.ts";
import { useNav } from "../state/nav.ts";
import { usePolling } from "../state/polling.ts";
import { useToast } from "../state/toast.ts";
import Avatar from "../components/Avatar.vue";

interface Person {
  user: string;
}

const { go } = useNav();
const { show } = useToast();

const incoming = ref<Person[]>([]);
const matches = ref<Person[]>([]);
const loaded = ref(false);
const error = ref<string | null>(null);
const confirming = ref<string | null>(null);
const working = ref<string | null>(null);

async function refresh() {
  const [interested, matched] = await Promise.all([
    call<{ interested: Person[] }>("/matching/interested-in-you", (session) => api.matching["interested-in-you"]({ session })),
    call<{ matches: Person[] }>("/matching/matches", (session) => api.matching.matches({ session })),
  ]);
  if (interested.ok && matched.ok) {
    incoming.value = interested.data.interested;
    matches.value = matched.data.matches;
    error.value = null;
  } else error.value = (!interested.ok ? interested : (matched as { message: string })).message;
  loaded.value = true;
}
usePolling(refresh, 8000);

async function respond(user: string, accept: boolean) {
  working.value = user;
  const result = accept
    ? await call<{ matched: boolean }>("/matching/show-interest", (session) => api.matching["show-interest"]({ session, other: user }))
    : await call("/matching/pass", (session) => api.matching.pass({ session, other: user }));
  working.value = null;
  if (!result.ok) show(result.message, "error");
  else if (accept) show(`It's a match with ${user}!`);
  else show(`You passed on ${user}.`);
  await refresh();
}

async function message(user: string) {
  const result = await call<{ conversations: { conversation: string; other: string }[] }>("/chats/list", (session) =>
    api.chats.list({ session }),
  );
  const found = result.ok ? result.data.conversations.find((each) => each.other === user) : undefined;
  if (found) go("messages", found.conversation);
  else go("messages");
}

async function unmatch(user: string) {
  working.value = user;
  const result = await call("/matching/unmatch", (session) => api.matching.unmatch({ session, other: user }));
  working.value = null;
  confirming.value = null;
  if (result.ok) show(`You unmatched with ${user}. The conversation is closed.`);
  else show(result.message, "error");
  await refresh();
}
</script>

<template>
  <main class="page">
    <h1>Matches</h1>
    <p class="lead">Say yes to people who are interested in you, and talk to your matches.</p>

    <p v-if="error" class="alert" role="alert">{{ error }}</p>
    <p v-else-if="!loaded" class="muted" role="status">Loading…</p>

    <template v-else>
      <h2 class="section-title first">Interested in you <span class="badge">{{ incoming.length }}</span></h2>
      <div v-if="incoming.length === 0" class="empty">
        <strong>No one yet</strong>
        <p>When someone shows interest in you, they'll appear here.</p>
      </div>
      <ul v-else class="list">
        <li v-for="person in incoming" :key="person.user" class="card person">
          <Avatar :username="person.user" />
          <strong class="who">{{ person.user }}</strong>
          <button class="btn secondary small" type="button" :disabled="working === person.user" @click="respond(person.user, false)">Pass</button>
          <button class="btn small" type="button" :disabled="working === person.user" @click="respond(person.user, true)">Show interest back</button>
        </li>
      </ul>

      <h2 class="section-title">Your matches <span class="badge">{{ matches.length }}</span></h2>
      <div v-if="matches.length === 0" class="empty">
        <strong>No matches yet</strong>
        <p>A match happens when you both show interest. Check Discover for people to start with.</p>
        <button class="btn secondary" type="button" @click="go('discover')">Go to Discover</button>
      </div>
      <ul v-else class="list">
        <li v-for="person in matches" :key="person.user" class="card person">
          <Avatar :username="person.user" />
          <strong class="who">{{ person.user }}</strong>
          <template v-if="confirming === person.user">
            <span class="muted ask">Unmatch? This closes your conversation.</span>
            <button class="btn secondary small" type="button" @click="confirming = null">Keep</button>
            <button class="btn danger small" type="button" :disabled="working === person.user" @click="unmatch(person.user)">Unmatch</button>
          </template>
          <template v-else>
            <button class="btn danger small" type="button" @click="confirming = person.user">Unmatch</button>
            <button class="btn small" type="button" @click="message(person.user)">Message</button>
          </template>
        </li>
      </ul>
    </template>
  </main>
</template>

<style scoped>
.section-title.first {
  margin-top: 0;
}
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
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  flex-wrap: wrap;
}
.who {
  flex: 1;
  font-size: var(--text-lg);
}
.ask {
  font-size: var(--text-sm);
}
</style>
