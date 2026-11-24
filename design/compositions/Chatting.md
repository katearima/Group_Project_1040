# Chatting

Matched users can chat privately. Conversations are opened and closed only by matching
activity, never by a direct request. Every endpoint first calls Sessioning `current` with
the supplied session and the flow's [current instant](computation:currentInstant).
Missing, ended, expired, and invented sessions all return `UNKNOWN_SESSION` before any
chat action or read, without changes. The session determines who sends or reads; a
request names only the conversation.

Chatting stores conversations and messages in MongoDB, so they survive a restart, while
the other concepts are still in memory.

## Opening a conversation on a match

When MutualMatching `showInterest` succeeds and creates a match (Reaction 7), an internal
reaction [opens a conversation](reaction:Chatting.Reacting.OpenOnMatch) by calling Chatting
`createConversation` with `from` as the first user and `to` as the second. Interest
without a match, and any refused `showInterest`, opens nothing.

A match is created only once per pair, and unmatching prevents a new match, so the pair
has no conversation yet and `createConversation` is not expected to refuse. Show Interest
answers only after its flow settles, so the conversation exists by the time the endpoint
reports the match.

## Closing a conversation on unmatch

When MutualMatching `unmatch` succeeds (Reaction 10, Chatting half), an internal reaction
[closes their conversation](reaction:Chatting.Reacting.CloseOnUnmatch). It reads Chatting
`_conversationBetween` for the two users and, only when an OPEN conversation exists, calls
`closeConversation`. Neither person can send new messages afterward; both keep reading the
earlier ones. Unmatch answers only after its flow settles, so the conversation is already
closed when the endpoint reports success.

The Recommending half of Reaction 10 (marking recommendations passed after unmatching)
stays deferred with the other Recommending integrations in Matching.

## Notifying about a new message

When Chatting `sendMessage` succeeds (Reaction 9), an internal reaction
[notifies the other participant](reaction:Chatting.Reacting.NotifyOnMessage). It reads
Chatting `_otherParticipant` for the conversation and the sender, then Notifying `notify`
sends that person "You have a new message!" with
[the conversation's link](computation:conversationLink) and the message's `sentAt` as
`createdAt`. The notification never includes the message text. A refused send notifies
nobody.

The notification is best-effort, like the match notifications: the message stays sent
if `notify` faults, and the conversation remains the source of truth.

```computations
conversationLink(conversation: Chatting.Conversation) : String
  Produces the navigation link /chats/<conversation> for the given conversation.
```

## List conversations

A signed-in user may [list their conversations](reaction:Chatting.Reads.Conversations).
Chatting `_getConversations` returns each conversation the session user takes part in,
OPEN or CLOSED, with the other participant and the status, newest first. It returns an
empty list when there are none. Users cannot list someone else's conversations; reading
changes no state.

```endpoints
Chatting.Reads.Conversations at /chats/list
```

## Read messages

A signed-in user may [read a conversation's messages](reaction:Chatting.Reads.Messages).
The reaction reads Chatting `_otherParticipant` for the requested conversation and the
session user. When the user is not a participant, or the conversation does not exist, it
returns `CONVERSATION_NOT_FOUND`, so a conversation's existence is not revealed to
outsiders. Otherwise it returns the other participant, the conversation's status, and
Chatting `_getMessages`: each message with its sender, content, and sent time, oldest
first. Closed conversations stay readable. Reading changes no state.

```endpoints
Chatting.Reads.Messages at /chats/messages
```

## Send a message

A signed-in user may [send a message](reaction:Chatting.Requests.Send) in a conversation.
Chatting `sendMessage` takes the session user as `sender` and the flow's instant as
`sentAt`. It returns `CONVERSATION_NOT_FOUND` for a missing conversation or one the user
does not take part in, `CONVERSATION_CLOSED` after an unmatch, and `EMPTY_MESSAGE` for
empty or whitespace-only text. Refusals store nothing and notify nobody. On success the
endpoint returns the new message's identity.

The prose design also guards sending with an active match. The composition relies on
Chatting's status instead of reading MutualMatching again: conversations are opened only
by a match (Reaction 7) and closed by its unmatch (Reaction 10), and a match can never be
recreated, so a conversation is OPEN exactly while its match exists.

```endpoints
Chatting.Requests.Send at /chats/send
```
