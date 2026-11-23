import { composition as Accounts } from "./compositions/Accounts.ts";
import { composition as Matching } from "./compositions/Matching.ts";
import { composition as Notifications } from "./compositions/Notifications.ts";

/** Composition modules keyed by the module names the approved design links. */
export const composition = { Accounts, Matching, Notifications };
