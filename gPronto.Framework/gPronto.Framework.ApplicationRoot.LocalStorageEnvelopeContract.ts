import type { GProntoFrameworkApplicationRootPublicPropertiesState } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStateContract";

export const G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_VERSION = 1;
export const G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_FORMAT =
  "PlainJson" as const;

export type GProntoFrameworkApplicationRootLocalStorageEnvelope = {
  readonly Version: typeof G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_VERSION;
  readonly Format: typeof G_PRONTO_FRAMEWORK_APPLICATION_ROOT_LOCAL_STORAGE_FORMAT;
  readonly Payload: GProntoFrameworkApplicationRootPublicPropertiesState;
};
