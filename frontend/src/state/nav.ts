import { readonly, ref } from "vue";

export type RouteName = "discover" | "matches" | "messages" | "profile";
export interface Route {
  name: RouteName;
  /** The conversation open in Messages, when there is one. */
  id?: string;
}

const NAMES: readonly RouteName[] = ["discover", "matches", "messages", "profile"];

function parse(): Route {
  const [name, id] = window.location.hash.replace(/^#\/?/, "").split("/");
  return NAMES.includes(name as RouteName) ? { name: name as RouteName, id: id || undefined } : { name: "discover" };
}

const route = ref<Route>(parse());
window.addEventListener("hashchange", () => (route.value = parse()));

/** Moves to a page by changing the URL hash, so the back button and a reload keep the place. */
function go(name: RouteName, id?: string) {
  window.location.hash = id ? `/${name}/${id}` : `/${name}`;
}

/** Opens the page a notification's link points to (`/matches`, `/chats/<id>`, `/profile/<user>`). */
function goToLink(link: string) {
  const [, kind, id] = link.split("/");
  if (kind === "chats" && id) go("messages", id);
  else go("matches");
}

export function useNav() {
  return { route: readonly(route), go, goToLink };
}
