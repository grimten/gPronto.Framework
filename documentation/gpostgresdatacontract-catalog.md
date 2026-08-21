# gPostgresDataContract catalog

## Status

Draft

## Scope

gPronto.Framework:The current **gPostgresDataContract** catalog.
gPronto.Framework:The physical table and available version identifiers for each catalog entry.
gPronto.Framework:Excludes schema design, versioning, registration, and consumer requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="gpostgresdatacontract-catalog-current">

The catalog **MUST** contain every current **gPostgresDataContract** version registered by **gPronto.Framework** and **MUST NOT** contain an unregistered version.

Every physical table name and versioned identifier **MUST** match the current contract source and registry.

</rule>

<rule category="catalog" id="gpostgresdatacontract-catalog-overview">

This document **MUST** describe only the current **gPostgresDataContract** inventory. It **MUST NOT** define how a contract, schema, resource, or database table is built.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gpostgresdatacontract-catalog">

The **Agent** **MUST** validate this catalog against the current files in `gPronto.Framework:gPronto.Framework/gPostgresDataContracts` and the current PostgreSQL resource registry. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Catalog

| Physical table                      | Available identifiers                                        | Current shape use                 |
| ----------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| `audit_events`                      | `postgres_audit_events_v1`, `postgres_audit_events_v2`       | `_v1` Backstage; `_v2` prototypes |
| `data_examples`                     | `postgres_data_examples_v1`, `postgres_data_examples_v2`     | `_v1` Backstage; `_v2` prototypes |
| `email_templates`                   | `postgres_email_templates_v1`, `postgres_email_templates_v2` | `_v1` Backstage; `_v2` prototypes |
| `gatekeeper_sessions`               | `postgres_gatekeeper_sessions_v1`                            | Backstage                         |
| `logs`                              | `postgres_logs_v1`, `postgres_logs_v2`                       | `_v1` Backstage; `_v2` prototypes |
| `organisations`                     | `postgres_organisations_v1`, `postgres_organisations_v2`     | `_v1` Backstage; `_v2` prototypes |
| `project_prototype_audit_events`    | `postgres_project_prototype_audit_events_v1`                 | Backstage                         |
| `project_prototype_email_templates` | `postgres_project_prototype_email_templates_v1`              | Backstage                         |
| `project_prototype_logs`            | `postgres_project_prototype_logs_v1`                         | Backstage                         |
| `project_prototype_organisations`   | `postgres_project_prototype_organisations_v1`                | Backstage                         |
| `project_prototypes`                | `postgres_project_prototypes_v1`                             | Backstage                         |
| `project_prototype_settings`        | `postgres_project_prototype_settings_v1`                     | Backstage                         |
| `project_prototype_user_events`     | `postgres_project_prototype_user_events_v1`                  | Backstage                         |
| `project_prototype_user_sessions`   | `postgres_project_prototype_user_sessions_v1`                | Backstage                         |
| `project_prototype_users`           | `postgres_project_prototype_users_v1`                        | Backstage                         |
| `projects`                          | `postgres_projects_v1`                                       | Backstage                         |
| `project_tasks`                     | `postgres_project_tasks_v1`                                  | Backstage                         |
| `project_user_access_grants`        | `postgres_project_user_access_grants_v1`                     | Backstage                         |
| `settings`                          | `postgres_settings_v1`, `postgres_settings_v2`               | `_v1` Backstage; `_v2` prototypes |
| `user_events`                       | `postgres_user_events_v1`, `postgres_user_events_v2`         | `_v1` Backstage; `_v2` prototypes |
| `users`                             | `postgres_users_v1`, `postgres_users_v2`                     | `_v1` Backstage; `_v2` prototypes |
| `user_sessions`                     | `postgres_user_sessions_v1`, `postgres_user_sessions_v2`     | `_v1` Backstage; `_v2` prototypes |

The catalog contains 31 versions for 22 physical tables.

