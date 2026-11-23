import { httpWire } from "@mit-sdg/sync-engine-http/tooling";
import { appHttpPolicy, assembleApplication } from "./src/assembly.ts";

export default {
  assemble: assembleApplication,
  title: "Application",
  wireName: "AppWire",
  design: {
    version: 1,
    documents: [
      new URL("./design/types.md", import.meta.url),
      new URL("./design/compositions/Accounts.md", import.meta.url),
      new URL("./design/compositions/Matching.md", import.meta.url),
      new URL("./design/compositions/Notifications.md", import.meta.url),
      new URL("./design/compositions/Profiles.md", import.meta.url),
      new URL("./design/compositions/Recommendations.md", import.meta.url),
    ],
  },
  projections: [httpWire({ policy: appHttpPolicy, name: "AppWireHttp" })],
};
