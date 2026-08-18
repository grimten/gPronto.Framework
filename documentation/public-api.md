# Public API

## Status

Draft

## Scope

gPronto.Framework:The public package entry point.
gPronto.Framework:Public application-root values and types.
gPronto.Framework:Public registered-webpage values and types.
gPronto.Framework:Public **gComponent** values and props types.
gPronto.Framework:Public **gLayout** values and props types.
gPronto.Framework:Public PostgreSQL data-resource identifiers.
gPronto.Framework:Excludes internal modules and the behavior of exported values.

## Verification

Date: 2026-08-18

## Rules

<rule category="entry-point">

The **gPronto.Framework** public package entry point **MUST** be `@gpronto.framework`.

</rule>

<rule category="application-root">

The public API **MUST** export every value and type listed in the application-root exports chapter.

</rule>

<rule category="registered-webpages">

The public API **MUST** export every value and type listed in the registered-webpage exports chapter.

</rule>

<rule category="gcomponents">

The public API **MUST** export every **gComponent** listed in the **gComponent** exports chapter.

</rule>

<rule category="glayouts">

The public API **MUST** export every **gLayout** listed in the **gLayout** exports chapter.

</rule>

<rule category="postgres-data-resources">

The public API **MUST** export exactly the 31 identifiers listed in the PostgreSQL data-resource exports chapter.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-public-api">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current public entry point and every referenced export barrel. The **Agent** has approval to inspect and type-check those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every missing, extra, or mismatched export. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Entry point

The public package entry point is `@gpronto.framework`.

## Application root exports

### Values

- `GProntoFrameworkApplicationRootComponent`
- `bootstrapGProntoFrameworkApplication`

### Types

- `GProntoFrameworkApplicationBootstrapRequest`
- `GProntoFrameworkApplicationDefinition`
- `GProntoFrameworkApplicationRootOrganisation`
- `GProntoFrameworkApplicationRootSession`
- `GProntoFrameworkApplicationRootUser`
- `GProntoFrameworkSupabaseConfiguration`
- `GProntoFrameworkAuthenticationPublicInterface`
- `GProntoFrameworkAuthenticationPublicProperties`
- `GProntoFrameworkAuthenticationState`
- `GProntoFrameworkAuthenticationStatus`
- `GProntoFrameworkNotificationRequest`
- `GProntoFrameworkNotificationType`
- `GProntoFrameworkValidationDescriptor`
- `GProntoFrameworkValidationError`
- `GProntoFrameworkValidationResult`
- `GProntoFrameworkValidatorCatalog`
- `GProntoFrameworkValidatorKey`
- `GProntoFrameworkValueCodecCatalog`
- `GProntoFrameworkValueCodecDescriptor`
- `GProntoFrameworkValueCodecResult`
- `GProntoFrameworkMessageCatalog`

## Registered-webpage exports

### Values

- `createGProntoFrameworkRegisteredWebpageDefinitionRegistry`

### Types

- `GProntoFrameworkRegisteredWebpageDefinition`
- `GProntoFrameworkRegisteredWebpageDefinitionRegistry`
- `GProntoFrameworkRegisteredWebpageIdentifier`
- `GProntoFrameworkRegisteredWebpageMetadata`
- `GProntoFrameworkRegisteredWebpageNavigationMetadata`
- `GProntoFrameworkRegisteredWebpageRouteDefinition`
- `GProntoFrameworkRegisteredWebpageVisibilityMetadata`

## gComponent exports

Every component value identified in this chapter and its exported props type are public. A component that accepts no props has no props type.

### General

- `GComponentAlert`
- `GComponentBadge`
- `GComponentButton`
- `GComponentFooter`
- `GComponentFlow`
- `GComponentHeader`
- `GComponentLoader`
- `GComponentNavigation`
- `GComponentNothing`
- `GComponentPostgresDataTable`
- `GComponentTypography`

### Inputs

- `GComponentInput`

### Authentication

The public authentication component exports are `GComponentAuthenticationCard` and every **gComponent** defined by `authentication-interface.md: variable:[authentication-interface-gcomponents]`.

## gLayout exports

Every listed **gLayout** value and props type are public:

- `GLayoutCardsModern` and `GLayoutCardsModernProps`
- `GLayoutSingleColumn` and `GLayoutSingleColumnProps`
- `GLayoutTwoColumnNavigation` and `GLayoutTwoColumnNavigationProps`

## PostgreSQL data-resource exports

The public API exports these 31 versioned identifiers:

- `PostgresAuditEvents_v1`
- `PostgresAuditEvents_v2`
- `PostgresDataExamples_v1`
- `PostgresDataExamples_v2`
- `PostgresEmailTemplates_v1`
- `PostgresEmailTemplates_v2`
- `PostgresGatekeeperSessions_v1`
- `PostgresLogs_v1`
- `PostgresLogs_v2`
- `PostgresOrganisations_v1`
- `PostgresOrganisations_v2`
- `PostgresProjectPrototypeAuditEvents_v1`
- `PostgresProjectPrototypeEmailTemplates_v1`
- `PostgresProjectPrototypeLogs_v1`
- `PostgresProjectPrototypeOrganisations_v1`
- `PostgresProjectPrototypes_v1`
- `PostgresProjectPrototypeSettings_v1`
- `PostgresProjectPrototypeUserEvents_v1`
- `PostgresProjectPrototypeUsers_v1`
- `PostgresProjectPrototypeUserSessions_v1`
- `PostgresProjects_v1`
- `PostgresProjectTasks_v1`
- `PostgresProjectUserAccessGrants_v1`
- `PostgresSettings_v1`
- `PostgresSettings_v2`
- `PostgresUserEvents_v1`
- `PostgresUserEvents_v2`
- `PostgresUsers_v1`
- `PostgresUsers_v2`
- `PostgresUserSessions_v1`
- `PostgresUserSessions_v2`

The identifiers above **MUST** be exported through `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.PostgresDataResourceExports.ts`. The public API **MUST NOT** export the former unprefixed identifier names or a compatibility alias for `GComponentDataTable`.

