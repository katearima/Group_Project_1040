<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { api } from "../api/client.ts";
import { call } from "../state/session.ts";
import { useNav } from "../state/nav.ts";
import { ago } from "../state/format.ts";
import { usePolling } from "../state/polling.ts";

interface Note {
  notification: string;
  message: string;
  link: string;
  createdAt: string;
  status: "UNREAD" | "READ";
}

const { goToLink } = useNav();
const open = ref(false);
const notes = ref<Note[]>([]);
const root = ref<HTMLElement | null>(null);
const error = ref<string | null>(null);

async function refresh() {
  const result = await call<{ notifications: Note[] }>("/notifications/list", (session) =>
    api.notifications.list({ session }),
  );
  if (result.ok) {
    notes.value = result.data.notifications;
    error.value = null;
  } else error.value = result.message;
}

usePolling(refresh, 8000);

const unread = () => notes.value.filter((note) => note.status === "UNREAD").length;

async function openNote(note: Note) {
  if (note.status === "UNREAD") {
    await call("/notifications/mark-read", (session) =>
      api.notifications["mark-read"]({ session, notification: note.notification }),
    );
    await refresh();
  }
  open.value = false;
  goToLink(note.link);
}

async function dismiss(note: Note) {
  const result = await call("/notifications/dismiss", (session) =>
    api.notifications.dismiss({ session, notification: note.notification }),
  );
  if (!result.ok) error.value = result.message;
  await refresh();
}

function outside(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) open.value = false;
}
onMounted(() => document.addEventListener("click", outside));
onUnmounted(() => document.removeEventListener("click", outside));
</script>

<template>
  <div ref="root" class="bell">
    <button
      type="button"
      class="btn secondary small"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="open = !open"
    >
      Notifications
      <span v-if="unread() > 0" class="count" :aria-label="`${unread()} unread`">{{ unread() }}</span>
    </button>
    <div v-if="open" class="panel card" role="region" aria-label="Notifications">
      <p v-if="error" class="alert" role="alert">{{ error }}</p>
      <p v-if="notes.length === 0" class="muted empty-note">Nothing yet. New interest, matches and messages show up here.</p>
      <ul v-else>
        <li v-for="note in notes" :key="note.notification" :class="{ unread: note.status === 'UNREAD' }">
          <button type="button" class="open" @click="openNote(note)">
            <span class="msg">{{ note.message }}</span>
            <span class="time">{{ ago(note.createdAt) }}</span>
          </button>
          <button type="button" class="x" :aria-label="`Dismiss: ${note.message}`" @click="dismiss(note)">×</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.bell {
  position: relative;
}
.count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--color-orange);
  color: #fff;
  font-size: var(--text-xs);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(340px, 90vw);
  padding: var(--space-3);
  z-index: 20;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 340px;
  overflow: auto;
}
li {
  display: flex;
  align-items: stretch;
  border-radius: var(--radius-sm);
}
li.unread {
  background: #eef1fc;
}
.open {
  flex: 1;
  text-align: left;
  border: 0;
  background: none;
  padding: var(--space-3);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.msg {
  font-weight: 500;
}
li.unread .msg {
  font-weight: 700;
}
.time {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
.x {
  border: 0;
  background: none;
  padding: 0 var(--space-3);
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: var(--text-lg);
}
.empty-note {
  margin: var(--space-2);
}
</style>
