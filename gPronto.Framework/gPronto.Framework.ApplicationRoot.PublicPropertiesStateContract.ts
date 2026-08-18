import type { GProntoFrameworkApplicationRootOrganisation } from "./gPronto.Framework.ApplicationRoot.OrganisationContract";
import type { GProntoFrameworkApplicationRootSession } from "./gPronto.Framework.ApplicationRoot.SessionContract";
import type { GProntoFrameworkApplicationRootUser } from "./gPronto.Framework.ApplicationRoot.UserContract";

export type GProntoFrameworkApplicationRootPublicPropertiesState = {
  readonly User: Readonly<GProntoFrameworkApplicationRootUser>;
  readonly Organisation: Readonly<GProntoFrameworkApplicationRootOrganisation>;
  readonly Session: Readonly<GProntoFrameworkApplicationRootSession>;
};
