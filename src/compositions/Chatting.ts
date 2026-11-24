import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { compute, each, former, is, now, reaction, when, where } from "@mit-sdg/sync-engine/language";
import { applicationConceptSet, concepts } from "../concepts.ts";

const { Chatting, MutualMatching, Notifying, Sessioning } = concepts;
const { conversationLink } = applicationConceptSet.computations;

const NEW_MESSAGE = "You have a new message!";

// ---------------------------------------------------------------------------------------
// Internal reactions (Reactions 7, 9, and the Chatting half of 10)
// ---------------------------------------------------------------------------------------

/** Reaction 7: a showInterest that creates a match opens the pair's conversation. */
const OpenOnMatch = reaction(({ from, to, matched }) =>
  when(MutualMatching.showInterest({ from, to }).responds({ matched }))
    .where(is.among(matched, [true]))
    .then(Chatting.createConversation({ firstUser: from, secondUser: to }).responds({})),
);

/** Reaction 10 (Chatting half): unmatching closes the pair's conversation while it is OPEN. */
const CloseOnUnmatch = reaction(({ user, other, conversation }) =>
  when(MutualMatching.unmatch({ user, other }).responds({}))
    .where(Chatting._conversationBetween({ user, other }).is({ conversation, status: "OPEN" }))
    .then(Chatting.closeConversation({ conversation }).responds({})),
);

/** Reaction 9: a sent message notifies the other participant, linking to the conversation. */
const NotifyOnMessage = reaction(({ conversation, sender, sentAt, recipient, link }) =>
  when(Chatting.sendMessage({ conversation, sender, sentAt }).responds({}))
    .where(
      Chatting._otherParticipant({ conversation, user: sender }).is({ other: recipient }),
      compute(conversationLink, { conversation }, link),
    )
    .then(
      Notifying.notify({ recipient, message: NEW_MESSAGE, link, createdAt: sentAt }).responds({}),
    ),
);

// ---------------------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------------------

const ConversationRows = former(
  "the conversations of (user)",
  ({ user }, { conversation, other, status }) =>
    each(Chatting._getConversations({ user }).is({ conversation, other, status })).form({
      conversation,
      other,
      status,
    }),
);

const MessageRows = former(
  "the messages of (conversation) as read by (user)",
  ({ user, conversation }, { message, sender, content, sentAt }) =>
    each(Chatting._getMessages({ user, conversation }).is({ message, sender, content, sentAt })).form(
      { message, sender, content, sentAt },
    ),
);

const Conversations = endpoint(
  "/chats/list",
  ({ session, user, time }) =>
    receive({ session })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(respond({ conversations: ConversationRows({ user }) })),
  { input: { defaults: { session: "" } } },
);

const Messages = endpoint(
  "/chats/messages",
  ({ session, conversation, user, time, other, status }) =>
    receive({ session, conversation })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        where(
          Chatting._isParticipant({ conversation, user }).is({ participant: true }),
          Chatting._otherParticipant({ conversation, user }).is({ other }),
          Chatting._conversationBetween({ user, other }).is({ conversation, status }),
        )
          .then(respond({ other, status, messages: MessageRows({ user, conversation }) }))
          .named("participant"),
        // Outsiders and unknown conversations get the same answer, concealing existence.
        where(Chatting._isParticipant({ conversation, user }).is({ participant: false }))
          .then(respond({ error: "CONVERSATION_NOT_FOUND" }))
          .named("not-a-participant"),
      ),
  { input: { required: ["conversation"], defaults: { session: "" } } },
);

const Send = endpoint(
  "/chats/send",
  ({ session, conversation, content, user, time, message }) =>
    receive({ session, conversation, content })
      .then(where(now(time)).then(Sessioning.current({ session, now: time }).responds({ subject: user })))
      .then(
        Chatting.sendMessage({ conversation, sender: user, content, sentAt: time }).responds({
          message,
        }),
      )
      .then(respond({ message })),
  { input: { required: ["conversation", "content"], defaults: { session: "" } } },
);

export const composition = {
  Reacting: { OpenOnMatch, CloseOnUnmatch, NotifyOnMessage },
  Reads: { Conversations, Messages },
  Requests: { Send },
};
