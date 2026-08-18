import { notifyGProntoFramework } from "./gPronto.Framework.ApplicationRoot.NotificationCreation";
import {
  decodeGProntoFrameworkPostgresDataTableSettings,
  encodeGProntoFrameworkPostgresDataTableSettings,
} from "./gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsCodec";
import type {
  GProntoFrameworkPostgresDataTableSavedResourceSettings,
  GProntoFrameworkPostgresDataTableSettingsEnvelope,
} from "./gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsContract";

const G_PRONTO_FRAMEWORK_POSTGRES_DATA_TABLE_SETTINGS_STORAGE_KEY =
  "gPronto.Framework.PostgresDataTableSettings";
const G_PRONTO_FRAMEWORK_LEGACY_SETTINGS_STORAGE_KEY =
  "gPronto.Framework.DataTableSettings";

const readFailureNotification = Object.freeze({
  type: "error" as const,
  message: "The saved table settings could not be loaded.",
  deduplicationKey: "GComponentPostgresDataTable.Settings.ReadFailure",
});

const writeFailureNotification = Object.freeze({
  type: "error" as const,
  message: "The table settings could not be saved.",
  deduplicationKey: "GComponentPostgresDataTable.Settings.WriteFailure",
});

type PostgresDataTableSettingsListener = (
  settings: GProntoFrameworkPostgresDataTableSavedResourceSettings | null,
) => void;

type PostgresDataTableSettingsSubscription = Readonly<{
  authUserId: string;
  resourceIdentifier: string;
  listener: PostgresDataTableSettingsListener;
}>;

const subscriptions = new Set<PostgresDataTableSettingsSubscription>();
let storageEventWindow: Window | null = null;

function notifyReadFailure(): void {
  notifyGProntoFramework(readFailureNotification);
}

function notifyWriteFailure(): void {
  notifyGProntoFramework(writeFailureNotification);
}

function isSignedOutAuthUserId(authUserId: string): boolean {
  return authUserId === "" || authUserId === "-";
}

function getBrowserLocalStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("The browser window is unavailable.");
  }

  return window.localStorage;
}

function createMigratedSettingsEnvelope(
  legacyEnvelope: GProntoFrameworkPostgresDataTableSettingsEnvelope,
): GProntoFrameworkPostgresDataTableSettingsEnvelope {
  const migratedPayload: Record<
    string,
    Record<string, GProntoFrameworkPostgresDataTableSavedResourceSettings>
  > = Object.create(null) as Record<
    string,
    Record<string, GProntoFrameworkPostgresDataTableSavedResourceSettings>
  >;

  for (const [authUserId, legacyResources] of Object.entries(
    legacyEnvelope.Payload,
  )) {
    const migratedResources: Record<
      string,
      GProntoFrameworkPostgresDataTableSavedResourceSettings
    > = Object.create(null) as Record<
      string,
      GProntoFrameworkPostgresDataTableSavedResourceSettings
    >;

    for (const [legacyResourceIdentifier, settings] of Object.entries(
      legacyResources,
    )) {
      migratedResources[`postgres_${legacyResourceIdentifier}`] = settings;
    }

    migratedPayload[authUserId] = Object.freeze(migratedResources);
  }

  return Object.freeze({
    Version: 1,
    Format: "PlainJson",
    Payload: Object.freeze(migratedPayload),
  });
}

function migrateLegacyStoredSettingsEnvelope(
  browserLocalStorage: Storage,
): GProntoFrameworkPostgresDataTableSettingsEnvelope | null {
  let legacyStoredValue: string | null;

  try {
    legacyStoredValue = browserLocalStorage.getItem(
      G_PRONTO_FRAMEWORK_LEGACY_SETTINGS_STORAGE_KEY,
    );
  } catch {
    notifyReadFailure();
    return null;
  }

  if (legacyStoredValue === null) {
    return null;
  }

  const legacyEnvelope =
    decodeGProntoFrameworkPostgresDataTableSettings(legacyStoredValue);

  if (legacyEnvelope === null) {
    notifyReadFailure();
    return null;
  }

  const migratedEnvelope = createMigratedSettingsEnvelope(legacyEnvelope);

  try {
    browserLocalStorage.setItem(
      G_PRONTO_FRAMEWORK_POSTGRES_DATA_TABLE_SETTINGS_STORAGE_KEY,
      encodeGProntoFrameworkPostgresDataTableSettings(migratedEnvelope.Payload),
    );
  } catch {
    notifyWriteFailure();
    return null;
  }

  return migratedEnvelope;
}

function readStoredSettingsEnvelope(): GProntoFrameworkPostgresDataTableSettingsEnvelope | null {
  let browserLocalStorage: Storage;
  let storedValue: string | null;

  try {
    browserLocalStorage = getBrowserLocalStorage();
    storedValue = browserLocalStorage.getItem(
      G_PRONTO_FRAMEWORK_POSTGRES_DATA_TABLE_SETTINGS_STORAGE_KEY,
    );
  } catch {
    notifyReadFailure();
    return null;
  }

  const envelope = decodeGProntoFrameworkPostgresDataTableSettings(storedValue);

  if (storedValue !== null && envelope === null) {
    notifyReadFailure();
  }

  return envelope ?? migrateLegacyStoredSettingsEnvelope(browserLocalStorage);
}

function selectSavedResourceSettings(
  envelope: GProntoFrameworkPostgresDataTableSettingsEnvelope | null,
  authUserId: string,
  resourceIdentifier: string,
): GProntoFrameworkPostgresDataTableSavedResourceSettings | null {
  return envelope?.Payload[authUserId]?.[resourceIdentifier] ?? null;
}

function createSavedResourceSettings(
  settings: GProntoFrameworkPostgresDataTableSavedResourceSettings,
): GProntoFrameworkPostgresDataTableSavedResourceSettings {
  return Object.freeze({
    visibleColumns: Object.freeze([...settings.visibleColumns]),
    sort:
      settings.sort === null
        ? null
        : Object.freeze({
            field: settings.sort.field,
            order: settings.sort.order,
          }),
  });
}

function createUpdatedEnvelope(
  currentEnvelope: GProntoFrameworkPostgresDataTableSettingsEnvelope | null,
  authUserId: string,
  resourceIdentifier: string,
  settings: GProntoFrameworkPostgresDataTableSavedResourceSettings,
): GProntoFrameworkPostgresDataTableSettingsEnvelope {
  const currentResources = currentEnvelope?.Payload[authUserId] ?? {};
  const updatedResources = Object.freeze({
    ...currentResources,
    [resourceIdentifier]: settings,
  });
  const updatedPayload = Object.freeze({
    ...(currentEnvelope?.Payload ?? {}),
    [authUserId]: updatedResources,
  });

  return Object.freeze({
    Version: 1,
    Format: "PlainJson",
    Payload: updatedPayload,
  });
}

function publishSettingsEnvelope(
  envelope: GProntoFrameworkPostgresDataTableSettingsEnvelope | null,
): void {
  for (const subscription of [...subscriptions]) {
    subscription.listener(
      selectSavedResourceSettings(
        envelope,
        subscription.authUserId,
        subscription.resourceIdentifier,
      ),
    );
  }
}

function handleStorageEvent(event: StorageEvent): void {
  if (
    event.key !== G_PRONTO_FRAMEWORK_POSTGRES_DATA_TABLE_SETTINGS_STORAGE_KEY &&
    event.key !== null
  ) {
    return;
  }

  if (event.storageArea !== null) {
    try {
      if (
        storageEventWindow === null ||
        event.storageArea !== storageEventWindow.localStorage
      ) {
        return;
      }
    } catch {
      notifyReadFailure();
      return;
    }
  }

  const envelope =
    event.newValue === null
      ? null
      : decodeGProntoFrameworkPostgresDataTableSettings(event.newValue);

  if (event.newValue !== null && envelope === null) {
    notifyReadFailure();
  }

  publishSettingsEnvelope(envelope);
}

function startObservingStorageEvents(): void {
  if (storageEventWindow !== null || typeof window === "undefined") {
    return;
  }

  try {
    window.addEventListener("storage", handleStorageEvent);
    storageEventWindow = window;
  } catch {
    storageEventWindow = null;
  }
}

function stopObservingStorageEvents(): void {
  if (subscriptions.size !== 0 || storageEventWindow === null) {
    return;
  }

  try {
    storageEventWindow.removeEventListener("storage", handleStorageEvent);
  } finally {
    storageEventWindow = null;
  }
}

export function readGProntoFrameworkPostgresDataTableSavedSettings(
  authUserId: string,
  resourceIdentifier: string,
): GProntoFrameworkPostgresDataTableSavedResourceSettings | null {
  if (isSignedOutAuthUserId(authUserId)) {
    return null;
  }

  return selectSavedResourceSettings(
    readStoredSettingsEnvelope(),
    authUserId,
    resourceIdentifier,
  );
}

export function writeGProntoFrameworkPostgresDataTableSavedSettings(
  authUserId: string,
  resourceIdentifier: string,
  settings: GProntoFrameworkPostgresDataTableSavedResourceSettings,
): void {
  if (isSignedOutAuthUserId(authUserId)) {
    return;
  }

  const currentEnvelope = readStoredSettingsEnvelope();
  let updatedEnvelope: GProntoFrameworkPostgresDataTableSettingsEnvelope;

  try {
    updatedEnvelope = createUpdatedEnvelope(
      currentEnvelope,
      authUserId,
      resourceIdentifier,
      createSavedResourceSettings(settings),
    );
    const storedValue = encodeGProntoFrameworkPostgresDataTableSettings(
      updatedEnvelope.Payload,
    );

    getBrowserLocalStorage().setItem(
      G_PRONTO_FRAMEWORK_POSTGRES_DATA_TABLE_SETTINGS_STORAGE_KEY,
      storedValue,
    );
  } catch {
    notifyWriteFailure();
    return;
  }

  publishSettingsEnvelope(updatedEnvelope);
}

export function subscribeToGProntoFrameworkPostgresDataTableSavedSettings(
  authUserId: string,
  resourceIdentifier: string,
  listener: PostgresDataTableSettingsListener,
): () => void {
  if (isSignedOutAuthUserId(authUserId)) {
    return () => undefined;
  }

  const subscription = Object.freeze({
    authUserId,
    resourceIdentifier,
    listener,
  });
  let subscribed = true;

  subscriptions.add(subscription);
  startObservingStorageEvents();

  return () => {
    if (!subscribed) {
      return;
    }

    subscribed = false;
    subscriptions.delete(subscription);
    stopObservingStorageEvents();
  };
}
