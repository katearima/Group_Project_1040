import { composition as Accounts } from "./compositions/Accounts.ts";
import { composition as Matching } from "./compositions/Matching.ts";
import { composition as Notifications } from "./compositions/Notifications.ts";
import { composition as Profiles } from "./compositions/Profiles.ts";
import { composition as Recommendations } from "./compositions/Recommendations.ts";

/** Composition modules keyed by the module names the approved design links. */
export const composition = { Accounts, Matching, Notifications, Profiles, Recommendations };
