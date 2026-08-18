import type { GProntoFrameworkApplicationRootOrganisation } from "./gPronto.Framework.ApplicationRoot.OrganisationContract";
import {
  gProntoFrameworkApplicationRootOrganisationPropertyNames,
  gProntoFrameworkApplicationRootSessionPropertyNames,
  gProntoFrameworkApplicationRootUserPropertyNames,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesDefaults";
import {
  readGProntoFrameworkApplicationRootStoredState,
  subscribeToGProntoFrameworkApplicationRootStoredState,
  writeGProntoFrameworkApplicationRootStoredState,
} from "./gPronto.Framework.ApplicationRoot.LocalStorageRepository";
import type { GProntoFrameworkApplicationRootPublicPropertiesState } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStateContract";
import type { GProntoFrameworkApplicationRootSession } from "./gPronto.Framework.ApplicationRoot.SessionContract";
import type { GProntoFrameworkApplicationRootUser } from "./gPronto.Framework.ApplicationRoot.UserContract";

type StoreListener = () => void;

const listeners = new Set<StoreListener>();

function freezeState(
  state: GProntoFrameworkApplicationRootPublicPropertiesState,
): GProntoFrameworkApplicationRootPublicPropertiesState {
  return Object.freeze({
    User: Object.freeze({ ...state.User }),
    Organisation: Object.freeze({ ...state.Organisation }),
    Session: Object.freeze({ ...state.Session }),
  });
}

let currentState = freezeState(
  readGProntoFrameworkApplicationRootStoredState(),
);

function publishState(
  state: GProntoFrameworkApplicationRootPublicPropertiesState,
): void {
  currentState = freezeState(state);

  for (const listener of listeners) {
    listener();
  }
}

subscribeToGProntoFrameworkApplicationRootStoredState((state) => {
  publishState(state);
});

function assertTextValue(
  propertyName: string,
  value: unknown,
): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(
      `GProntoFrameworkApplicationRootComponent.${propertyName} must be a string.`,
    );
  }
}

export function getGProntoFrameworkApplicationRootPublicPropertiesSnapshot(): GProntoFrameworkApplicationRootPublicPropertiesState {
  return currentState;
}

export function subscribeToGProntoFrameworkApplicationRootPublicProperties(
  listener: StoreListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function replaceGProntoFrameworkApplicationRootPublicPropertiesState(
  User: GProntoFrameworkApplicationRootUser,
  Organisation: GProntoFrameworkApplicationRootOrganisation,
  Session: GProntoFrameworkApplicationRootSession,
): void {
  for (const propertyName of gProntoFrameworkApplicationRootUserPropertyNames) {
    assertTextValue(`User.${propertyName}`, User[propertyName]);
  }

  for (const propertyName of gProntoFrameworkApplicationRootOrganisationPropertyNames) {
    assertTextValue(`Organisation.${propertyName}`, Organisation[propertyName]);
  }

  for (const propertyName of gProntoFrameworkApplicationRootSessionPropertyNames) {
    assertTextValue(`Session.${propertyName}`, Session[propertyName]);
  }

  const nextState: GProntoFrameworkApplicationRootPublicPropertiesState = {
    User: { ...User },
    Organisation: { ...Organisation },
    Session: { ...Session },
  };

  writeGProntoFrameworkApplicationRootStoredState(nextState);
  publishState(nextState);
}

export function setGProntoFrameworkApplicationRootUserProperty<
  PropertyName extends keyof GProntoFrameworkApplicationRootUser,
>(propertyName: PropertyName, value: unknown): void {
  assertTextValue(`User.${String(propertyName)}`, value);

  if (currentState.User[propertyName] === value) {
    return;
  }

  const nextState: GProntoFrameworkApplicationRootPublicPropertiesState = {
    User: {
      ...currentState.User,
      [propertyName]: value,
    },
    Organisation: currentState.Organisation,
    Session: currentState.Session,
  };

  writeGProntoFrameworkApplicationRootStoredState(nextState);
  publishState(nextState);
}

export function setGProntoFrameworkApplicationRootOrganisationProperty<
  PropertyName extends keyof GProntoFrameworkApplicationRootOrganisation,
>(propertyName: PropertyName, value: unknown): void {
  assertTextValue(`Organisation.${String(propertyName)}`, value);

  if (currentState.Organisation[propertyName] === value) {
    return;
  }

  const nextState: GProntoFrameworkApplicationRootPublicPropertiesState = {
    User: currentState.User,
    Organisation: {
      ...currentState.Organisation,
      [propertyName]: value,
    },
    Session: currentState.Session,
  };

  writeGProntoFrameworkApplicationRootStoredState(nextState);
  publishState(nextState);
}
