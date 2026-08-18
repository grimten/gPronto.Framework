import type { GProntoFrameworkApplicationRootOrganisation } from "./gPronto.Framework.ApplicationRoot.OrganisationContract";
import {
  gProntoFrameworkApplicationRootOrganisationPropertyNames,
  gProntoFrameworkApplicationRootSessionPropertyNames,
  gProntoFrameworkApplicationRootUserPropertyNames,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesDefaults";
import {
  getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  setGProntoFrameworkApplicationRootOrganisationProperty,
  setGProntoFrameworkApplicationRootUserProperty,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import type { GProntoFrameworkApplicationRootUser } from "./gPronto.Framework.ApplicationRoot.UserContract";
import type { GProntoFrameworkApplicationRootSession } from "./gPronto.Framework.ApplicationRoot.SessionContract";

export type GProntoFrameworkApplicationRootPublicProperties = {
  readonly User: GProntoFrameworkApplicationRootUser;
  readonly Organisation: GProntoFrameworkApplicationRootOrganisation;
  readonly Session: GProntoFrameworkApplicationRootSession;
};

function createPublicUser(): GProntoFrameworkApplicationRootUser {
  const user = {};

  for (const propertyName of gProntoFrameworkApplicationRootUserPropertyNames) {
    Object.defineProperty(user, propertyName, {
      configurable: false,
      enumerable: true,
      get: () =>
        getGProntoFrameworkApplicationRootPublicPropertiesSnapshot().User[
          propertyName
        ],
      set: (value: unknown) => {
        setGProntoFrameworkApplicationRootUserProperty(propertyName, value);
      },
    });
  }

  return Object.preventExtensions(user) as GProntoFrameworkApplicationRootUser;
}

function createPublicOrganisation(): GProntoFrameworkApplicationRootOrganisation {
  const organisation = {};

  for (const propertyName of gProntoFrameworkApplicationRootOrganisationPropertyNames) {
    Object.defineProperty(organisation, propertyName, {
      configurable: false,
      enumerable: true,
      get: () =>
        getGProntoFrameworkApplicationRootPublicPropertiesSnapshot()
          .Organisation[propertyName],
      set: (value: unknown) => {
        setGProntoFrameworkApplicationRootOrganisationProperty(
          propertyName,
          value,
        );
      },
    });
  }

  return Object.preventExtensions(
    organisation,
  ) as GProntoFrameworkApplicationRootOrganisation;
}

function createPublicSession(): GProntoFrameworkApplicationRootSession {
  const session = {};

  for (const propertyName of gProntoFrameworkApplicationRootSessionPropertyNames) {
    Object.defineProperty(session, propertyName, {
      configurable: false,
      enumerable: true,
      get: () =>
        getGProntoFrameworkApplicationRootPublicPropertiesSnapshot().Session[
          propertyName
        ],
    });
  }

  return Object.preventExtensions(
    session,
  ) as GProntoFrameworkApplicationRootSession;
}

export const gProntoFrameworkApplicationRootPublicProperties = Object.freeze({
  User: createPublicUser(),
  Organisation: createPublicOrganisation(),
  Session: createPublicSession(),
}) satisfies GProntoFrameworkApplicationRootPublicProperties;
