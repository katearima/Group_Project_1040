/**
 * The sentence to show when an endpoint refuses, by endpoint path and HTTP error category. The backend maps
 * every refusal to one of INVALID_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND or CONFLICT (see `appHttpPolicy`
 * in src/assembly.ts), so each sentence names the most likely cause for that category on that endpoint.
 */
const messages: Record<string, Record<string, string>> = {
  "/accounts/register": {
    INVALID_REQUEST:
      "Use a username of 3 to 32 letters, numbers, underscores or hyphens, and a password of 8 to 128 characters.",
    CONFLICT: "That username is already taken. Try another one.",
  },
  "/accounts/sign-in": {
    UNAUTHORIZED: "The username or password is incorrect.",
    INVALID_REQUEST: "Enter your username and password.",
  },
  "/profiles/create": {
    INVALID_REQUEST:
      "Check your details: graduation year, coordinates and hours must be valid, and skills and interests can't be blank.",
    CONFLICT: "You already have a profile. Edit it instead.",
  },
  "/profiles/update": {
    INVALID_REQUEST:
      "Check your details: graduation year, coordinates and hours must be valid, and skills and interests can't be blank.",
    CONFLICT: "A published profile has to stay complete. Keep a name, location, a skill and an interest.",
    NOT_FOUND: "Create your profile first.",
  },
  "/profiles/set-pitch": {
    INVALID_REQUEST: "Write a pitch before saving.",
    FORBIDDEN: "Only founders can have a startup pitch.",
    NOT_FOUND: "Create your profile first.",
  },
  "/profiles/publish": {
    CONFLICT:
      "Finish your profile first: add a name, location, at least one skill and interest, and a pitch if you are a founder.",
    NOT_FOUND: "Create your profile first.",
    INVALID_REQUEST: "Some profile details are invalid. Check them and try again.",
  },
  "/recommendations/set-preferences": {
    INVALID_REQUEST: "Distance and hours must be zero or more, and preferences can't be blank.",
    NOT_FOUND: "Create your profile before setting preferences.",
  },
  "/matching/show-interest": {
    CONFLICT: "You already responded to this person.",
    INVALID_REQUEST: "You can't show interest in yourself.",
    NOT_FOUND: "That person is no longer available.",
  },
  "/matching/pass": {
    CONFLICT: "You already responded to this person.",
    INVALID_REQUEST: "You can't pass on yourself.",
    NOT_FOUND: "That person is no longer available.",
  },
  "/matching/unmatch": {
    NOT_FOUND: "You aren't matched with this person any more.",
    CONFLICT: "This match has already ended.",
  },
  "/chats/send": {
    INVALID_REQUEST: "Write a message before sending.",
    CONFLICT: "This conversation is closed, so you can't send messages any more.",
    NOT_FOUND: "This conversation no longer exists.",
  },
  "/chats/messages": { NOT_FOUND: "This conversation no longer exists." },
  "/notifications/mark-read": { NOT_FOUND: "That notification is already gone." },
  "/notifications/dismiss": { NOT_FOUND: "That notification is already gone." },
};

const generic: Record<string, string> = {
  UNAUTHORIZED: "Your session has ended. Sign in again.",
  NETWORK_ERROR: "Can't reach the server. Check your connection and try again.",
  BAD_STATUS: "The server had a problem. Try again in a moment.",
  INTERNAL_ERROR: "The server had a problem. Try again in a moment.",
};

/** The sentence to show when the endpoint at `path` returns `error`. */
export function messageFor(path: string, error: string): string {
  return messages[path]?.[error] ?? generic[error] ?? "Something went wrong. Try again.";
}
