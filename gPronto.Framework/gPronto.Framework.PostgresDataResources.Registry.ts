import type { ResourceProps } from "@refinedev/core";
import {
  PostgresAuditEvents_v1,
  AuditEventPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.AuditEvents_v1";
import {
  PostgresAuditEvents_v2,
  AuditEventPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.AuditEvents_v2";
import {
  PostgresDataExamples_v1,
  DataExamplePostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.DataExamples_v1";
import {
  PostgresDataExamples_v2,
  DataExamplePostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.DataExamples_v2";
import {
  PostgresEmailTemplates_v1,
  EmailTemplatePostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.EmailTemplates_v1";
import {
  PostgresEmailTemplates_v2,
  EmailTemplatePostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.EmailTemplates_v2";
import {
  PostgresGatekeeperSessions_v1,
  GatekeeperSessionPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.GatekeeperSessions_v1";
import {
  PostgresLogs_v1,
  LogPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.Logs_v1";
import {
  PostgresLogs_v2,
  LogPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.Logs_v2";
import {
  PostgresOrganisations_v1,
  OrganisationPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.Organisations_v1";
import {
  PostgresOrganisations_v2,
  OrganisationPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.Organisations_v2";
import {
  PostgresProjectPrototypeAuditEvents_v1,
  ProjectPrototypeAuditEventPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeAuditEvents_v1";
import {
  PostgresProjectPrototypeEmailTemplates_v1,
  ProjectPrototypeEmailTemplatePostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeEmailTemplates_v1";
import {
  PostgresProjectPrototypeLogs_v1,
  ProjectPrototypeLogPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeLogs_v1";
import {
  PostgresProjectPrototypeOrganisations_v1,
  ProjectPrototypeOrganisationPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeOrganisations_v1";
import {
  PostgresProjectPrototypes_v1,
  ProjectPrototypePostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypes_v1";
import {
  PostgresProjectPrototypeSettings_v1,
  ProjectPrototypeSettingPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeSettings_v1";
import {
  PostgresProjectPrototypeUserEvents_v1,
  ProjectPrototypeUserEventPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeUserEvents_v1";
import {
  PostgresProjectPrototypeUsers_v1,
  ProjectPrototypeUserPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeUsers_v1";
import {
  PostgresProjectPrototypeUserSessions_v1,
  ProjectPrototypeUserSessionPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectPrototypeUserSessions_v1";
import {
  PostgresProjects_v1,
  ProjectPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.Projects_v1";
import {
  PostgresProjectTasks_v1,
  ProjectTaskPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectTasks_v1";
import {
  PostgresProjectUserAccessGrants_v1,
  ProjectUserAccessGrantPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.ProjectUserAccessGrants_v1";
import {
  PostgresSettings_v1,
  SettingPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.Settings_v1";
import {
  PostgresSettings_v2,
  SettingPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.Settings_v2";
import {
  PostgresUserEvents_v1,
  UserEventPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.UserEvents_v1";
import {
  PostgresUserEvents_v2,
  UserEventPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.UserEvents_v2";
import {
  PostgresUsers_v1,
  UserPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.Users_v1";
import {
  PostgresUsers_v2,
  UserPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.Users_v2";
import {
  PostgresUserSessions_v1,
  UserSessionPostgresDataContractSchema_v1,
} from "./gPostgresDataContracts/gPostgresDataContract.UserSessions_v1";
import {
  PostgresUserSessions_v2,
  UserSessionPostgresDataContractSchema_v2,
} from "./gPostgresDataContracts/gPostgresDataContract.UserSessions_v2";
import { defineGProntoFrameworkPostgresDataResource } from "./gPronto.Framework.PostgresDataResources.DefinitionCreation";

export { gProntoFrameworkSupabaseDataProviderName } from "./gPronto.Framework.Supabase.DataProvider";

export const gProntoFrameworkPostgresDataResources = [
  defineGProntoFrameworkPostgresDataResource(
    PostgresAuditEvents_v1,
    AuditEventPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresAuditEvents_v2,
    AuditEventPostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresDataExamples_v1,
    DataExamplePostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresDataExamples_v2,
    DataExamplePostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresEmailTemplates_v1,
    EmailTemplatePostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresEmailTemplates_v2,
    EmailTemplatePostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresGatekeeperSessions_v1,
    GatekeeperSessionPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresLogs_v1,
    LogPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresLogs_v2,
    LogPostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresOrganisations_v1,
    OrganisationPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresOrganisations_v2,
    OrganisationPostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeAuditEvents_v1,
    ProjectPrototypeAuditEventPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeEmailTemplates_v1,
    ProjectPrototypeEmailTemplatePostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeLogs_v1,
    ProjectPrototypeLogPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeOrganisations_v1,
    ProjectPrototypeOrganisationPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypes_v1,
    ProjectPrototypePostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeSettings_v1,
    ProjectPrototypeSettingPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeUserEvents_v1,
    ProjectPrototypeUserEventPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeUsers_v1,
    ProjectPrototypeUserPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectPrototypeUserSessions_v1,
    ProjectPrototypeUserSessionPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjects_v1,
    ProjectPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectTasks_v1,
    ProjectTaskPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresProjectUserAccessGrants_v1,
    ProjectUserAccessGrantPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresSettings_v1,
    SettingPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresSettings_v2,
    SettingPostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresUserEvents_v1,
    UserEventPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresUserEvents_v2,
    UserEventPostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresUsers_v1,
    UserPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresUsers_v2,
    UserPostgresDataContractSchema_v2,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresUserSessions_v1,
    UserSessionPostgresDataContractSchema_v1,
  ),
  defineGProntoFrameworkPostgresDataResource(
    PostgresUserSessions_v2,
    UserSessionPostgresDataContractSchema_v2,
  ),
] satisfies ResourceProps[];
