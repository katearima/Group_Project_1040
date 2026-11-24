<script setup lang="ts">
import { onMounted } from "vue";
import { api } from "../api/client.ts";
import { call, useSession } from "../state/session.ts";
import { type RouteName, useNav } from "../state/nav.ts";
import DiscoverView from "../views/DiscoverView.vue";
import MatchesView from "../views/MatchesView.vue";
import MessagesView from "../views/MessagesView.vue";
import ProfileView from "../views/ProfileView.vue";
import Avatar from "./Avatar.vue";
import NotificationBell from "./NotificationBell.vue";

const { state, signOut } = useSession();
const { route, go } = useNav();

const TABS: { name: RouteName; label: string }[] = [
  { name: "discover", label: "Discover" },
  { name: "matches", label: "Matches" },
  { name: "messages", label: "Messages" },
  { name: "profile", label: "Profile" },
];

// A new account has no profile yet, so start there; everyone else starts on Discover.
onMounted(async () => {
  if (window.location.hash) return;
  const mine = await call("/profiles/mine", (session) => api.profiles.mine({ session }));
  if (!mine.ok && mine.error === "NOT_FOUND") go("profile");
});
</script>

<template>
  <header class="bar">
    <div class="inner">
      <button type="button" class="brand" @click="go('discover')">Startup Matchmaker</button>
      <nav aria-label="Main">
        <button
          v-for="tab in TABS"
          :key="tab.name"
          type="button"
          class="tab"
          :class="{ on: route.name === tab.name }"
          :aria-current="route.name === tab.name ? 'page' : undefined"
          @click="go(tab.name)"
        >
          {{ tab.label }}
        </button>
      </nav>
      <span class="spacer"></span>
      <NotificationBell />
      <span class="me"><Avatar :username="state.username ?? '?'" :size="30" /> {{ state.username }}</span>
      <button type="button" class="btn secondary small" @click="signOut">Sign out</button>
    </div>
  </header>

  <DiscoverView v-if="route.name === 'discover'" />
  <MatchesView v-else-if="route.name === 'matches'" />
  <MessagesView v-else-if="route.name === 'messages'" />
  <ProfileView v-else />
</template>

<style scoped>
.bar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.brand {
  border: 0;
  background: none;
  padding: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-accent);
  cursor: pointer;
  letter-spacing: 0.02em;
}
nav {
  display: flex;
  gap: var(--space-1);
  margin-left: var(--space-3);
}
.tab {
  border: 0;
  background: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
}
.tab:hover {
  background: #f3f0e6;
}
.tab.on {
  background: #eef1fc;
  color: var(--color-accent);
  font-weight: 700;
}
.me {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}
@media (max-width: 900px) {
  .me {
    display: none;
  }
}
@media (max-width: 720px) {
  nav {
    order: 5;
    width: 100%;
    margin-left: 0;
  }
}
</style>
