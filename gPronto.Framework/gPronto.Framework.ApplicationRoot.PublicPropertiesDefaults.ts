import type { GProntoFrameworkApplicationRootOrganisation } from "./gPronto.Framework.ApplicationRoot.OrganisationContract";
import type { GProntoFrameworkApplicationRootPublicPropertiesState } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStateContract";
import type { GProntoFrameworkApplicationRootSession } from "./gPronto.Framework.ApplicationRoot.SessionContract";
import type { GProntoFrameworkApplicationRootUser } from "./gPronto.Framework.ApplicationRoot.UserContract";

const defaultUser = {
  UserId: "-",
  AuthUserId: "-",
  Email: "-",
  FirstName: "-",
  LastName: "-",
  Role: "-",
  RoleApplication: "-",
  RolePrototype: "-",
  OrganisationId: "-",
  ProfileUrl: "-",
  Language: "-",
  Locale: "-",
  CurrencyCode: "-",
  DateFormat: "-",
  DatetimeFormat: "-",
  CurrencyFormat: "-",
  Blocked: "-",
  CanInitiate: "-",
  CanProcess: "-",
  Kyc: "-",
  Settings: "-",
} satisfies GProntoFrameworkApplicationRootUser;

const defaultOrganisation = {
  OrganisationId: "-",
  Name: "-",
  Type: "-",
  ProfileUrl: "-",
  Kyb: "-",
  Settings: "-",
} satisfies GProntoFrameworkApplicationRootOrganisation;

const defaultSession = {
  SessionId: "-",
} satisfies GProntoFrameworkApplicationRootSession;

export const gProntoFrameworkApplicationRootUserPropertyNames = Object.freeze(
  Object.keys(defaultUser) as Array<keyof GProntoFrameworkApplicationRootUser>,
);

export const gProntoFrameworkApplicationRootOrganisationPropertyNames =
  Object.freeze(
    Object.keys(defaultOrganisation) as Array<
      keyof GProntoFrameworkApplicationRootOrganisation
    >,
  );

export const gProntoFrameworkApplicationRootSessionPropertyNames =
  Object.freeze(
    Object.keys(defaultSession) as Array<
      keyof GProntoFrameworkApplicationRootSession
    >,
  );

export function createGProntoFrameworkApplicationRootDefaultUser(): GProntoFrameworkApplicationRootUser {
  return { ...defaultUser };
}

export function createGProntoFrameworkApplicationRootDefaultOrganisation(): GProntoFrameworkApplicationRootOrganisation {
  return { ...defaultOrganisation };
}

export function createGProntoFrameworkApplicationRootDefaultSession(): GProntoFrameworkApplicationRootSession {
  return { ...defaultSession };
}

export function createGProntoFrameworkApplicationRootDefaultPublicPropertiesState(): GProntoFrameworkApplicationRootPublicPropertiesState {
  return {
    User: createGProntoFrameworkApplicationRootDefaultUser(),
    Organisation: createGProntoFrameworkApplicationRootDefaultOrganisation(),
    Session: createGProntoFrameworkApplicationRootDefaultSession(),
  };
}
