export type GProntoFrameworkPostgresDataTableSavedSort = Readonly<{
  field: string;
  order: "asc" | "desc";
}> | null;

export type GProntoFrameworkPostgresDataTableSavedResourceSettings = Readonly<{
  visibleColumns: readonly string[];
  sort: GProntoFrameworkPostgresDataTableSavedSort;
}>;

export type GProntoFrameworkPostgresDataTableSettingsEnvelope = Readonly<{
  Version: 1;
  Format: "PlainJson";
  Payload: Readonly<
    Record<
      string,
      Readonly<
        Record<string, GProntoFrameworkPostgresDataTableSavedResourceSettings>
      >
    >
  >;
}>;
