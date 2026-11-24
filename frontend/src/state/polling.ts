import { onMounted, onUnmounted } from "vue";

/** Runs `refresh` now and then every `ms` while the page is visible, so lists stay current without a reload. */
export function usePolling(refresh: () => Promise<void> | void, ms: number) {
  let timer: ReturnType<typeof setInterval> | undefined;
  const tick = () => {
    if (document.visibilityState === "visible") void refresh();
  };
  onMounted(() => {
    void refresh();
    timer = setInterval(tick, ms);
    document.addEventListener("visibilitychange", tick);
  });
  onUnmounted(() => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", tick);
  });
}
