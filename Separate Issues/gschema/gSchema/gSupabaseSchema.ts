export const gSupabaseSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gSupabaseSchema",
  title: "Supabase",
  description:
    "Everything the Supabase browser client needs: its two configuration values, the validation each must pass, the fixed auth options, and the one-client rule.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gSupabaseSchema",
    runtimeLocation: null,
    consumers: [
      "the Supabase configuration validator",
      "the singleton Supabase browser-client factory",
      "the authentication runtime",
      "the Refine Supabase data-provider factory",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksClientCreation: true,
      currentClientConfigurationRemainsAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedConfigurationAndAuthOptionsAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the Supabase client is created",
    },
  },
  suppliedBy: "the application, through the bootstrap request",
  publicLocation: null,
  publicLocationIsNullBecause:
    "the client is private to the framework; an application never receives it",
  configuration: {
    keyOrder: ["SupabaseUrl", "SupabasePublishableKey"],
    fields: {
      SupabaseUrl: {
        datatype: "string",
        required: true,
        nullable: false,
        source: "import.meta.env.VITE_SUPABASE_URL",
        normalization: "trim",
        protocols: ["http:", "https:"],
      },
      SupabasePublishableKey: {
        datatype: "string",
        required: true,
        nullable: false,
        source: "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY",
        normalization: "trim",
      },
    },
    exactOwnKeysRequired: true,
    resultIsFrozen: true,
  },
  validation: {
    configurationMustBeAnObject: true,
    everyValueMustBeANonEmptyStringAfterTrimming: true,
    everyValueIsStoredTrimmed: true,
    urlMustParse: true,
    urlProtocols: ["http:", "https:"],
    validatedConfigurationIsFrozen: true,
    performedDuringRootComponentRendering: true,
    errors: {
      missingConfiguration:
        "Supabase configuration must be supplied by the application.",
      emptyValue:
        "Supabase configuration <name> must be a non-empty string.",
      invalidUrl:
        "Supabase configuration SupabaseUrl must be a valid URL.",
      unsupportedProtocol:
        "Supabase configuration SupabaseUrl must use HTTP or HTTPS.",
    },
  },
  client: {
    clientsPerRunningApplication: 1,
    createdFrom: "the validated configuration",
    sharedBy: ["authentication", "the Refine data provider"],
    sameAuthenticatedSession: true,
    authOptions: {
      flowType: "implicit",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    tokenStorageOwnedBySupabase: true,
    tokensCopiedIntoPublicState: false,
    errors: {
      reinitializedWithDifferentConfiguration:
        "The Supabase browser client has already been initialized with different configuration.",
      usedBeforeInitialization:
        "The Supabase browser client has not been initialized.",
    },
  },
  forbiddenInBrowserValues: [
    "secret key",
    "service-role key",
    "database password",
    "SMTP password",
    "Management API token",
  ],
  package: {
    name: "@supabase/supabase-js",
    pinnedVersion: "2.112.1",
    pinnedInEveryApplication: true,
    minimumNodeVersionForFuturePackageUpdates: 22,
  },
} as const;
