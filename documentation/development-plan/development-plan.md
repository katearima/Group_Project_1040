# Development Plan

For this project, we plan to adopt an agile development framework consisting of 4 weeklong sprints.

Sprint 1: 11/9 - 11/16. Preproduction and design.\
Sprint 2: 11/17 - 11/23. Alpha prototype.\
Sprint 3: 11/24 - 11/30. Beta prototype.\
Sprint 4: 12/01 - 12/07. MVP and user testing.

| Stage                          | Deadline        | What we expect to deliver                                                                                                                                                                                                                                                                                      |
| :----------------------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sprint 1: Concept design**   | **Mon, Nov 16** | Updated concept specifications and reactions, problem framing and ethical analysis, user journey, visual design study, design summary, and this development plan.                                                                                                                                              |
| **Sprint 2: Alpha checkpoint** | **Mon, Nov 23** | A first running version that we can open and demonstrate. Two users can sign in, create and publish founder/builder profiles, save preferences, see ranked recommendations, show interest or pass, become a match, and exchange basic messages. Profiles, decisions, and messages stay saved after refreshing. |
| **Sprint 3: Beta checkpoint**  | **Mon, Nov 30** | A near-complete app with all five concepts connected. Add in-app notifications, See Later, profile hiding and republishing, preference updates, unmatching, and access to previous messages after a chat closes. Finish loading, empty, and error states and fix the main usability problems from alpha.       |
| **Sprint 4: User testing**     | **Mon, Dec 7**  | Complete testing with students who could use the app as founders or builders. Aim for 4–6 participants across at least two universities. Record where people get stuck, whether recommendations make sense to them, and what we changed after testing. Fix the most important issues.                          |

## Sprint Management

Individual sprints will be managed via [the following backlog](https://docs.google.com/spreadsheets/d/1XkOPBRA-6CLnmeJ0T4gd80OykMGjANjbTzZeELhs754/edit?usp=sharing). Backlog entries consist of features, and the tasklist for each week further granularizes each feature's implementation timeline. Among other things, each entry is assigned a priority and the person in charge.

### Division of Labor

As of sprint 1, rough divisions of labor are as follows, subject to change:

**Fidan — ProfileSetting, MutualMatching**

- Build ProfileSetting, including creating, editing, publishing, and hiding profiles, and checking the required information.
- Build MutualMatching, including Show Interest, Pass, incoming interest, and unmatching. Work with Keti and Raleigh on the reactions that update the feed, create chats, and send notifications.

**Keti — Recommending**

- Build Recommending, including preferences, the five-factor score, See Later, and updates when profiles or preferences change.
- Work with Fidan to include preference settings in setup and keep recommendations consistent with matching decisions. Check that each user gets their own feed and that passed profiles stay passed.

**Raleigh — Notifying, Chatting**

- Build Notifying, including unread, read, and dismissed notifications for interest, matches, and messages.
- Build Chatting, including saved messages, conversation history, and closed conversations after unmatching.
- Work with Fidan on the match-to-chat flow and check that only participants can read messages, only active matches can send them, and dismissing a notification does not change the event behind it.

**Silk — Scrum Manager, UI & Endpoints, Review**

- Own the product backlog and keep the stages, responsibilities, risks, and fallback options up to date.
- Coordinate the discovery, profile, Interested in You, Matches, and chat screens with the concept owners and coordinate endpoints as necessary.
- Help bring the typography, colors, and layout together, and track usability fixes and demo preparation as we approach each checkpoint.

**Shared work**

- Review the problem framing and visual design study together.
- Set up sign-in, deployment, and the application request boundary together.
- Review reactions together, with the owners of the concepts they connect. Everyone helps find testing participants, run sessions, and prepare the final report.

## Implementation Risks

| Risk                              | Feature        | Description                                                                                                                                                                                   | Fallback Strategy                                                                                                                                                                                          |
| --------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Insufficient user preferences     | ProfileSetting | We may discover, either upon iteration or via user feedback, that the list of preferences we have defined underdetermines good matching.                                                      | Without risking feature creep, we can add in new preference settings, which should not be costly given our concept design. Alternatively, we can reweight existing preferences to achieve a closer result. |
| Low-performing matching algorithm | Recommending   | Our matching algorithm is not able to correctly pinpoint users who are good matches.                                                                                                          | In the worst case, we can implement a recommending algorithm that only takes into account geographical distance, which is deterministic.                                                                   |
| Location security                 | ProfileSetting | Tracking a user's location via geographical coordinates poses security and privacy risks. Most users do not want their location to be public or accessible by parties who are not themselves. | We can implement more granular location-sharing consent policies. We can also use approximate locations based on, e.g. university.                                                                         |
| Content moderation                | Chatting       | Whenever there's a chatbox, there are social conduct risks.                                                                                                                                   | We discussed adding a Reporting concept should this prove itself to be imperative.                                                                                                                         |
| "Profiling" (on our end)          | Recommending   | Inadvertent ethnicity, race, or gender based discrimination in our matching process                                                                                                           | We already take strict measures to prevent this, but we could look into even further anonymizing users.                                                                                                    |
| "Profiling" (on the user's end)   | ProfileSetting | Opportunities for ethnicity, race, or gender based discrimination inadvertently presented to our users                                                                                        | Identify the source of the problem and eliminate relevant fields in the profile settings.                                                                                                                  |
