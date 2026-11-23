# Chatting

## Purpose

Let two people who have connected talk privately, so they can discuss their ideas and
expectations and decide whether they want to work together. Messages are kept, so either
person can return to the conversation later, even after it is closed.

## Principle

Keti and Bumba connect, and a conversation is created between them. It is OPEN. Keti sends
"What does your app do?" at 10:00 and Bumba replies at 10:02. Both see the two messages,
oldest first, and both see the conversation in their conversation lists. Ana is not a
participant: her attempt to send a message is refused as if the conversation didn't exist,
and reading its messages gives her nothing. A message that is empty or only whitespace is
refused.

Later the conversation is closed. Neither Keti nor Bumba can send new messages; the attempt
is refused. Both can still read their earlier messages, and the conversation stays in their
lists as CLOSED. Creating a second conversation between them is refused, because a pair has
at most one conversation.

## Types

```types
external User
  The opaque identity of a person who takes part in conversations.
ConversationStatus is OPEN or CLOSED
  Whether participants can still send new messages in a conversation.
```

## State

```state
a seq of Conversations with
  a firstUser User
  a secondUser User
  a status ConversationStatus

a seq of Messages with
  a conversation Conversation
  a sender User
  a content String
  a sentAt DateTime

Rule: Every Conversation has two different Users; firstUser and secondUser carry no meaning beyond membership.
Rule: A pair of Users has at most one Conversation, whichever User is first, whether it is OPEN or CLOSED.
Rule: A new Conversation is OPEN; a CLOSED Conversation never becomes OPEN again.
Rule: Every Message belongs to exactly one Conversation, and its sender is a participant of that Conversation.
Rule: Every Message has content that is not empty or only whitespace; a Message never changes and is never removed, including after its Conversation is closed.
Rule: sentAt is supplied by the caller of sendMessage; Chatting never reads a clock.
Rule: Conversations are kept in creation order and Messages in the order they were sent, which breaks ties between equal sentAt values.
Rule: Each action checks and changes these facts atomically, so concurrent requests for the same pair cannot create two Conversations.
```

## Actions

```actions
createConversation (firstUser: User, secondUser: User) : returns (conversation: Conversation)
  where firstUser is secondUser
  then
    refuses CONVERSATION_WITH_SELF "You cannot start a conversation with yourself."
  where firstUser is not secondUser and a Conversation already pairs firstUser and secondUser
  then
    refuses CONVERSATION_EXISTS "You already have a conversation with this person."
  where firstUser is not secondUser and no Conversation pairs firstUser and secondUser
  then
    append a new Conversation with firstUser, secondUser, and status OPEN
    bind conversation to that Conversation
    returns conversation

sendMessage (conversation: Conversation, sender: User, content: String, sentAt: DateTime) : returns (message: Message)
  where conversation is not in Conversations or sender is neither its firstUser nor its secondUser
  then
    refuses CONVERSATION_NOT_FOUND "No such conversation."
  where sender is a participant of conversation and its status is CLOSED
  then
    refuses CONVERSATION_CLOSED "This conversation is closed; you can no longer send messages."
  where sender is a participant of conversation, its status is OPEN, and content is empty or only whitespace
  then
    refuses EMPTY_MESSAGE "A message must not be empty."
  where sender is a participant of conversation, its status is OPEN, and content is not empty or only whitespace
  then
    append a new Message with conversation, sender, content, and sentAt
    bind message to that Message
    returns message

closeConversation (conversation: Conversation) : returns ()
  where conversation is not in Conversations
  then
    refuses CLOSE_TARGET_NOT_FOUND "No such conversation."
  where conversation's status is CLOSED
  then
    refuses CONVERSATION_ALREADY_CLOSED "This conversation is already closed."
  where conversation's status is OPEN
  then
    set conversation's status to CLOSED
    returns
```

## Queries

```queries
_getConversations (user: User) : many (conversation: Conversation, other: User, status: ConversationStatus)
  answers each Conversation in which user is a participant, OPEN or CLOSED, with the other participant and the status
  answers no rows when there are none, including for an unknown user
  orders rows by Conversation creation order, newest first

_getMessages (user: User, conversation: Conversation) : many (message: Message, sender: User, content: String, sentAt: DateTime)
  answers each Message in conversation with its sender, content, and sentAt, when user is a participant of conversation, whether it is OPEN or CLOSED
  answers no rows when the conversation does not exist, has no Messages, or user is not a participant, including for an unknown user
  orders rows by sentAt oldest first, and equal sentAt values by send order oldest first

_conversationBetween (user: User, other: User) : optional (conversation: Conversation, status: ConversationStatus)
  answers the Conversation pairing user and other, whichever is first, with its status
  answers no row when there is none, including for unknown users or when user is other

_otherParticipant (conversation: Conversation, user: User) : optional (other: User)
  answers the participant of conversation who is not user, when user is a participant
  answers no row when the conversation does not exist or user is not a participant, including for an unknown user
```
