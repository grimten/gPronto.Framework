# Database naming

## Status

Draft

## Scope

gPronto.Application:Naming requirements for database tables and views.
gPronto.Application:Naming requirements for columns.
gPronto.Application:Naming requirements for constraints and indexes.
gPronto.Application:Naming requirements for triggers and policies.
gPronto.Application:Naming requirements for sequences and types.
gPronto.Application:Excludes access permissions, RLS behavior, SQL procedures, and Edge Functions.

## Verification

Date: 2026-08-18

## Rules

<rule category="database-naming" id="identifier-format">

Every application-owned database object name **MUST** match `^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$`.

</rule>

<rule category="database-naming" id="unquoted-identifiers">

Application-owned database object names **MUST NOT** require double quotes.

</rule>

<rule category="database-naming" id="identifier-length">

Every application-owned database object name **MUST** be no longer than 63 bytes.

</rule>

<rule category="database-naming" id="reserved-keywords">

An application-owned database object name **MUST NOT** equal a PostgreSQL reserved keyword.

</rule>

<rule category="database-naming" id="table-names-plural">

Every application-owned table name **MUST** end in `s`.

</rule>

<rule category="database-naming" id="view-names-plural">

Every application-owned view and materialized view name **MUST** end in `s`.

</rule>

<rule category="database-naming" id="array-columns">

An array column name **MUST** end in `s`.

</rule>

<rule category="database-naming" id="primary-key-column">

The primary key column of an application-owned table **MUST** be named `id`.

</rule>

<rule category="database-naming" id="foreign-key-columns">

A foreign key column **MUST** end in `_id`.

</rule>

<rule category="database-naming" id="timestamp-columns">

A `timestamp with time zone` column name **MUST** end in `_at`.

</rule>

<rule category="database-naming" id="date-columns">

A `date` column name **MUST** end in `_date`.

</rule>

<rule category="database-naming" id="primary-key-constraint">

A primary key constraint **MUST** be named `[TABLE_NAME]_pkey`.

</rule>

<rule category="database-naming" id="index-name">

A non-unique index **MUST** be named `[TABLE_NAME]_[PURPOSE]_idx`, and a unique index **MUST** be named `[TABLE_NAME]_[PURPOSE]_uidx`.

</rule>

<rule category="database-naming" id="no-object-type-infix">

A constraint or index name **MUST NOT** contain the redundant infix `_constraint_` or `_index_`.

</rule>

<rule category="database-naming" id="trigger-name">

A trigger **MUST** be named `[TABLE_NAME]_[TIMING]_[EVENT]_[PURPOSE]_trigger`, where `[TIMING]` is `before`, `after`, or `instead_of` and `[EVENT]` is `insert`, `update`, `delete`, or `truncate`.

</rule>

<rule category="database-naming" id="policy-name">

An RLS policy **MUST** be named `[TABLE_NAME]_[OPERATION]_[AUDIENCE]_policy`, where `[OPERATION]` is `select`, `insert`, `update`, `delete`, or `all`.

</rule>

<rule category="database-naming" id="sequence-name">

An application-owned sequence **MUST** be named `[TABLE_NAME]_[COLUMN_NAME]_seq`.

</rule>

<rule category="database-naming" id="type-name">

An application-owned enum or composite type **MUST** be named `[SUBJECT]_type`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-database-naming">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against every current application SQL source and hosted database object. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every nonconforming object and application. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

