# Finalize GComponentPostgresDataTable

## Outcome

Complete `GComponentPostgresDataTable` so a **gPronto.Application** can pass one registered PostgreSQL resource identifier and receive a generic table, View, Insert, Edit, and Delete interface derived from the selected **gPostgresDataContract**.

## Change boundary

Modify exactly one existing source file:

- `gPronto.Framework:gPronto.Framework/gComponents/gComponent.PostgresDataTable/gComponent.PostgresDataTable.tsx`

Do not create another source file or modify any other framework, application, documentation, database, migration, grant, RLS policy, hosted Supabase, or styling file.

## Public contract

Keep the public component name `GComponentPostgresDataTable` and props type `GComponentPostgresDataTableProps` with exactly these props:

- required `resource: string`;
- optional `defaults.visibleColumns?: readonly string[]`;
- optional `defaults.sort?: { field: string; order: "asc" | "desc" } | null`.

Do not add a public prop, export, or compatibility alias. Resolve the resource through `gProntoFrameworkPostgresDataResources` and its registered `meta.gPronto.postgresDataContractSchema`. Do not hardcode a table, column, resource, or **gPronto.Application**.

Reject invalid input during resource resolution and before data access, preserving these exact errors:

- `No gPronto.Framework data resource is registered for the resource identifier "[RESOURCE]".`;
- `The data-table default visible column "[COLUMN]" is not available for resource "[RESOURCE]".`;
- `The data-table default visible column "[COLUMN]" is listed more than once for resource "[RESOURCE]".`;
- `The data-table default sort column "[COLUMN]" is not sortable for resource "[RESOURCE]".`.

## Remaining implementation

- Bind every component-owned operation explicitly to `gProntoFrameworkSupabaseDataProviderName`. Add `dataProviderName` to the table `useDataGrid` configuration and the Insert and Edit `useForm` configuration. Preserve the existing View and Delete bindings.
- Add a failed-table state using the query status and refetch operation returned by `useDataGrid`. Keep the table frame and Insert action available, distinguish failure from loading and both empty states, and provide one Retry `GComponentButton`.
- Add one Retry `GComponentButton` to failed View loads using the existing `useOne` query's refetch operation. Preserve loading, formatted record presentation, and Back to table.
- Add explicit Edit record-load handling. Distinguish initial loading from failure, do not present an empty form as a loaded record, keep Back to table available, and provide one Retry `GComponentButton` that refetches the Edit record.
- Remove Edit Refresh completely, including `useRefreshButton`, `GComponentPostgresDataTableRefreshButton`, its props, and the Edit `headerButtons` rendering. Do not add a post-load replacement.
- Disable Back to table only while an Insert or Edit mutation is pending. Expose mutation-pending state to the operation frame, use the disabled button variant, ignore Back activation while pending, and re-enable it after success or failure. Do not disable Back during Edit loading or retry. Preserve Delete's pending guard.
- Implement Insert database-default omission. Retain `insert.default_expression` in the internal resolved write property. Omit an Insert field when it is not required, the expression is non-null, and its encoded control value represents the empty value returned by `getGComponentPostgresDataTableEmptyFormValue`. Apply this to untouched and cleared controls, never evaluate the expression in the browser, and send `null` only when `validation.allow_null` is `true`.
- Resolve and retain the identifier column's configured `datatable.label` and use it with the identifier value in Delete. Preserve the irreversible-action message, request lock, pending Back guard, success navigation, and retryable failure state.
- Keep handled Refine failures within their frames. Load failures remain retryable. Mutation failures retain entered values or Delete confirmation, settle pending state, and allow retry. Do not throw handled data failures through React rendering.
- Remove imports, internal types, helpers, props, and branches made obsolete by these changes. Implement the remaining behavior in the existing functions and structure. Do not add a new function, component, hook wrapper, table-specific branch, CSS class, or inline style.

## Preserve existing behavior

Preserve the current resource resolver, public-input validation, contract column order, table and action column factories, 25-row server pagination, single-column sorting, filtering restrictions, column visibility, saved-settings precedence and synchronization, mounted table state, View formatting, field derivation, codecs, validators, form validation timing, successful mutation navigation, and Delete request lock unless a remaining implementation item requires a local adjustment.

View shows every contract column whose `datatable.can_be_visible_in_table` is not `false`, regardless of table visibility preferences. Insert uses fields with `insert.allowed: true`; Edit uses fields with `update.allowed: true`. Outside a pending mutation, Back immediately unmounts Insert or Edit and discards entered values without confirmation. No special acceptance behavior is required for resources with no Insert or Edit fields.

Keep View, Edit, and Delete action columns after data columns in that order. Each remains visible, 64 pixels wide, non-sortable, non-filterable, non-hideable, without a column menu, and excluded from saved column settings.

## Decision

- Handled data failures. Source: the error-handling question from **Mr Ricky** on 2026-08-21 at 10:45 and the **User** selection of option 1. Use handled Refine failures, retain the applicable interface state, allow retry, do not convert the failure into a render failure, and require no database log row.
- Unsaved form values. Source: the Back question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** request to unload as simply as possible. Back immediately discards Insert and Edit values without confirmation when no mutation is pending.
- Edit Refresh. Source: the Edit Refresh question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** answer `remove`. Edit has no Refresh action after loading.
- Empty field sets. Source: the zero-field action question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** answer `ignore that`. This edge case has no special acceptance behavior.
- Action-column width. Source: the width question from **Mrs Senior Specs** on 2026-08-21 at 11:30 and the **User** authorization to decide the remaining details. View, Edit, and Delete action columns are 64 pixels wide.
- Initial-sort fallback. Source: the sort question from **Mrs Senior Specs** on 2026-08-21 at 11:50, the **User** preference to sort by id, and authorization to decide the remaining details. Use the resource identifier column in ascending order when no higher-precedence source supplies a sort.
- Failed-load retry. Source: the retry question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** authorization to decide the remaining details. Failed table, View, and Edit loads provide one Retry button.
- Back during mutations. Source: the pending-mutation question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** request for the easiest solution. Disable Back only while create, update, or delete is pending.
- Delta specification. Source: the simplification question from **Mrs Senior Specs** on 2026-08-21 at 13:33, the source audit recorded with that question, and the **User** answer `yes`. Replace the exhaustive narrative with this shorter specification of the public contract, remaining changes, preserved behavior, and verification criteria.
- Governing implementation priority. Source: the **User** instruction in the **Chat** on 2026-08-21 to choose every remaining resolution and prioritize a quick, easy implementation that need not be perfect. Choose the simplest in-scope resolution without asking another specification question. Do not conceal an error, replace an error with fallback data or a fallback value, or introduce a new function. Preserve explicit loading and failure states and allow handled operation failures to remain visible and retryable.
- Implementability. Source: the current-source audit referenced by the simplification investigation and the **User** question in the **Chat** on 2026-08-21. The remaining work is implementable inside the single-file boundary with the existing Refine hooks, query status and refetch operations, value codecs, validators, state, and frame structure. No new public API, dependency, database change, or function is required.

## Verification

Run the existing **gPronto.Framework** type-check and build, followed by the existing type-check and build commands in all four **gPronto.Application** repositories.

If verification exposes an in-scope issue, modify only `gComponent.PostgresDataTable.tsx`. Completion requires every command to pass, no file outside the change boundary to be modified, every frame to follow the selected **gPostgresDataContract**, and all load and mutation failures to remain usable and retryable.
