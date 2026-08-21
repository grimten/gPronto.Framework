# Temporary issue

<!-- Replace the temporary title with a concise outcome-based title when the issue is understood. -->

## Status

Discussing

<!-- Allowed statuses: Discussing, Draft, Ready for Implementation. -->




## Decision
<user-action> add to the new agent role that this heading is mandatory here, and add that all decitions is to be recorded here   </user-action>
None.

<!--
Replace `None.` with one bullet per accepted decision. Use this format:

- YYYY-MM-DD HH:mm — [State the accepted decision and enough context to apply it without reconstructing the removed question thread.] Reference: `[repository-relative path]`, row `[number]`.

Use `rows [first]-[last]` for a range. Recalculate the reference after removing the resolved question thread, and never reference a tag that is removed with that thread.
-->



## Discussion

While the status is `Discussing`, all investigative notes, question threads, **User** answers, and provisional conclusions **MUST** be added only within this chapter. Except for changing the status, the implementation plan **MUST NOT** be developed or edited while the discussion is active.

When the discussion has resolved every open question, the status **MUST** change to `Draft`. The accepted outcomes **MUST** then be consolidated under `## Implementation Plan`, and subsequent specification work **MUST** occur within that chapter. The status **MUST** change to `Ready for Implementation` only when the implementation plan is complete and no open question remains.

If implementation-plan work reveals another question, the status **MUST** return to `Discussing`, and the question thread **MUST** be added in this chapter. After the question is resolved, the status **MUST** return to `Draft`, the accepted decision **MUST** be incorporated into the implementation plan, and the resolved question thread **MUST** be removed.<user-action>move rules to the agent role (only the new agent role)    </user-action>
<!--
Use one waiting `agent-comment` per question. Use this structure without the HTML escaping:

&lt;agent-comment status="waiting-for-user"&gt;
YYYY-MM-DD HH:mm **Mrs Senior Specs**

Reference: `[repository-relative path]`, row `[number]`.

[Explain the ambiguity, current evidence, reason an answer is required, practical effect of the available answers, and the recommended answer when evidence supports one. End with exactly one explicit question.]
&lt;/agent-comment&gt;
-->

## Implementation Plan

### Summary

[Describe the requested enhancement and its intended outcome in one concise paragraph.]

### Context

[Describe the current behavior, the problem being solved, and the evidence that establishes the problem.]

### Objective

[State the required end result without prescribing unnecessary implementation details.]

### Scope

#### In scope

- [State one included behavior, component, interface, or boundary per item.]

#### Out of scope

- [State one explicitly excluded behavior, component, interface, or boundary per item.]

### Prerequisites

- None.

<!-- Add only work the **User** must complete before **Mr Dev** may implement the issue. Documentation changes belong here as prerequisites and must not be assigned to **Mr Dev** as implementation work. -->

### Requirements

### Completion criteria

- [State one observable condition that must be true when implementation is complete.]

<!-- State outcomes only. Do not add work to create validation artifacts or steps asking **Mr Dev** to run tests. -->
