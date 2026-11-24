<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { api } from "../api/client.ts";
import { call, useSession } from "../state/session.ts";
import { useNav } from "../state/nav.ts";
import { ago } from "../state/format.ts";
import { usePolling } from "../state/polling.ts";
import Avatar from "../components/Avatar.vue";

interface Conversation {
  conversation: string;
  other: string;
  status: "OPEN" | "CLOSED";
}
interface Message {
  message: string;
  sender: string;
  content: string;
  sentAt: string;
}

const { route, go } = useNav();
const { state } = useSession();

const conversations = ref<Conversation[]>([]);
const messages = ref<Message[]>([]);
const status = ref<"OPEN" | "CLOSED">("OPEN");
const loaded = ref(false);
const error = ref<string | null>(null);
const threadError = ref<string | null>(null);
const draft = ref("");
const sending = ref(false);
const log = ref<HTMLElement | null>(null);

const active = computed(() => conversations.value.find((each) => each.conversation === route.value.id) ?? null);

async function refreshList() {
  const result = await call<{ conversations: Conversation[] }>("/chats/list", (session) => api.chats.list({ session }));
  if (result.ok) {
    conversations.value = result.data.conversations;
    error.value = null;
    // With nothing chosen, open the first conversation so the page is never an empty pane.
    if (!route.value.id && result.data.conversations.length > 0) go("messages", result.data.conversations[0].conversation);
  } else error.value = result.message;
  loaded.value = true;
}

async function refreshThread() {
  const id = route.value.id;
  if (!id) return;
  const result = await call<{ messages: Message[]; status: "OPEN" | "CLOSED" }>("/chats/messages", (session) =>
    api.chats.messages({ session, conversation: id }),
  );
  if (id !== route.value.id) return;
  if (result.ok) {
    const grew = result.data.messages.length !== messages.value.length;
    messages.value = result.data.messages;
    status.value = result.data.status;
    threadError.value = null;
    if (grew) await scrollDown();
  } else threadError.value = result.message;
}

async function scrollDown() {
  await nextTick();
  if (log.value) log.value.scrollTop = log.value.scrollHeight;
}

usePolling(async () => {
  await refreshList();
  await refreshThread();
}, 4000);

watch(
  () => route.value.id,
  async () => {
    messages.value = [];
    threadError.value = null;
    await refreshThread();
    await scrollDown();
  },
);

async function send() {
  const id = route.value.id;
  const content = draft.value.trim();
  if (!id || !content) return;
  sending.value = true;
  threadError.value = null;
  const result = await call("/chats/send", (session) => api.chats.send({ session, conversation: id, content }));
  sending.value = false;
  if (result.ok) {
    draft.value = "";
    await refreshThread();
    await scrollDown();
  } else {
    threadError.value = result.message;
    await refreshThread();
  }
}
</script>

<template>
  <main class="page wide">
    <h1>Messages</h1>
    <p v-if="error" class="alert" role="alert">{{ error }}</p>
    <p v-else-if="!loaded" class="muted" role="status">Loading…</p>

    <div v-else-if="conversations.length === 0" class="empty">
      <strong>No conversations yet</strong>
      <p>When you match with someone, a conversation opens here automatically.</p>
      <button class="btn secondary" type="button" @click="go('discover')">Find people</button>
    </div>

    <div v-else class="chat card">
      <nav class="people" aria-label="Conversations">
        <button
          v-for="each in conversations"
          :key="each.conversation"
          type="button"
          class="person"
          :class="{ on: each.conversation === route.id }"
          :aria-current="each.conversation === route.id ? 'true' : undefined"
          @click="go('messages', each.conversation)"
        >
          <Avatar :username="each.other" :size="36" />
          <span class="name">{{ each.other }}</span>
          <span v-if="each.status === 'CLOSED'" class="badge">Closed</span>
        </button>
      </nav>

      <section class="thread" aria-label="Conversation">
        <template v-if="active">
          <header class="row">
            <Avatar :username="active.other" :size="36" />
            <strong>{{ active.other }}</strong>
          </header>
          <ol ref="log" class="log" aria-live="polite">
            <li v-if="messages.length === 0" class="muted none">No messages yet. Say hello!</li>
            <li v-for="each in messages" :key="each.message" class="bubble" :class="{ mine: each.sender === state.username }">
              <span class="text">{{ each.content }}</span>
              <span class="time">{{ ago(each.sentAt) }}</span>
            </li>
          </ol>
          <p v-if="threadError" class="alert" role="alert">{{ threadError }}</p>
          <p v-if="status === 'CLOSED'" class="alert info">This conversation is closed because you unmatched. You can read it, but not reply.</p>
          <form v-else class="compose" @submit.prevent="send">
            <label class="visually-hidden" for="draft">Message {{ active.other }}</label>
            <input id="draft" v-model="draft" type="text" placeholder="Write a message…" autocomplete="off" />
            <button class="btn" type="submit" :disabled="sending || !draft.trim()">Send</button>
          </form>
        </template>
        <p v-else class="muted none">Choose a conversation.</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.page.wide {
  max-width: 1000px;
}
.chat {
  display: grid;
  grid-template-columns: 240px 1fr;
  padding: 0;
  overflow: hidden;
  min-height: 460px;
}
@media (max-width: 680px) {
  .chat {
    grid-template-columns: 1fr;
  }
}
.people {
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  max-height: 560px;
  overflow: auto;
}
@media (max-width: 680px) {
  .people {
    flex-direction: row;
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }
}
.person {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}
.person:hover {
  background: #f3f0e6;
}
.person.on {
  background: #eef1fc;
}
.name {
  flex: 1;
  font-weight: 500;
}
.thread {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-3);
  min-width: 0;
}
.log {
  list-style: none;
  margin: 0;
  padding: var(--space-2) 0;
  flex: 1;
  min-height: 240px;
  max-height: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.none {
  margin: auto;
}
.bubble {
  max-width: 75%;
  align-self: flex-start;
  background: #f1eee4;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  overflow-wrap: anywhere;
}
.bubble.mine {
  align-self: flex-end;
  background: var(--color-accent);
  color: #fff;
}
.time {
  font-size: var(--text-xs);
  opacity: 0.7;
}
.compose {
  display: flex;
  gap: var(--space-2);
}
</style>
