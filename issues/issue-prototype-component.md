# Add prototype information to every layout

## Status

Ready for implementation.

## Goal

Add a framework-owned prototype-information runtime and a public `GComponentPrototypeInfo` **gComponent**. The runtime loads synchronized prototype and webpage metadata into **gPronto.Framework** state. Every public **gLayout** renders the component at its bottom.

The first version displays:

- the prototype name;
- the current webpage name;
- the current webpage description.

## Scope

### Included

- Add an application UUID and application type to every current **gPronto.Application** environment.
- Pass both values through the existing application bootstrap request.
- Validate both values before React rendering begins.
- Add framework-owned immutable prototype state.
- Hydrate prototype and webpage metadata through the existing Supabase browser client.
- Add `GComponentPrototypeInfo` as a bottom **Fixed slot** in every public **gLayout**.
- Display explicit loading and error states.
- Extend the existing **gPronto.Tools** automated-test harness and journeys.
- Update directly affected documentation.

### Excluded

- Changing the synchronized-table definitions, synchronization functions, schedules, RLS policies, or grants.
- Displaying the signed-in Backstage **User** or **Mock user**.
- Adding the right-side information panel or help menu.
- Persisting prototype metadata in local storage.
- Adding speculative repositories, adapters, providers, or abstractions.
- Hiding errors or supplying fallback display values.

## Dependencies

The tables and reverse synchronization specified by `gPronto.Framework:issues/issue-new-tables-sync.md` must exist in the checked-in SQL and hosted databases before successful metadata hydration can be verified.

The existing SQL permits authenticated standard and administrator users to select `project_prototypes` and `project_prototypes_webpages`. It does not permit anonymous access. The prototype runtime therefore starts with the application but performs its database hydration only after Authentication status becomes `SignedIn`.

## Decisions

1. The public **gComponent** name is `GComponentPrototypeInfo`.
2. Every current **gPronto.Application** environment contains `GPRONTO_PROTOTYPE_ID` and `GPRONTO_APPLICATION_TYPE`.
3. `GPRONTO_PROTOTYPE_ID` is the application UUID already recorded in `gPronto.Framework:.env`.
4. `GPRONTO_APPLICATION_TYPE` is exactly `PROTOTYPE` or `BACKSTAGE`.
5. Missing or invalid bootstrap values stop bootstrap with an explicit error.
6. The prototype runtime is owned by **gPronto.Framework**, starts during application-root initialization, and uses the existing Supabase browser client.
7. For a prototype, hydration waits for Authentication status `SignedIn`, reads one prototype row and all of its webpage rows, validates the complete result, and publishes one immutable snapshot.
8. For Backstage, the runtime publishes an inactive ready state without querying prototype metadata, and `GComponentPrototypeInfo` renders nothing.
9. `GComponentPrototypeInfo` never reads Supabase directly. It subscribes to framework-owned prototype state.
10. A failed request, missing row, duplicate current-path match, null required display value, or invalid value produces an explicit visible error.
11. No fallback value is displayed and no error is silently suppressed.
12. The existing database security remains unchanged.
13. The component is an additional **Fixed slot**. It does not replace `GComponentFooter`.
14. The implementation uses existing interfaces and functions where available and introduces only the state, runtime, component, and test behavior required by this issue.

## Public state contract

`GProntoFrameworkApplicationRootComponent.Prototype` is a non-writable and non-configurable public property that always returns the latest immutable prototype snapshot.

The snapshot contains exactly:

```ts
{
  PrototypeId: string;
  ApplicationType: "PROTOTYPE" | "BACKSTAGE";
  Name: string | null;
  Webpages: readonly {
    Path: string;
    Name: string;
    Description: string;
  }[];
  Status: "Initializing" | "Ready" | "Error";
  ErrorMessage: string | null;
}
```

Initial prototype state is:

- the validated bootstrap UUID in `PrototypeId`;
- the validated bootstrap type in `ApplicationType`;
- `null` in `Name`;
- an empty immutable array in `Webpages`;
- `Initializing` in `Status`;
- `null` in `ErrorMessage`.

These values represent initialization state. They are not display fallbacks.

For Backstage, the runtime changes `Status` to `Ready` without a database request. The other values remain unchanged because the component is inactive.

For a prototype, successful hydration publishes the resolved prototype name and every resolved webpage entry with `Status: "Ready"` and `ErrorMessage: null`.

A hydration failure publishes `Status: "Error"` and the native error message. It does not publish a partial prototype name or partial webpage collection.

Signing out clears hydrated metadata and restores the initial prototype state. A later successful sign-in hydrates it again.

## Database reads

After Authentication becomes `SignedIn`, the prototype runtime performs exactly these logical reads through the existing Supabase browser client:

1. Select `id` and `name` from `project_prototypes` where `id` equals `PrototypeId` and `is_deleted` is `false`. Require exactly one row.
2. Select `prototype_id`, `path`, `name`, and `description` from `project_prototypes_webpages` where `prototype_id` equals `PrototypeId` and `is_deleted` is `false`.

Every selected prototype name, webpage path, webpage name, and webpage description must be a string. A null value is an error even though the current SQL permits null webpage metadata.

The runtime does not select connection secrets, URLs, project identifiers, timestamps, synchronization markers, or unrelated columns.

## Component behavior

`GComponentPrototypeInfo` has no public props.

When `ApplicationType` is `BACKSTAGE`, it returns no visible output.

When `ApplicationType` is `PROTOTYPE`:

- `Initializing` renders the existing `GComponentLoader`;
- `Error` renders the existing `GComponentAlert` with `ErrorMessage`;
- `Ready` finds the one stored webpage whose `Path` equals the current React Router pathname;
- zero or multiple pathname matches render an explicit `GComponentAlert`;
- one match renders a semantic footer containing the stored prototype name, webpage name, and webpage description.

The component uses the existing React Router location state so route changes select the new stored webpage without another database request.

## Implementation plan

### 1. Add application identity configuration

Add the two environment values to:

- `gPronto.Application.Backstage:.env`
- `gPronto.Application.gPrototype2:.env`
- `gPronto.Application.gPrototype3:.env`
- `gPronto.Application.gPrototype4:.env`

Use the UUIDs from:

- `gPronto.Framework:.env variable:[GPRONTO_GBACKSTAGE_ID]`
- `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE2_ID]`
- `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE3_ID]`
- `gPronto.Framework:.env variable:[GPRONTO_GPROTOTYPE4_ID]`

Set Backstage to `BACKSTAGE` and every prototype to `PROTOTYPE`. Do not change Vite `envPrefix`.

### 2. Extend bootstrap

Add a required `prototype` value containing `PrototypeId` and `ApplicationType` to the bootstrap request and application definition.

Update:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.BootstrapContract.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.BootstrapCreation.tsx`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.ApplicationDefinitionContract.ts`
- `gPronto.Framework:documentation/assets/gpronto.application/src/gPronto.Application.Bootstrap.EntryPoint.ts`
- all four `gPronto.Application:src/gPronto.Application.Bootstrap.EntryPoint.ts` files.

Use the existing UUID validator. Validate the application type inline. Throw before creating the React root when validation fails.

### 3. Add prototype state and runtime

Create:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PrototypeContract.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PrototypeStore.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PrototypeRuntime.ts`

The store follows the existing immutable snapshot-and-subscribe pattern. The runtime follows the existing consumer-counted start-and-stop pattern, subscribes to Authentication state, performs the database reads once for each signed-in session, clears state on sign-out, and prevents an older request from publishing after the session changes.

Start the runtime from:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PublicComponent.tsx`

Expose the public property from the same file. Do not add this state to Authentication public properties or local storage.

### 4. Add GComponentPrototypeInfo

Create:

- `gPronto.Framework:gPronto.Framework/gComponents/gComponent.PrototypeInfo/gComponent.PrototypeInfo.tsx`

Export it from:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.gComponentExports.ts`

The component subscribes to the prototype store and implements the behavior defined in this issue. It contains no database request.

Add only the CSS needed for the footer presentation to:

- `gPronto.Framework:gPronto.Framework/gPronto.Framework.Styles.css`

### 5. Add the Fixed slot to every layout

Render `GComponentPrototypeInfo` once at the bottom of:

- `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.CardsModern/gLayout.CardsModern.tsx`
- `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.SingleColumn/gLayout.SingleColumn.tsx`
- `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.TwoColumnNavigation/gLayout.TwoColumnNavigation.tsx`

Keep every existing **Fixed slot** and **Open slot** unchanged.

### 6. Extend automated tests

Use the shared **gPronto.Tools** harness. Do not add an application-owned test harness.

Add an `expect-no-text` action by extending the existing action contract and step switch without introducing an unrelated abstraction.

Update:

- `gPronto.Tools:scripts/tests-settings.ts`
- `gPronto.Tools:scripts/tests-steps.ts`
- `gPronto.Tools:test-journeys/detailed-usage-gbackstage.json`
- `gPronto.Tools:test-journeys/detailed-usage-gprototype2.json`
- `gPronto.Tools:test-journeys/detailed-usage-gprototype3.json`
- `gPronto.Tools:test-journeys/detailed-usage-gprototype4.json`

Verify:

1. each prototype displays its synchronized prototype name and current webpage name and description after sign-in;
2. Backstage displays no prototype-information output;
3. a missing current webpage entry produces an explicit visible error;
4. the loading state is visible while hydration is pending;
5. route navigation selects stored webpage metadata without another metadata request;
6. all three public **gLayouts** contain the **Fixed slot**.

For visible browser coverage of all three layouts, add two navigation-hidden verification webpages to gPrototype2: one using `GLayoutSingleColumn` and one using `GLayoutCardsModern`. Add matching synchronized webpage metadata. Keep the existing application webpages for `GLayoutTwoColumnNavigation`.

### 7. Update documentation

Update the directly affected current documentation:

- `gPronto.Framework:documentation/application-bootstrap.md`
- `gPronto.Framework:documentation/application-root.md`
- `gPronto.Framework:documentation/gcomponent-catalog.md`
- `gPronto.Framework:documentation/glayout-catalog.md`
- `gPronto.Framework:documentation/automated-test-catalog.md`
- any other document whose current requirement becomes inaccurate.

## Verification

1. Confirm all four environment files contain a valid UUID and valid application type.
2. Confirm invalid or missing bootstrap values stop bootstrap.
3. Confirm the prototype runtime makes no metadata request in Backstage.
4. Confirm the prototype runtime makes no metadata request before Authentication is signed in.
5. Confirm a prototype makes exactly one prototype request and one webpage request for each signed-in session.
6. Confirm the public snapshot and every webpage entry are frozen.
7. Confirm sign-out removes previously hydrated metadata.
8. Confirm request, row-count, null-value, invalid-value, and current-path failures are visible errors.
9. Confirm route changes reuse stored metadata and do not repeat database reads.
10. Confirm every public **gLayout** renders exactly one `GComponentPrototypeInfo`.
11. Build Backstage and all three prototypes.
12. Run the four shared automated-test journeys.

## Acceptance criteria

Implementation is complete when:

- every application supplies and validates its UUID and type;
- framework initialization owns prototype metadata hydration;
- the public immutable `Prototype` state contains the resolved prototype and webpage metadata;
- `GComponentPrototypeInfo` performs no database access;
- each prototype displays the correct stored metadata after sign-in;
- Backstage displays no component output and performs no prototype metadata request;
- all loading and failure states are explicit;
- no fallback display value or partial result is used;
- every public **gLayout** contains the component as a bottom **Fixed slot**;
- all four builds pass;
- all automated-test assertions pass.

## References

- `gPronto.Framework:issues/issue-new-tables-sync.md`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.ApplicationRoot.PublicComponent.tsx`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.Authentication.Runtime.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.Authentication.StateStore.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.Supabase.BrowserClient.ts`
- `gPronto.Framework:gPronto.Framework/gPronto.Framework.RegisteredWebpages.RouteComposition.tsx`
