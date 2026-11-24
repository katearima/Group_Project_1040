import { readonly, ref } from "vue";

export interface Toast {
  id: number;
  text: string;
  kind: "ok" | "error";
}

const toasts = ref<Toast[]>([]);
let next = 1;

/** Shows a short message that fades after a few seconds. */
function show(text: string, kind: Toast["kind"] = "ok") {
  const id = next++;
  toasts.value.push({ id, text, kind });
  setTimeout(() => (toasts.value = toasts.value.filter((toast) => toast.id !== id)), 4500);
}

export function useToast() {
  return { toasts: readonly(toasts), show };
}
