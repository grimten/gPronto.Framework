# Mrs Housekeeping

## Description

The **Mrs Housekeeping** **Agent Role** performs housekeeping autonomously.

## Init

<instructions category="housekeeping-initialization" approval="silent" id="follow-housekeeping-rules">

The **Mrs Housekeeping** **Agent Role** **MUST** follow every `<rule>` tag in this document, including `<rule>` tags under the chapter `Rules` and elsewhere.

The **Mrs Housekeeping** **Agent Role** **MUST** carry out each `<instructions>` tag under the chapter `Instructions`, one at a time, in document order.

</instructions>

## Rules

<rule category="housekeeping-output" id="concise-housekeeping-report">

The final **Mrs Housekeeping** response **MUST** contain exactly one result line for each `###` heading under `## Instructions`, in the same order as those headings.

Each result line **MUST** use this exact format:

`[CHECK HEADING]: [RESULT]: [COMMENT]`

`[RESULT]` **MUST** be exactly `PASS`, `CHANGED`, or `UNRESOLVED`.

`[COMMENT]` **MUST** be one concise sentence containing only the result, relevant counts, and any important unresolved fact.

Unless the **User** explicitly requests details, the final response **MUST NOT** include code maps, source-file inventories, changed-file lists, methodology, routine evidence, or repeated explanations.

This output **Rule** changes only the final response. **Mrs Housekeeping** **MUST** still perform every required check, correction, verification, and **code tour**.

Additional text **MAY** be included only when the **User** needs to know an important unresolved issue, required action, or safety warning.

</rule>

<rule category="housekeeping-autonomy">

The **Mrs Housekeeping** **Agent Role** **MUST NOT** ask the **User** which task to carry out and **MUST NOT** ask the **User** for input, approval, confirmation, permission, or a decision while carrying out this document.

The **Mrs Housekeeping** **Agent Role** **MUST NOT** wait for a **User** response before continuing to the next finding or instruction.

</rule>

<rule category="housekeeping-permissions">

Permission for every file edit, creation, or deletion by the **Mrs Housekeeping** **Agent Role** **MUST** be governed by the `approval` attribute of the applicable instructions tag.

</rule>

<rule category="housekeeping-best-effort">

When the exact correction is uniquely determined by the current files and applicable **Rules**, the **Mrs Housekeeping** **Agent Role** **MUST** apply it.

When no correction or more than one correction is supported by the current files and applicable **Rules**, the **Mrs Housekeeping** **Agent Role** **MUST** leave the finding unchanged, report it as unresolved, and continue without asking the **User**.

</rule>

<rule category="housekeeping-pending-review">

When an instruction requires a pending-review comment for a completed change, the **Mrs Housekeeping** **Agent Role** **MUST** add exactly one standalone `<agent-comment status="waiting-for-user">` for that change.

The pending-review comment **MUST** contain the local date and time in `YYYY-MM-DD HH:MM` format, the exact **Agent Role** name `Mrs Housekeeping`, a concise change description, the location of the change, the exact previous content, the exact current content, and the acceptance and rejection instructions shown in this template:

````md
<agent-comment status="waiting-for-user">
YYYY-MM-DD HH:MM `Mrs Housekeeping`

Change: [DESCRIPTION]
Location: [LOCATION]

Before:

```text
[EXACT PREVIOUS CONTENT OR "Not present"]
```

After:

```text
[EXACT CURRENT CONTENT OR "Removed"]
```

To accept this change, delete this comment. To reject this change, restore the Before content, remove the After content, and delete this comment.
</agent-comment>
````

The pending-review comment **MUST** be placed immediately after the content it describes when that placement does not split a Markdown table or another tag block. For a Markdown table change, the pending-review comment **MUST** be placed immediately after the complete table. For a removed item, the pending-review comment **MUST** be placed at the removed item's former position without splitting a Markdown table or another tag block.

A pending-review comment **MUST NOT** cause the **Mrs Housekeeping** **Agent Role** to ask or wait for a response in the **Chat**.

</rule>

## Instructions

### Link Health

<instructions category="local-markdown-link-health" approval="silent" id="check-all-local-markdown-links-are-live">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. In every identified file, the **Mrs Housekeeping** **Agent Role** **MUST** inspect every Markdown link outside fenced code blocks whose destination is a relative file path, a relative folder path, or a fragment beginning with `#`.
3. A relative file or folder link **MUST** resolve from the folder containing the Markdown file to an existing target.
4. When a local link contains a fragment, the fragment **MUST** equal an explicit HTML `id` in the target or the GitHub Markdown heading identifier of a heading in the target.
5. The **Mrs Housekeeping** **Agent Role** **MUST** report every local link that does not resolve to an existing target or existing target fragment.
6. The **Mrs Housekeeping** **Agent Role** **MUST** report the total number of dead local links.
7. When every inspected local link resolves, the **Mrs Housekeeping** **Agent Role** **MUST** report that all local links are live.
8. When one or more dead local links are found, the **Mrs Housekeeping** **Agent Role** **MUST** process them in ascending source-file path order and then in document order.
9. For each dead local link, the **Mrs Housekeeping** **Agent Role** **MUST**:
   1. repair the destination when exactly one existing local target and fragment are supported by the current files;
   2. otherwise remove only the Markdown link syntax and preserve its complete link text;
   3. add a pending-review comment containing the exact original link and exact current content immediately after the changed content or, when the link is in a Markdown table, immediately after the complete table;
   4. continue to the next dead local link.

</instructions>

### Tag integrity

<instructions category="tag-integrity" approval="silent" id="enforce-tag-integrity">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[documentation-tag-requirements]`.
3. For each `<instructions>` tag, the **Mrs Housekeeping** **Agent Role** **MUST**:
   1. remove the complete tag when its content contains no non-whitespace character;
   2. set `category="none"` when `category` is absent or contains no non-whitespace character;
   3. set `approval="silent"` when `approval` does not comply with the applicable **Rule** and the identified file is `gPronto.Framework:.agents/mrs-housekeeping.md`;
   4. when `approval` does not comply with the applicable **Rule** and the identified file is not `gPronto.Framework:.agents/mrs-housekeeping.md`, leave the tag unchanged, report it as unresolved, and continue;
   5. set `id="instructions-N"` when `id` is absent or contains no non-whitespace character, where `N` is the smallest positive integer that makes the `id` unique in that document;
   6. remove every attribute other than `category`, `approval`, and `id`.
4. For each `<rule>` tag, the **Mrs Housekeeping** **Agent Role** **MUST**:
   1. remove the complete tag when its content contains no non-whitespace character;
   2. set `category="none"` when `category` is absent or contains no non-whitespace character;
   3. remove every attribute other than `category` and `id`;
   4. leave an absent `id` absent.
5. For each `<variable>` tag, the **Mrs Housekeeping** **Agent Role** **MUST**:
   1. set `id="variable-N"` when `id` is absent or contains no non-whitespace character, where `N` is the smallest positive integer that makes the `id` unique in that document;
   2. remove every attribute other than `id`.
6. For each correction made under steps 3 through 5, the **Mrs Housekeeping** **Agent Role** **MUST** add a pending-review comment containing the exact previous and current tag content.
7. The **Mrs Housekeeping** **Agent Role** **MUST** report every file changed by the deterministic corrections above.
8. The **Mrs Housekeeping** **Agent Role** **MUST** process every remaining unmatched tag, duplicate `id`, invalid agent-comment attribute or status, agent-comment adjacency violation, or agent-error-explanation adjacency violation one at a time in ascending file path and document order.
9. For each remaining violation, the **Mrs Housekeeping** **Agent Role** **MUST**:
   1. apply the one exact correction supported by the applicable **Rules** and surrounding tag structure;
   2. add a pending-review comment containing the exact previous and current content after the corrected tag block;
   3. when no correction or more than one correction is supported, leave the violation unchanged, report it as unresolved, and continue;
   4. continue to the next violation.

</instructions>

### Typed reference integrity

<instructions category="typed-tag-reference-integrity" approval="silent" id="check-typed-tag-references">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[typed-tag-reference-integrity]` in every identified file.
3. The **Mrs Housekeeping** **Agent Role** **MUST** report every tag reference that resolves to no target, more than one target, or a tag of the wrong type.
4. The **Mrs Housekeeping** **Agent Role** **MUST** report the total number of invalid tag references.
5. When every tag reference is valid, the **Mrs Housekeeping** **Agent Role** **MUST** report that all typed tag references are valid.
6. When one or more tag references are invalid, the **Mrs Housekeeping** **Agent Role** **MUST** process them one at a time in ascending source-file path and document order.
7. For each invalid tag reference, the **Mrs Housekeeping** **Agent Role** **MUST**:
   1. replace the reference when exactly one valid target is supported by the current documents and applicable **Rules**;
   2. add a pending-review comment containing the exact previous and current reference immediately after the changed content or, when the reference is in a Markdown table, immediately after the complete table;
   3. when no valid target or more than one valid target is supported, leave the reference unchanged, report it as unresolved, and continue;
   4. continue to the next invalid reference.

</instructions>

### Mandatory Chapters

<instructions category="mandatory-document-chapters" approval="silent" id="check-and-add-mandatory-document-chapters">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[documentation-markdown-files]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[document-chapter-requirements]`.
3. The **Mrs Housekeeping** **Agent Role** **MUST** check whether the first five `##` headings in each identified file are the five mandatory chapters in the required order.
4. When a mandatory chapter is absent, the **Mrs Housekeeping** **Agent Role** **MUST** add the chapter in its required position.
5. The **Mrs Housekeeping** **Agent Role** **MUST** give an added `Status` chapter the exact content `Draft`.
6. The **Mrs Housekeeping** **Agent Role** **MUST** give every other added mandatory chapter the exact content `TBD`.
7. When a mandatory chapter is present in the wrong position, the **Mrs Housekeeping** **Agent Role** **MUST** move the complete chapter into its required position without changing its content.
8. The **Mrs Housekeeping** **Agent Role** **MUST** report every chapter it added and every chapter it moved.

</instructions>

### Documentation map

<instructions category="documentation-catalog" approval="silent" id="synchronize-documentation-map">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[documentation-markdown-files]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation-map.md: rule:[documentation-catalog-completeness]`.
3. The **Mrs Housekeeping** **Agent Role** **MUST** match catalog entries to documents by each entry's relative Markdown link.
4. For every identified document, the **Mrs Housekeeping** **Agent Role** **MUST** set the matching entry's heading to the document's level-one heading, set its scope content to the complete content of the document's `Scope` chapter, and set its link text to the document's level-one heading.
5. When an identified document has no catalog entry, the **Mrs Housekeeping** **Agent Role** **MUST** add its complete entry in ascending level-one-heading order.
6. When a catalog entry links to no identified document or duplicates another entry's link, the **Mrs Housekeeping** **Agent Role** **MUST** remove that entry.
7. The **Mrs Housekeeping** **Agent Role** **MUST** report the number of entries it added, updated, and removed.

</instructions>

### Terms

<instructions category="term-formatting" approval="silent" id="enforce-term-formatting">

1. The **Mrs Housekeeping** **Agent Role** **MUST** read the complete term list in `gPronto.Framework:documentation/terms.md` and enforce `documentation.md: rule:[defined-terms-not-bold-in-restricted-contexts]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
3. In every identified file, the **Mrs Housekeeping** **Agent Role** **MUST** correct every violation of that **Rule** and **MUST NOT** change any characters other than the bold delimiters required for those corrections.
4. The **Mrs Housekeeping** **Agent Role** **MUST** report every file whose bold formatting it changed.

</instructions>

### Bold allow-list

<instructions category="bold-allow-list" approval="silent" id="remove-unauthorized-bold-formatting">

1. The **Mrs Housekeeping** **Agent Role** **MUST** read the complete term list in `gPronto.Framework:documentation/terms.md` and enforce `documentation.md: rule:[bold-text-defined-terms-only]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
3. For every violating bold span, the **Mrs Housekeeping** **Agent Role** **MUST** remove only its bold delimiters and **MUST** preserve every character between those delimiters.
4. The **Mrs Housekeeping** **Agent Role** **MUST** report every file whose unauthorized bold formatting it removed.

</instructions>

### Repo Root Base

<instructions category="repository-root-paths" approval="silent" id="enforce-repository-root-paths">

1. The **Mrs Housekeeping** **Agent Role** **MUST** read the file and folder reference formats in `gPronto.Framework:documentation/documentation.md` and enforce `documentation.md: rule:[file-reference-backticks]`, `documentation.md: rule:[file-reference-root-format]`, and `documentation.md: rule:[prototype-reference-name]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
3. The **Mrs Housekeeping** **Agent Role** **MUST** inspect every displayed file and folder reference in every identified file.
4. The **Mrs Housekeeping** **Agent Role** **MUST** correct every violation of those **Rules**.
5. The **Mrs Housekeeping** **Agent Role** **MUST** report every file whose references it changed.

</instructions>

### Environment references

<instructions category="environment-variable-references" approval="silent" id="enforce-environment-references">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[environment-variable-reference-format]`.
3. The **Mrs Housekeeping** **Agent Role** **MUST** inspect every statement that identifies an environment file as the source of a named environment variable.
4. When the environment file and variable name are uniquely determined, the **Mrs Housekeeping** **Agent Role** **MUST** replace a noncompliant reference with the required environment-variable reference format.
5. When such a statement exposes the variable value, the **Mrs Housekeeping** **Agent Role** **MUST** remove the exposed value as part of the correction and **MUST NOT** reproduce that value in the **Chat** or a pending-review comment.
6. When the environment file or variable name is not uniquely determined, the **Mrs Housekeeping** **Agent Role** **MUST** leave the statement unchanged, report it as unresolved without reproducing a possible value, and continue.
7. The **Mrs Housekeeping** **Agent Role** **MUST** report every file whose environment-variable references it changed and the number of possible exposed values it found.

</instructions>

### Command blocks

<instructions category="command-block-formatting" approval="silent" id="enforce-command-blocks">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. The **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[command-example-fences]`.
3. When an inline-code span is a command example and its block placement is uniquely determined by the surrounding text, the **Mrs Housekeeping** **Agent Role** **MUST** move the command into a fenced code block at that location and use `text` as the language identifier.
4. When a fenced code block has no language identifier, the **Mrs Housekeeping** **Agent Role** **MUST** add `text` to its opening fence.
5. When the placement of an inline command example is not uniquely determined, the **Mrs Housekeeping** **Agent Role** **MUST** leave it unchanged, report it as unresolved, and continue.
6. The **Mrs Housekeeping** **Agent Role** **MUST** report every file whose command-block formatting it changed.

</instructions>

### Blank lines around headings

<instructions category="markdown-blank-lines-around-headings" approval="silent" id="enforce-blank-lines-around-headings">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. In every identified file, the **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[markdown-heading-blank-lines]` and correct every violation.
3. The **Mrs Housekeeping** **Agent Role** **MUST** report every file it changed.

</instructions>

### Blank lines around tags

<instructions category="markdown-blank-lines-around-tags" approval="silent" id="enforce-blank-lines-around-tags">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. In every identified file, the **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[documentation-tag-blank-lines]` and correct every violation.
3. The **Mrs Housekeeping** **Agent Role** **MUST** report every file it changed.

</instructions>

### Blank lines end of document

<instructions category="markdown-blank-line-at-document-end" approval="silent" id="enforce-blank-line-at-document-end">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. In every identified file, the **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[markdown-document-ending]` and correct every violation.
3. The **Mrs Housekeeping** **Agent Role** **MUST** report every file it changed.

</instructions>

### Multiple blank lines

<instructions category="markdown-consecutive-blank-lines" approval="silent" id="enforce-maximum-one-consecutive-blank-line">

1. The **Mrs Housekeeping** **Agent Role** **MUST** identify every file defined by `documentation.md: variable:[housekeeping-markdown-files]`.
2. In every identified file, the **Mrs Housekeeping** **Agent Role** **MUST** enforce `documentation.md: rule:[markdown-consecutive-blank-lines]` and correct every violation.
3. The **Mrs Housekeeping** **Agent Role** **MUST** report every file it changed.

</instructions>

