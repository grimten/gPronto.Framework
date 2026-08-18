# Documentation

## Status

Draft

## Scope

gPronto.Framework:Mandatory document chapters and the content assigned to each chapter.
gPronto.Framework:Placement of current requirements in document **Rules**.
gPronto.Framework:Bold formatting of defined terms.
gPronto.Framework:Repository-rooted file, folder, environment-file, and environment-variable reference formats.
gPronto.Framework:Markdown heading, tag-block, blank-line, and document-ending formatting.
gPronto.Framework:Documentation tag syntax, attributes, pairing, and behavior.
gPronto.Framework:Typed tag-reference integrity and documentation file-set variables.
gPronto.Framework:Excludes the subject matter and requirements owned by other documents.

## Verification

Date: 2026-08-18

## Rules

<rule category="document-chapters" id="document-chapter-requirements">

Every Markdown document directly in the folder `gPronto.Framework:documentation` **MUST** contain the chapters `Status`, `Scope`, `Verification`, `Rules`, and `Instructions`.

Each of those five chapters is a mandatory chapter.

The `Scope` chapter **MUST** contain one or more scope statements and **MUST NOT** contain other content.

Every scope statement **MUST** occupy exactly one physical line and **MUST** use this format:

```text
[SCOPE OWNER]:[STATEMENT]
```

`[SCOPE OWNER]` **MUST** be exactly one of:

```text
gPronto.Framework
gPronto.Application
gPronto.Application.Prototype
gPronto.Application.Backstage
gPronto.Services
gPronto.Tools
```

The colon **MUST** immediately follow `[SCOPE OWNER]`, and `[STATEMENT]` **MUST** immediately follow the colon.

`[STATEMENT]` **MUST** contain at least one non-whitespace character and **MUST** describe exactly one included subject or exactly one excluded adjacent subject.

The complete content of the document's `Status` chapter **MUST** be exactly `Active`, `Draft`, or `Updating`.

When the document's `Status` chapter is `Draft` or `Updating`, the exact value `TBD` **MAY** be used as the complete content of any mandatory chapter other than `Status`. When used this way, `TBD` satisfies that chapter's content requirement until it is replaced.

When the document's `Status` chapter is `Active`, `TBD` **MUST NOT** be used as the complete content of a mandatory chapter.

`Updating` is a temporary status.

</rule>

<rule category="document-rules" id="document-rule-coverage">

Every current requirement or contract statement in a Markdown document directly in `gPronto.Framework:documentation` **MUST** be represented by exactly one `<rule>` element in that document's `Rules` chapter. Explanatory, historical, example, roadmap, and purpose text **MUST NOT** be treated as a current requirement unless a **Rule** explicitly makes it one.

An existing `<rule>` element **MUST NOT** be removed during validation. When its statement is no longer accurate, its content **MUST** be corrected in place or marked with validation-error tags until the required decision is made.

</rule>

<rule category="documentation-format" id="defined-terms-not-bold-in-restricted-contexts">

Every singular or plural occurrence of a term listed under the chapter `Terms` in `gPronto.Framework:documentation/terms.md` that is inside a heading, link text, inline code, fenced code block, or `[SCOPE OWNER]` prefix defined by `documentation.md: rule:[document-chapter-requirements]` **MUST NOT** be written in bold.

Every other singular or plural occurrence of a term listed under that chapter **MUST** be written in bold.

</rule>

<rule category="documentation-format" id="bold-text-defined-terms-only">

Every bold span outside a fenced code block **MUST** contain exactly one complete singular or plural term listed under the chapter `Terms` in `gPronto.Framework:documentation/terms.md`.

A bold span **MUST NOT** contain text before or after that term.

</rule>

<rule category="file-paths" id="file-reference-backticks">

Every file or folder reference shown in a Markdown document **MUST** be enclosed in backticks.

</rule>

<rule category="file-paths" id="file-reference-root-format">

Every file or folder reference shown in a Markdown document **MUST** start at its repository root and use exactly one of the formats defined in the chapter `File and folder references`.

</rule>

<rule category="environment-variable-references" id="environment-variable-reference-format">

When a Markdown document identifies an environment file as the source of a specific environment variable, the reference **MUST** use exactly this format:

```text
`[ENVIRONMENT FILE REFERENCE] variable:[VARIABLE NAME]`
```

`[ENVIRONMENT FILE REFERENCE]` **MUST** be a repository-rooted file reference defined by the chapter `File and folder references`.

`[VARIABLE NAME]` **MUST** match `^[A-Z][A-Z0-9_]*$`.

The complete reference **MUST** be enclosed in one pair of backticks, **MUST NOT** contain the variable value, and **MUST NOT** be a Markdown link to the environment file.

</rule>

<rule category="file-paths" id="prototype-reference-name">

The `[PROTOTYPE NAME]` in a `gPronto.Application.[PROTOTYPE NAME]:[PATH FROM ROOT]` reference **MUST** exactly match an Application Name whose Type is `gPronto.Application.Prototype` in [Application inventory](application-inventory.md).

</rule>

<rule category="markdown-format" id="command-example-fences">

Every command example in a Markdown document **MUST** be placed in a fenced code block and **MUST NOT** be written as inline code.

Every fenced code block in a Markdown document **MUST** include a language identifier on its opening fence.

</rule>

<rule category="markdown-format" id="markdown-heading-blank-lines">

A Markdown ATX heading is a physical line outside a fenced code block that matches `^#{1,6} `.

Every Markdown ATX heading **MUST** have exactly one blank physical line immediately before it and exactly one blank physical line immediately after it.

A Markdown ATX heading on the first physical line of a document **MUST NOT** have a blank physical line before it.

</rule>

<rule category="markdown-format" id="documentation-tag-blank-lines">

A complete element whose tag name is defined by `documentation.md: variable:[documentation-tag-types]` is a tag element.

A `<user-comment>...</user-comment>` element immediately followed by its `<agent-comment>...</agent-comment>` element **MUST** be treated as one tag block.

An `<agent-error>...</agent-error>` element immediately followed by its `<agent-error-explanation>...</agent-error-explanation>` element **MUST** be treated as one tag block.

Every other tag element **MUST** be treated as one tag block.

Every tag block **MUST** have exactly one blank physical line immediately before its first physical line and exactly one blank physical line immediately after its last physical line.

A tag block that begins on the first physical line of a document **MUST NOT** have a blank physical line before it.

</rule>

<rule category="markdown-format" id="markdown-document-ending">

Every Markdown document **MUST** contain exactly one blank physical line after its final non-blank physical line.

</rule>

<rule category="markdown-format" id="markdown-consecutive-blank-lines">

A Markdown document **MUST NOT** contain more than one consecutive blank physical line.

</rule>

<rule category="tags" id="documentation-tag-requirements">

For each opening tag outside a fenced code block whose tag name is defined by `documentation.md: variable:[documentation-tag-types]`, the same document **MUST** contain exactly one matching closing tag after that opening tag.

Every closing tag outside a fenced code block whose tag name is defined by `documentation.md: variable:[documentation-tag-types]` **MUST** match exactly one preceding opening tag of the same name.

Every `<rule>` tag **MUST** have exactly one required `category` attribute, **MAY** have exactly one optional `id` attribute, and **MUST NOT** have another attribute.

The `category` attribute **MUST** contain at least one non-whitespace character. When no category is needed, the `category` attribute **MUST** have the value `none`.

When the `id` attribute is present, it **MUST** contain at least one non-whitespace character and **MUST** be unique among the `<rule>` tags in its document.

The content between the opening and closing `<rule>` tags **MUST** contain at least one non-whitespace character.

Every `<variable>` tag **MUST** have exactly one `id` attribute and **MUST NOT** have another attribute.

The `id` attribute **MUST** contain at least one non-whitespace character and **MUST** be unique among the `<variable>` tags in its document.

Every `<user-comment>`, `<user-action>`, `<agent-error>`, and `<agent-error-explanation>` tag **MUST NOT** have an attribute.

Every `<agent-comment>` tag **MAY** have exactly one optional `status` attribute and **MUST NOT** have another attribute.

When an `<agent-comment>` tag has a `status` attribute, its value **MUST** be exactly `waiting-for-user`.

Each `<agent-comment>` without a `status` attribute **MUST** begin on the next physical line after its `<user-comment>`, without an intervening blank line.

An `<agent-comment status="waiting-for-user">` **MAY** appear as a standalone tag block and **MAY** immediately follow a `<user-comment>`.

Each `<agent-error>` **MUST** be followed by exactly one `<agent-error-explanation>` on the next physical line without an intervening blank line.

Every `<instructions>` tag **MUST** have exactly the attributes `category`, `approval`, and `id`, and **MUST NOT** have another attribute.

The `category` attribute **MUST** contain at least one non-whitespace character. When no category is needed, the `category` attribute **MUST** have the value `none`.

The `approval` attribute **MUST** be exactly one of:

| Approval  | Meaning                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `silent`  | The **Agent** has approval to carry out the instructions without asking for permission. What the **Agent** is approved to do **MUST** be explicitly mentioned in the instructions text. |
| `request` | The **Agent** **MUST** ask for permission before carrying out the instructions.                                                                                                         |

The `id` attribute **MUST** contain at least one non-whitespace character and **MUST** be unique among the `<instructions>` tags in its document.

The content between the opening and closing `<instructions>` tags **MUST** contain at least one non-whitespace character.

When the **Agent**, including while operating as an **Agent Role**, reads a document, the **Agent** **MUST** follow every instructions tag in that document according to its `approval` attribute.

</rule>

<rule category="tag-reference" id="typed-tag-reference-integrity">

Outside fenced code blocks, every tag reference matching `[DOCUMENT FILENAME]: rule:[ID]`, `[DOCUMENT FILENAME]: variable:[ID]`, or `[DOCUMENT FILENAME]: instructions:[ID]` **MUST** identify exactly one Markdown file defined by `documentation.md: variable:[housekeeping-markdown-files]` whose filename equals `[DOCUMENT FILENAME]`.

The identified document **MUST** contain exactly one tag whose name equals the reference type and whose `id` attribute equals `[ID]`.

`[DOCUMENT FILENAME]` **MUST** match `^[A-Za-z0-9._-]+\.md$`, and `[ID]` **MUST** contain at least one non-whitespace character.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-documentation-governance">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against all current Markdown files identified by `documentation.md: variable:[documentation-markdown-files]` and the current documentation workflow. The **Agent** has approval to inspect those files and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the violated structure, reference, tag, or workflow requirement. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## File and folder references

Every file and folder reference starts at the root of its repository. The text before the colon identifies the repositories to which the reference applies, and the text after the colon is the path from the repository root.

| Format                                                  | Meaning                                                        | Example                                 |
| ------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| `gPronto.Framework:[PATH FROM ROOT]`                    | The path is in **gPronto.Framework**.                          | `gPronto.Framework:XXXXX`               |
| `gPronto.Services:[PATH FROM ROOT]`                     | The path is in **gPronto.Services**.                           | `gPronto.Services:XXXXX`                |
| `gPronto.Tools:[PATH FROM ROOT]`                        | The path is in **gPronto.Tools**.                              | `gPronto.Tools:XXXXX`                   |
| `gPronto.Application:[PATH FROM ROOT]`                  | The path applies to every **gPronto.Application**.             | `gPronto.Application:XXXXX`             |
| `gPronto.Application.Backstage:[PATH FROM ROOT]`        | The path applies to every **gPronto.Application.Backstage**.   | `gPronto.Application.Backstage:XXXXX`   |
| `gPronto.Application.Prototype:[PATH FROM ROOT]`        | The path applies to every **gPronto.Application.Prototype**.   | `gPronto.Application.Prototype:XXXXX`   |
| `gPronto.Application.[PROTOTYPE NAME]:[PATH FROM ROOT]` | The path is in one specific **gPronto.Application.Prototype**. | `gPronto.Application.gPrototype2:XXXXX` |

### Environment variable references

An environment-variable reference identifies one variable in one repository-rooted environment file without exposing its value.

Framework variable:

```text
`gPronto.Framework:.env variable:[SUPABASE_ORGANIZATION_ID]`
```

Variable shared by every application:

```text
`gPronto.Application:.env variable:[VITE_SUPABASE_URL]`
```

Variable belonging to one prototype application:

```text
`gPronto.Application.gPrototype2:.env variable:[VITE_SUPABASE_URL]`
```

## Document chapters

Every Markdown document directly in the folder `gPronto.Framework:documentation` uses the following chapters immediately after its title and in the order shown.

| Chapter        | Definition                                                                                                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Status`       | States whether the document is `Active`, `Draft`, or `Updating`. `Active` means the document is current and can be relied on. `Draft` means the document is still being developed and is not authoritative. |
| `Scope`        | Contains one or more scope statements. Every statement uses `[SCOPE OWNER]:[STATEMENT]`, and the permitted scope owners are defined by `documentation.md: rule:[document-chapter-requirements]`.            |
| `Verification` | States the last date on which the document was verified to be accurate. The value is `-` when the document has not yet been verified.                                                                       |
| `Rules`        | Contains every **Rule** in the document. No other chapter may contain a rule tag.                                                                                                                           |
| `Instructions` | Contains the validation instructions for checking every **Rule** and factual statement and applying validation-error tags when current evidence fails validation.                                           |

## tags

A tag is a marker with a fixed format that an **Agent** or **User** can use to comment, answer a comment, request an action or classify content in a document.

All tags we use are listed below with an explanation.

### user-comment

If a user want to add a comment in a file, the user adds the comment like this:

```md
<user-comment>[COMMENT]</user-comment>
```

Where [COMMENT] is the actual comment.

### user-action

If the user wants something to be done, the user add a action in this format:

```md
<user-action>[ACTION]</user-action>
```

Where [ACTION] is what is to be done.

### agent-comment

If the **Agent** wants to add a comment to a user-comment, that is to be done in this format:

```md
<agent-comment>[COMMENT]</agent-comment>
```

Where [COMMENT] is the actual comment.

An **Agent Role** can record a completed change that is waiting for the **User** to review by adding a standalone agent-comment in this format:

```md
<agent-comment status="waiting-for-user">
YYYY-MM-DD HH:MM [AGENT ROLE NAME]

[DESCRIPTION OF THE COMPLETED CHANGE]

If the User accepts the change, delete this comment. If the User rejects the change, revert the change and delete this comment.
</agent-comment>
```

The waiting comment is placed immediately after the content it describes when that placement is possible. It contains enough information to identify the completed change and to revert it without relying on information outside the document.

### agent-errors

When the **User** asks the **Agent** to mark errors in a document, the **Agent** is to mark the text that contains the error with the agent-error tag in this format:

```md
<agent-error>[TEXT THAT CONTAINS ERROR]</agent-error>
<agent-error-explanation>[THE **AGENT** EXPLANATION TO THE ERROR]</agent-error-explanation>
```

An `agent-error` tag that marks an error **MUST NOT** be enclosed in backticks or a fenced code block.

When an `agent-error` tag is written as an explanation, reference, or example instead of marking an error, it **MUST** be enclosed in backticks or a fenced code block.

### rule

A rule in the **Rules** chapter of a document is marked with the rule tag in this format:

```md
<rule category="[CATEGORY]" id="[ID]">
[RULE TEXT]
</rule>
```

Where [RULE TEXT] is the rule itself.

The rule tag has one required attribute, `category`, and one optional attribute, `id`.

[CATEGORY] is a text field that can be used for many different things. When no category is needed, the value is `none`.

A rule with an `id` is referenced in this format:

```md
[DOCUMENT FILENAME]: rule:[ID]
```

### variable

A variable tag stores reusable content. Its content can be text, a file list, or any other Markdown content.

A variable tag is marked in this format:

```md
<variable id="[ID]">
[VALUE]
</variable>

```

Where [VALUE] is the complete reusable content stored by the variable.

The variable tag has one required attribute, `id`.

[ID] uniquely identifies the variable within its document.

A variable is referenced in this format:

```md
[DOCUMENT FILENAME]: variable:[ID]
```

### instructions

The instructions tag contains one or more generic instructions for the **Agent**, including while operating as an **Agent Role**.

An instruction can require the **Agent**, including while operating as an **Agent Role**, to read, investigate, report, create, edit, delete, run, or perform another explicitly stated action.
Every instructions tag uses this format:

```md
<instructions category="[CATEGORY]" approval="[APPROVAL]" id="[ID]">
[INSTRUCTION TEXT]
</instructions>
```

`[INSTRUCTION TEXT]` contains one or more instructions.

`[CATEGORY]` classifies the instruction. When no category is needed, use `none`.

`[APPROVAL]` is exactly one of:

| Approval  | Meaning                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| `silent`  | The **Agent** carries out the instruction without asking the **User** for permission.         |
| `request` | The **Agent** asks the **User** for permission and waits before carrying out the instruction. |

`[ID]` uniquely identifies the instruction within its document.

An instructions tag is referenced using this format:

```text
[DOCUMENT FILENAME]: instructions:[ID]
```

## Variables

<variable id="documentation-tag-types">

- `rule`
- `instructions`
- `variable`
- `user-comment`
- `agent-comment`
- `user-action`
- `agent-error`
- `agent-error-explanation`

</variable>

<variable id="documentation-markdown-files">

- Every Markdown file directly in `gPronto.Framework:documentation`.

</variable>

<variable id="housekeeping-markdown-files">

- Every Markdown file directly in `gPronto.Framework:documentation`.
- Every Markdown file directly in `gPronto.Framework:.agents`.
- Every Markdown file directly in the **gPronto.Framework** repository root.

</variable>

