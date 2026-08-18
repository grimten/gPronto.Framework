import {
  G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_FORMAT,
  G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_VERSION,
  type GProntoFrameworkApplicationRootLocalStorageEnvelope,
} from "./gPronto.Framework.ApplicationRoot.LocalStorageEnvelopeContract";
import type { GProntoFrameworkApplicationRootOrganisation } from "./gPronto.Framework.ApplicationRoot.OrganisationContract";
import {
  createGProntoFrameworkApplicationRootDefaultOrganisation,
  createGProntoFrameworkApplicationRootDefaultSession,
  createGProntoFrameworkApplicationRootDefaultUser,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesDefaults";
import type { GProntoFrameworkApplicationRootPublicPropertiesState } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStateContract";
import type { GProntoFrameworkApplicationRootSession } from "./gPronto.Framework.ApplicationRoot.SessionContract";
import type { GProntoFrameworkApplicationRootUser } from "./gPronto.Framework.ApplicationRoot.UserContract";

export type GProntoFrameworkApplicationRootLocalStorageDecodeResult = {
  readonly State: GProntoFrameworkApplicationRootPublicPropertiesState;
  readonly RequiresWrite: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeTextFields<T extends object>(value: unknown, defaults: T): T {
  const sanitized = { ...defaults };

  if (!isRecord(value)) {
    return sanitized;
  }

  for (const propertyName of Object.keys(defaults) as Array<keyof T>) {
    const storedValue = value[String(propertyName)];

    if (typeof storedValue === "string") {
      sanitized[propertyName] = storedValue as T[keyof T];
    }
  }

  return sanitized;
}

function createEnvelope(
  state: GProntoFrameworkApplicationRootPublicPropertiesState,
): GProntoFrameworkApplicationRootLocalStorageEnvelope {
  return {
    Version: G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_VERSION,
    Format: G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_FORMAT,
    Payload: state,
  };
}

export function encodeGProntoFrameworkApplicationRootLocalStorage(
  state: GProntoFrameworkApplicationRootPublicPropertiesState,
): string {
  return JSON.stringify(createEnvelope(state));
}

export function decodeGProntoFrameworkApplicationRootLocalStorage(
  storedValue: string | null,
): GProntoFrameworkApplicationRootLocalStorageDecodeResult {
  let parsedValue: unknown;

  try {
    parsedValue = storedValue === null ? null : JSON.parse(storedValue);
  } catch {
    parsedValue = null;
  }

  const parsedEnvelope = isRecord(parsedValue) ? parsedValue : null;

  if (
    parsedEnvelope !== null &&
    typeof parsedEnvelope.Version === "number" &&
    parsedEnvelope.Version !==
      G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_VERSION
  ) {
    throw new Error(
      `Unsupported gPronto.Framework localStorage version: ${parsedEnvelope.Version}.`,
    );
  }

  if (
    parsedEnvelope !== null &&
    typeof parsedEnvelope.Format === "string" &&
    parsedEnvelope.Format !==
      G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_FORMAT
  ) {
    throw new Error(
      `Unsupported gPronto.Framework localStorage format: ${parsedEnvelope.Format}.`,
    );
  }

  const parsedPayload =
    parsedEnvelope !== null && isRecord(parsedEnvelope.Payload)
      ? parsedEnvelope.Payload
      : null;

  const user = sanitizeTextFields<GProntoFrameworkApplicationRootUser>(
    parsedPayload?.User,
    createGProntoFrameworkApplicationRootDefaultUser(),
  );
  const organisation =
    sanitizeTextFields<GProntoFrameworkApplicationRootOrganisation>(
      parsedPayload?.Organisation,
      createGProntoFrameworkApplicationRootDefaultOrganisation(),
    );
  const session = sanitizeTextFields<GProntoFrameworkApplicationRootSession>(
    parsedPayload?.Session,
    createGProntoFrameworkApplicationRootDefaultSession(),
  );
  const state: GProntoFrameworkApplicationRootPublicPropertiesState = {
    User: user,
    Organisation: organisation,
    Session: session,
  };
  const normalizedValue =
    encodeGProntoFrameworkApplicationRootLocalStorage(state);

  return {
    State: state,
    RequiresWrite: storedValue !== normalizedValue,
  };
}
