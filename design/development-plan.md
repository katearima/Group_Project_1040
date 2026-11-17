# Development Plan

For this project, we plan to adopt an agile development framework consisting of 4 weeklong sprints.

Sprint 1: 11/9 - 11/16. Preproduction and design.\
Sprint 2: 11/17 - 11/23. Alpha prototype.\
Sprint 3: 11/24 - 11/30. Beta prototype.\
Sprint 4: 12/01 - 12/07. MVP and user testing.

## Sprint Management

Individual sprints will be managed via [the following backlog](https://docs.google.com/spreadsheets/d/1XkOPBRA-6CLnmeJ0T4gd80OykMGjANjbTzZeELhs754/edit?usp=sharing). Backlog entries consist of features, and the tasklist for each week further granularizes each feature's implementation timeline. Among other things, each entry is assigned a priority and the person in charge.

The final sheet in the above document is a visual summary of our production timeline, broken down by week.

## Implementation Risks

| Risk                              | Feature        | Description                                                                                                                                                                                   | Fallback Strategy                                                                                                                                                                                          |
| --------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Insufficient user preferences     | ProfileSetting | We may discover, either upon iteration or via user feedback, that the list of preferences we have defined underdetermines good matching.                                                      | Without risking feature creep, we can add in new preference settings, which should not be costly given our concept design. Alternatively, we can reweight existing preferences to achieve a closer result. |
| Low-performing matching algorithm | Recommending   | Our matching algorithm is not able to correctly pinpoint users who are good matches.                                                                                                          | In the worst case, we can implement a recommending algorithm that only takes into account geographical distance, which is deterministic.                                                                   |
| Location security                 | ProfileSetting | Tracking a user's location via geographical coordinates poses security and privacy risks. Most users do not want their location to be public or accessible by parties who are not themselves. | We can implement more granular location-sharing consent policies. We can also use approximate locations based on, e.g. university.                                                                         |
| Content moderation                | Chatting       | Whenever there's a chatbox, there are social conduct risks.                                                                                                                                   | We discussed adding a Reporting concept should this prove itself to be imperative.                                                                                                                         |
| "Profiling" (on our end)          | Recommending   | Inadvertent ethnicity, race, or gender based discrimination in our matching process                                                                                                           | We already take strict measures to prevent this, but we could look into even further anonymizing users.                                                                                                    |
| "Profiling" (on the user's end)   | ProfileSetting | Opportunities for ethnicity, race, or gender based discrimination inadvertently presented to our users                                                                                        | Identify the source of the problem and eliminate relevant fields in the profile settings.                                                                                                                  |
