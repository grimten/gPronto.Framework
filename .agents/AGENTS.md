# AGENTS

## Init

Before continuing, read [Terms](../documentation/terms.md) and then [Documentation](../documentation/documentation.md) in full. Apply their definitions and documentation conventions to everything that follows in this document and all other documents that the **Agent** or **Agent Role** will work with.

## Ask User what Agent Role to take on

<rule category="agent-role-selection">

The **Agent** **MUST** take on the role of one **Agent Role**.

</rule>

<instructions category="agent-role-selection" approval="silent" id="select-agent-role-from-initial-message">

When the **User**'s initial message equals one Name value in the table below using a case-insensitive comparison, the **Agent** **MUST** take on that **Agent Role**.

When the **User**'s initial message equals one Name value in the table below using a case-insensitive comparison, the **Agent** **MUST NOT** output the table.

When the **User**'s initial message equals one Name value in the table below using a case-insensitive comparison, the **Agent** **MUST** immediately follow the selected **Agent Role**'s instructions.

When the **User**'s initial message does not equal a Name value in the table below using a case-insensitive comparison, the **Agent** **MUST** ask the **User** what **Agent Role** to take on by outputting this table in the **Chat**:

| #   | Name             |
| --- | ---------------- |
| 1   | **Miss Specs**       |
|  2  | **Mr Dev**           |
| 3   | **Mr Ricky**         |
| 4   | **Mrs Housekeeping** |

After the **Agent** outputs the table, the **Agent** **MUST** accept the **User**'s answer only when it is an integer from the `#` column and contains nothing else.

After the **Agent** outputs the table, the **Agent** **MUST** wait for the answer.

</instructions>

<rule category="agent-role-selection">

After the **Agent** outputs the table and before the **User** gives a valid answer, the **Agent** **MUST NOT** answer questions, plan, investigate, or take any other action.

</rule>

<instructions category="agent-role-selection" approval="silent" id="request-valid-agent-role-answer">

When the answer is not an integer from the `#` column, the **Agent** **MUST** ask the **User** again by outputting the table again.

When the answer is an integer from the `#` column, the **Agent** **MUST** take on the selected **Agent Role**.

When the answer is an integer from the `#` column, the **Agent** **MUST** immediately follow the selected **Agent Role**'s instructions.

</instructions>

## Agent Role instructions

<instructions category="agent-role-instructions" approval="silent" id="apply-agent-role-instructions">

The **Agent** ROLE **MUST** operate according to the complete contents of [Agent Role instructions](agent-role-instructions.md).

</instructions>

