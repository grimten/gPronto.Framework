import type {
  GProntoFrameworkPostgresDataTableSavedResourceSettings,
  GProntoFrameworkPostgresDataTableSavedSort,
  GProntoFrameworkPostgresDataTableSettingsEnvelope,
} from "./gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsContract";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactlyOwnKeys(
  value: object,
  expectedKeys: readonly PropertyKey[],
): boolean {
  const ownKeys = Reflect.ownKeys(value);

  return (
    ownKeys.length === expectedKeys.length &&
    ownKeys.every((key) => expectedKeys.includes(key))
  );
}

function decodeSavedResourceSettings(
  value: unknown,
): GProntoFrameworkPostgresDataTableSavedResourceSettings | null {
  if (
    !isRecord(value) ||
    !hasExactlyOwnKeys(value, ["visibleColumns", "sort"])
  ) {
    return null;
  }

  const visibleColumns = value.visibleColumns;

  if (
    !Array.isArray(visibleColumns) ||
    !visibleColumns.every(
      (column): column is string => typeof column === "string",
    ) ||
    new Set(visibleColumns).size !== visibleColumns.length
  ) {
    return null;
  }

  const storedSort = value.sort;
  let sort: GProntoFrameworkPostgresDataTableSavedSort;

  if (storedSort === null) {
    sort = null;
  } else if (
    isRecord(storedSort) &&
    hasExactlyOwnKeys(storedSort, ["field", "order"]) &&
    typeof storedSort.field === "string" &&
    (storedSort.order === "asc" || storedSort.order === "desc")
  ) {
    sort = Object.freeze({
      field: storedSort.field,
      order: storedSort.order,
    });
  } else {
    return null;
  }

  return Object.freeze({
    visibleColumns: Object.freeze([...visibleColumns]),
    sort,
  });
}

function decodeSettingsPayload(
  value: unknown,
): GProntoFrameworkPostgresDataTableSettingsEnvelope["Payload"] | null {
  if (!isRecord(value)) {
    return null;
  }

  const decodedPayload: Record<
    string,
    Readonly<
      Record<string, GProntoFrameworkPostgresDataTableSavedResourceSettings>
    >
  > = Object.create(null) as Record<
    string,
    Readonly<
      Record<string, GProntoFrameworkPostgresDataTableSavedResourceSettings>
    >
  >;

  for (const [authUserId, storedResources] of Object.entries(value)) {
    if (!isRecord(storedResources)) {
      return null;
    }

    const decodedResources: Record<
      string,
      GProntoFrameworkPostgresDataTableSavedResourceSettings
    > = Object.create(null) as Record<
      string,
      GProntoFrameworkPostgresDataTableSavedResourceSettings
    >;

    for (const [resourceIdentifier, storedSettings] of Object.entries(
      storedResources,
    )) {
      const decodedSettings = decodeSavedResourceSettings(storedSettings);

      if (decodedSettings !== null) {
        decodedResources[resourceIdentifier] = decodedSettings;
      }
    }

    decodedPayload[authUserId] = Object.freeze(decodedResources);
  }

  return Object.freeze(decodedPayload);
}

export function decodeGProntoFrameworkPostgresDataTableSettings(
  storedValue: string | null,
): GProntoFrameworkPostgresDataTableSettingsEnvelope | null {
  if (storedValue === null || typeof storedValue !== "string") {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;

    if (
      !isRecord(parsedValue) ||
      !hasExactlyOwnKeys(parsedValue, ["Version", "Format", "Payload"]) ||
      parsedValue.Version !== 1 ||
      parsedValue.Format !== "PlainJson"
    ) {
      return null;
    }

    const payload = decodeSettingsPayload(parsedValue.Payload);

    if (payload === null) {
      return null;
    }

    return Object.freeze({
      Version: 1,
      Format: "PlainJson",
      Payload: payload,
    });
  } catch {
    return null;
  }
}

export function encodeGProntoFrameworkPostgresDataTableSettings(
  payload: GProntoFrameworkPostgresDataTableSettingsEnvelope["Payload"],
): string {
  return JSON.stringify({
    Version: 1,
    Format: "PlainJson",
    Payload: payload,
  });
}
