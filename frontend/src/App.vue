<script setup lang="ts">
import AppShell from "./components/AppShell.vue";
import ToastHost from "./components/ToastHost.vue";
import AuthScreen from "./views/AuthScreen.vue";
import { useSession } from "./state/session.ts";

const { state } = useSession();
</script>

<template>
  <AppShell v-if="state.session" />
  <AuthScreen v-else />
  <ToastHost />
</template>
