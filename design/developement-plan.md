# Development Plan


Our goal is to have a working version of the app by the alpha checkpoint, then use the time before beta to finish the remaining features and fix problems. We want to connect the different parts early so we have time to see what works together and what still needs to change.

The deadlines below follow the [class schedule](https://61040.github.io/fa26/assignments/f3/).

## What We Plan to Deliver

| Stage | Deadline | What we expect to deliver | Main responsibilities |
| :--- | :--- | :--- | :--- |
| **F3: Concept design** | **Mon, Nov 16** | Updated concept specifications and reactions, problem framing and ethical analysis, user journey, visual design study, design summary, and this development plan. | Silk owns ProfileSetting, MutualMatching, and the user journey. Keti owns Recommending and the design summary. Raleigh owns Notifying and Chatting. Fidan owns this development plan. Problem framing, visual design, and reactions are reviewed together. |
| **C3: Concept design critique** | **Thu, Nov 19** | Complete the assigned critique. Review feedback on our own design as it becomes available and turn changes into specific development tasks. Agree on the inputs and outputs of our concept actions before connecting them. | Everyone contributes to the critique and reviews changes that affect their part. |
| **F4: Alpha checkpoint** | **Mon, Nov 23** | A first running version that we can open and demonstrate. Two users can sign in, create and publish founder/builder profiles, save preferences, see ranked recommendations, show interest or pass, become a match, and exchange basic messages. Profiles, decisions, and messages stay saved after refreshing. | Fidan finishes profiles and matching. Keti finishes preferences and recommendations. Raleigh connects basic chatting. Silk coordinates the screens and tracks what is ready. Sign-in, deployment, and reactions are shared integration work. |
| **F5: Beta checkpoint** | **Mon, Nov 30** | A near-complete app with all five concepts connected. Add in-app notifications, See Later, profile hiding and republishing, preference updates, unmatching, and access to previous messages after a chat closes. Finish loading, empty, and error states and fix the main usability problems from alpha. | Fidan finishes profile visibility and unmatching. Keti finishes recommendation updates and See Later. Raleigh completes notifications and closed-chat history. Silk checks the interface and updates the plan. Everyone checks the full flow. |
| **F6: User testing** | **Mon, Dec 7** | Complete testing with students who could use the app as founders or builders. Aim for 4–6 participants across at least two universities. Record where people get stuck, whether recommendations make sense to them, and what we changed after testing. Fix the most important issues. | Everyone helps run sessions. Fidan checks profiles and matching, Keti checks recommendations, Raleigh checks notifications and chatting, and Silk collects interface issues and tracks follow-up tasks. |
| **F7: Full demo and project report** | **Wed, Dec 9** | A stable final app, a rehearsed demo of the main user journey, and the project report. Include the final design, testing results, changes we made, and any remaining limitations. | Everyone writes about their own work and helps rehearse. Fidan updates the user journey, Keti updates the design summary, Raleigh checks notifications and chatting, and Silk tracks final deliverables and coordinates the demo preparation. |

For alpha, we want one complete flow to work, even if the screens still need polishing. By beta, users should be able to move through the app without us explaining every step. We will start finding testing participants before beta so we have enough time to test and make changes before December 7.

## How We Will Divide the Work

This follows our original division of the concepts and written deliverables. Each concept owner is responsible for its state, actions, and tests. We will review each other's work and help when one part is blocking another.

**Fidan — ProfileSetting, MutualMatching, and the user journey**

- Build ProfileSetting, including creating, editing, publishing, and hiding profiles, and checking the required information.
- Build MutualMatching, including Show Interest, Pass, incoming interest, and unmatching. Work with Keti and Raleigh on the reactions that update the feed, create chats, and send notifications.
- Own the user journey and keep it consistent with the app, from the problem that brings Keti to the platform through finding a match and starting a conversation.

**Keti — Recommending and the design summary**

- Build Recommending, including preferences, the five-factor score, See Later, and updates when profiles or preferences change.
- Work with Fidan to include preference settings in setup and keep recommendations consistent with matching decisions. Check that each user gets their own feed and that passed profiles stay passed.
- Own the design summary, including how the concepts address the bad situations, how we respond to ethical concerns, and what is still unclear.

**Raleigh — Notifying and Chatting**

- Build Notifying, including unread, read, and dismissed notifications for interest, matches, and messages.
- Build Chatting, including saved messages, conversation history, and closed conversations after unmatching.
- Work with Fidan on the match-to-chat flow and check that only participants can read messages, only active matches can send them, and dismissing a notification does not change the event behind it.

**Silk — Development plan and interface coordination**

- Own this development plan and keep the stages, responsibilities, risks, and fallback options up to date.
- Coordinate the discovery, profile, Interested in You, Matches, and chat screens with the concept owners. This is supporting interface work; the concept ownership stays as listed above.
- Help bring the typography, colors, and layout together, and track usability fixes and demo preparation as we approach each checkpoint.

**Shared work**

- Review the problem framing and visual design study together. We have not assigned those written deliverables to one person in the original division.
- Set up sign-in, deployment, and the application request boundary together. Silk will track these tasks in the backlog so they have a specific owner before implementation starts.
- Review reactions together, with the owners of the concepts they connect. Everyone helps find testing participants, run sessions, and prepare the final report.

**How we will work together**

- Keep tasks in our shared backlog with an owner and a target date. Break larger features into smaller tasks that we can finish and review separately.
- Continue meeting twice a week and use our group messages for quick updates. If something is taking longer than expected, tell the group early so we can help or reduce the scope.
- Use a separate branch for each feature and have another teammate review it before merging, following our team contract.
- Connect features as they become ready. Before each checkpoint, walk through the app together with separate founder and builder accounts.
- Share integration and debugging work when needed. If someone has less time in a particular week, move a specific task to another person instead of waiting until the deadline.

## Key Risks and Fallback Options

- **The recommendation score may not give useful results.** We will try it with different test profiles and ask users whether the order makes sense. We will check empty preferences and make sure school reputation does not add points. If the ranking still feels unreliable, our fallback is a simpler feed with explicit filters for skills, interests, and availability. We would update the concept design and explain that change in the report instead of claiming the original ranking works.

- **Location lookup may take more time than we expect.** We will check it early and use a campus or neighborhood rather than requiring a home address. If converting typed locations into coordinates is unreliable, our fallback is a short list of campuses and neighborhoods with known coordinates. This still lets us calculate proximity, but we will explain that it is approximate.

- **Live chat updates may be difficult to finish.** Raleigh will start with messages that are saved and can be loaded again before adding live updates. If a live connection is unreliable, the fallback is to refresh messages at a short interval or let users refresh manually. Messages must still stay saved, and only matched participants can send them.

- **The concepts may work separately but fail when connected.** We will agree on action inputs and outputs early and test the full flow before alpha. Fidan will work with the owner of each concept when connecting its reactions. If an optional feature is blocking a checkpoint, we will leave it out of that checkpoint and document it. We will keep the basic profile-to-match-to-chat flow as our priority.

- **We may run out of time before beta.** We will keep the first version focused on the five concepts and avoid adding new features while the main flow is unfinished. If we fall behind, we will drop animations and extra visual polish first, and keep notifications inside the app rather than adding email or push delivery. We will record anything that moves beyond beta in the backlog and report.

- **We may not find enough people for testing.** We will start reaching out before beta, and everyone will help find students who are looking for teammates or interested in joining a startup. If we cannot recruit from multiple universities, we will test with available students in both roles and clearly state that we have not yet validated the cross-university experience. Test profiles can help us check functionality, but they will not count as real user feedback.

- **Privacy or access checks may fail.** We will use separate accounts to try opening someone else's notifications, changing their profile, and messaging before a match or after unmatching. If a feature exposes private information or allows an action it should block, we will disable that feature until the check is fixed. We will use test data during debugging and keep the demo on a version we have checked.

- **Deployment may break close to a checkpoint.** We will deploy a basic version before alpha and check changes throughout development. Silk will track the deployment task, and the concept owners will help fix problems involving their parts. If a new change breaks the hosted app, we will return to the last working deployment while fixing it. We will also keep a locally runnable copy for demonstrating progress if hosting is unavailable, and make the limitation clear.
