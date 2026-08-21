# Finalize GComponentPostgresDataTable

## Required outcome

Complete `GComponentPostgresDataTable` so a **gPronto.Application** can pass one registered PostgreSQL resource identifier and receive a complete, consistent table, View, Insert, Edit, and Delete interface.

The component derives all resource-specific behavior from the selected **gPostgresDataContract**. A **gPronto.Application** does not provide column definitions, field definitions, labels, formats, validators, write rules, pagination settings, or action definitions.

The outcome is complete only when the component works generically for every registered resource whose selected **gPostgresDataContract** matches the connected application database.

## Change boundary

Implementation changes exactly one existing source file:

- `gPronto.Framework:gPronto.Framework/gComponents/gComponent.PostgresDataTable/gComponent.PostgresDataTable.tsx`

Do not create another source file.

Do not modify any other **gPronto.Framework** file. In particular, do not modify PostgreSQL resource registration, **gPostgresDataContracts**, saved-settings contracts, saved-settings codecs, saved-settings repositories, public exports, other **gComponents**, or styling files.

Do not modify a **gPronto.Application**, Markdown documentation, database object, migration, grant, RLS policy, or hosted Supabase configuration.

Existing framework APIs and files are dependencies to import, call, and preserve. Their presence in the implementation flow does not place them within the change boundary.

## Public interface

Keep the existing public component name `GComponentPostgresDataTable` and props type `GComponentPostgresDataTableProps`.

The props remain:

- required `resource: string`;
- optional `defaults.visibleColumns?: readonly string[]`;
- optional `defaults.sort?: { field: string; order: "asc" | "desc" } | null`.

Do not add another public prop or compatibility alias.

Reject invalid public input during resource resolution, before a table or record request. Preserve these exact errors:

- unregistered resource: `No gPronto.Framework data resource is registered for the resource identifier "[RESOURCE]".`;
- unavailable visible column: `The data-table default visible column "[COLUMN]" is not available for resource "[RESOURCE]".`;
- duplicate visible column: `The data-table default visible column "[COLUMN]" is listed more than once for resource "[RESOURCE]".`;
- unsortable default sort column: `The data-table default sort column "[COLUMN]" is not sortable for resource "[RESOURCE]".`.

## Resource resolution

Resolve `resource` from the existing `gProntoFrameworkPostgresDataResources` registry and use the registered `meta.gPronto.postgresDataContractSchema` without changing either dependency.

Create one internal resolved-resource description inside `gComponent.PostgresDataTable.tsx`. Derive from the selected resource and **gPostgresDataContract**:

- physical resource identity and identifier-column name;
- resource label;
- **gPostgresDataContract** column order;
- table labels and display formats;
- columns permitted to appear and their initial visibility;
- sortable and filterable columns;
- initial sort;
- Insert and Edit fields;
- required state, literal Insert defaults, help text, configured input selectors, codecs, and validators.

Preserve the current datatype and input-selector behavior of `resolveGComponentPostgresDataTableValueCodec` and `resolveGComponentPostgresDataTableSemanticValidator`. Unsupported configured selectors and datatype-selector combinations fail during resource resolution.

Do not hardcode a table name, column name, or **gPronto.Application**.

## Table frame

The table frame:

- retrieves rows through the registered Refine Supabase data provider;
- uses server pagination with 25 rows per page;
- uses the resolved identifier column as the row identifier;
- preserves **gPostgresDataContract** column order;
- formats displayed values through the existing framework formatter and `datatable.format`;
- renders an empty value when the formatter returns `undefined`;
- permits at most one active sort and exposes sorting only for `datatable.sortable: true` columns;
- exposes filtering only for `datatable.filterable: true` columns;
- restricts UUID filters to equality and, for nullable UUID columns, empty-value operators;
- permits allowed data columns to be shown and hidden;
- keeps row selection disabled;
- distinguishes loading, unfiltered-empty, filtered-empty, and failed states;
- provides accessible Insert, View, Edit, and Delete `GComponentButton` actions;
- appends View, Edit, and Delete columns after the data columns, in that order;
- keeps each action column visible, 64 pixels wide, non-sortable, non-filterable, non-hideable, without a column menu, and outside saved column settings.

Opening another frame and returning to the table preserves the mounted table's pagination, sorting, filtering, and column-visibility state.

A failed table request remains inside the table frame and provides one Retry `GComponentButton`.

## Saved settings integration

Use the existing saved-settings APIs without modifying their implementation.

Settings are scoped by browser origin, signed-in `User.AuthUserId`, and resource identifier. Do not read or write settings when `User.AuthUserId` is empty or `-`.

Apply this precedence:

1. a valid saved resource entry;
2. the public `defaults` prop;
3. the selected **gPostgresDataContract** defaults;
4. the resolved identifier column in ascending order when none of the preceding sources supplies a sort.

An explicit valid `sort: null` means no initial sort.

Write the complete resource settings entry after a column-visibility or sorting change. Subscribe to valid updates from other mounted component instances and browser tabs. Ignore an invalid saved resource entry and continue rendering from the next precedence level.

The existing settings dependency owns storage encoding, legacy migration, read and write notifications, and cross-tab transport. This issue changes only how `GComponentPostgresDataTable` consumes that dependency.

## View frame

View loads the selected record through the registered Refine Supabase data provider.

Display every column whose `datatable.can_be_visible_in_table` value is not `false`, in **gPostgresDataContract** order, using its configured label and formatted value. Table visibility preferences do not remove fields from View.

Provide distinct loading and failed states. A failed View load provides one Retry `GComponentButton`. Back to table remains available during loading and after failure.

## Insert and Edit frames

Insert renders fields whose `insert.allowed` value is `true`. Edit loads the selected record and renders fields whose `update.allowed` value is `true`.

Both frames:

- preserve **gPostgresDataContract** field order;
- use the context label, required state, short description, and literal Insert default;
- map configured selectors to the existing `GComponentInput` kinds;
- decode database values for controls and encode control values for mutations through the existing value codecs;
- apply structural, semantic, and framework-owned validators;
- validate on blur, on later changes after validation activates, and on submission;
- present the first active field error beside its control;
- prevent submission while a codec or validation error exists;
- prevent duplicate submission while a mutation is pending;
- disable Back to table while a mutation is pending;
- return to the table after a successful mutation;
- retain the frame and entered values after a failed mutation.

Outside a pending mutation, Back to table immediately unmounts Insert or Edit and discards entered values without confirmation.

Edit does not provide a Refresh action after the record loads.

For Insert, omit a field when `insert.required` is not `true`, `insert.default_expression` is non-null, and the control contains the empty value returned by `getGComponentPostgresDataTableEmptyFormValue`. Never evaluate `insert.default_expression` in the browser. Send `null` only when `validation.allow_null` is `true`.

No special acceptance behavior is required when a resource has no fields allowed for Insert or Edit.

## Delete frame

Delete opens a confirmation frame that identifies the record with the resolved identifier-column label and value and states that deletion cannot be undone.

Require an explicit Delete record action. Prevent duplicate deletion and disable Back to table while deletion is pending. Return to the table after success. After failure, retain the confirmation frame and re-enable Back and Delete so the person can retry.

## Error handling

Table requests, View and Edit loads, and Insert, Edit, and Delete mutations use handled Refine failures.

Preserve the native Supabase PostgREST `message`, `code`, `details`, and `hint` fields carried by the Refine `HttpError`, together with `statusCode`. Let the registered notification provider present the Supabase message as the title and the Refine operation-failure message as the body.

Do not convert handled data failures into React render failures. They do not clear the application interface and do not require a database log row.

A failed request retains the applicable frame, table state, and entered values. Re-enable controls when the request settles. Failed table, View, and Edit loads retry through their Retry button. Failed mutations retry through their re-enabled submit or Delete action.

The surrounding application navigation remains available. Back to table remains available except while a create, update, or delete mutation is pending.

## Presentation

Use existing public **gComponents**, existing component-owned CSS classes, and the presentation already available to `GComponentPostgresDataTable`.

Do not modify a styling file and do not add inline styling.

Every action has an accessible name. Loading and disabled states remain visible and prevent duplicate operations.

## Required work

The following is the complete remaining implementation list from the current source audit. Every code change occurs inside `gComponent.PostgresDataTable.tsx`. Behavior already present in the component must be preserved and is not a separate workstream.

- [ ] Bind every component-owned data operation explicitly to `gProntoFrameworkSupabaseDataProviderName`. Add the provider to the table's `useDataGrid` configuration and to the Insert and Edit `useForm` configuration. Preserve the existing explicit provider binding for View and Delete.
- [ ] Add an explicit failed-table state. Read the query status and refetch operation returned by `useDataGrid`; distinguish a failed request from loading, an unfiltered empty table, and a filtered table with no results; keep the table frame and Insert action available; and provide one Retry `GComponentButton` that refetches the table request.
- [ ] Add Retry to the View frame. Keep the existing loading state and formatted record presentation, retain Back to table, and render one Retry `GComponentButton` that calls the existing `useOne` query's refetch operation after a failed load.
- [ ] Add explicit Edit record-load handling. Distinguish initial loading from load failure, do not present an empty editable form as a loaded record, keep Back to table available, and provide one Retry `GComponentButton` that refetches the Edit record.
- [ ] Remove Edit Refresh completely. Delete the `useRefreshButton` import, `GComponentPostgresDataTableRefreshButton` props and component, and the Edit `headerButtons` Refresh rendering. Do not replace it with another post-load refresh action.
- [ ] Disable Back to table only while an Insert or Edit mutation is pending. Expose the mutation-pending state from `GComponentPostgresDataTableWriteForm` to its operation frame, render Back with the disabled variant, ignore Back activation while pending, and re-enable it after either success or failure. Do not disable Back merely because an Edit record is loading or retrying. Preserve the existing pending guard in Delete.
- [ ] Implement Insert database-default omission. Extend the component's internal write-context and resolved-property types to retain `insert.default_expression`; when building an Insert payload, omit a field when it is not required, its default expression is non-null, and its encoded control value represents that input's empty value. Apply this to untouched and subsequently cleared controls, never evaluate the expression in the browser, and continue sending `null` only when `validation.allow_null` is `true`.
- [ ] Use the identifier column's configured label in Delete. Resolve and retain the identifier label from the selected **gPostgresDataContract**, display that label with the identifier value in the confirmation frame, and preserve the existing irreversible-action message, duplicate-request lock, pending Back guard, success navigation, and retryable failure state.
- [ ] Preserve handled failure behavior while adding the new states. Table, View, and Edit load failures must continue through Refine notifications and remain retryable; Insert, Edit, and Delete failures must retain their frame and values, settle their pending state, and permit the existing action to be retried; none of these paths may throw through React rendering.
- [ ] Remove imports, internal types, helpers, props, and branches made obsolete by the completed changes. Do not move code into another file and do not introduce a new public prop, export, component, hook wrapper, table-specific branch, CSS class, or inline style.
- [ ] Run the existing **gPronto.Framework** type-check and build. Then run the existing type-check and build commands in all four **gPronto.Application** repositories. If verification exposes an issue within this scope, fix only `gComponent.PostgresDataTable.tsx`; do not edit another file.

The existing resource resolver, public-input errors, column and action factories, 25-row server pagination, sorting and filtering restrictions, column visibility, saved-settings integration, mounted table-state preservation, View formatting, field derivation, codecs, validators, form validation timing, mutation success behavior, and Delete request lock are already present. Preserve them unless a change listed above requires a local adjustment in the same component file.

## Decision

- Handled data failures. Source: the error-handling question from **Mr Ricky** on 2026-08-21 at 10:45 and the **User** selection of option 1. Use handled Refine failures, retain the applicable interface state, allow retry, do not convert the failure into a render failure, and require no database log row.
- Unsaved form values. Source: the Back question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** request to unload as simply as possible. Back immediately discards Insert and Edit values without confirmation when no mutation is pending.
- Edit Refresh. Source: the Edit Refresh question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** answer `remove`. Edit has no Refresh action after loading.
- Empty field sets. Source: the zero-field action question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** answer `ignore that`. This edge case has no special acceptance behavior.
- Action-column width. Source: the width question from **Mrs Senior Specs** on 2026-08-21 at 11:30 and the **User** authorization to decide the remaining details. View, Edit, and Delete action columns are 64 pixels wide.
- Initial-sort fallback. Source: the sort question from **Mrs Senior Specs** on 2026-08-21 at 11:50, the **User** preference to sort by id, and the authorization to decide the remaining details. Use the selected resource's identifier column in ascending order when no higher-precedence source supplies a sort.
- Failed-load retry. Source: the retry question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** authorization to decide the remaining details. Failed table, View, and Edit loads provide one Retry button.
- Back during mutations. Source: the pending-mutation question from **Mrs Senior Specs** on 2026-08-21 at 11:50 and the **User** request for the easiest solution. Disable Back only while create, update, or delete is pending.

## Completion criteria

The issue is complete when:

- only `gComponent.PostgresDataTable.tsx` has implementation changes;
- the component accepts any registered resource identifier whose **gPostgresDataContract** matches the connected database;
- resource resolution rejects invalid inputs before data access;
- table, View, Insert, Edit, and Delete follow the selected **gPostgresDataContract** and the behavior specified above;
- saved settings are consumed through the existing dependency without changing it;
- load and mutation failures remain usable and retryable;
- no new file, public API, table-specific branch, or application-owned configuration is introduced;
- the framework type-check and build pass;
- the existing type-check and build commands pass in all four **gPronto.Application** repositories;
- no file outside the single-file change boundary is modified.

## Out of scope

Everything outside `gComponent.PostgresDataTable.tsx` is out of scope for implementation.

