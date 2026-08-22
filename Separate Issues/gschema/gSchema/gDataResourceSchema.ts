export const gDataResourceSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gDataResourceSchema",
  title: "Data resource",
  description:
    "How a gPostgresDataContract becomes a resource Refine can query, and how the data provider that serves it is registered.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gDataResourceSchema",
    runtimeLocation: null,
    consumers: [
      "defineGProntoFrameworkPostgresDataResource",
      "the PostgreSQL data-resource registry",
      "the Refine provider composition",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksResourceRegistration: true,
      currentRuntimeRemainsAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedResourceComputationRulesAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before resources are supplied to Refine",
    },
  },
  ownedBy: "the framework",
  suppliedByTheApplication: ["the Supabase URL", "the publishable key"],
  applicationMayCreateAClient: false,
  applicationMayChooseRegisteredVersions: false,
  computation: {
    name: "the identifier with its leading postgres_ and trailing _v<N> removed",
    identifier: "the identifier exported by the contract file",
    metaLabel: "the contract title followed by an s",
    metaDataProviderName: "supabase",
    metaSchema: "public",
    metaIdColumnName:
      "the name of the contract's only column whose isIdColumn is true",
    metaGProntoPostgresDataContractSchema:
      "the schema exported by the contract file",
  },
  shape: {
    exactOwnKeys: ["name", "identifier", "meta"],
    fields: {
      name: { datatype: "string", required: true, nullable: false },
      identifier: { datatype: "string", required: true, nullable: false },
      meta: {
        datatype: "resourceMetadata",
        required: true,
        nullable: false,
      },
    },
    meta: {
      exactOwnKeys: [
        "label",
        "dataProviderName",
        "schema",
        "idColumnName",
        "gPronto",
      ],
      fields: {
        label: { datatype: "string", required: true, nullable: false },
        dataProviderName: {
          datatype: "string",
          required: true,
          nullable: false,
          value: "supabase",
        },
        schema: {
          datatype: "string",
          required: true,
          nullable: false,
          value: "public",
        },
        idColumnName: {
          datatype: "string",
          required: true,
          nullable: false,
        },
        gPronto: {
          datatype: "gProntoResourceMetadata",
          required: true,
          nullable: false,
        },
      },
    },
    gPronto: {
      exactOwnKeys: ["postgresDataContractSchema"],
      fields: {
        postgresDataContractSchema: {
          datatype: "object",
          required: true,
          nullable: false,
        },
      },
    },
  },
  validation: {
    exactlyOneIdColumnIsRequired: true,
    resourceNamesAreUnique: true,
    identifiersAreUnique: true,
    identifiersMatchTheContractExport: true,
    schemaReferenceIsTheExactFrozenContractObject: true,
  },
  names: {
    registryArray: "gProntoFrameworkPostgresDataResources",
    creationFunction: "defineGProntoFrameworkPostgresDataResource",
    definitionType: "GProntoFrameworkPostgresDataResourceDefinition",
  },
  identifiers: {
    usedByRefineHooks: "the versioned identifier",
    usedByTheAdapter: "the physical table name",
    cacheKeysAreSeparatePerVersion: true,
  },
  provider: {
    package: "@refinedev/supabase",
    pinnedVersion: "6.0.2",
    createdFrom: "the singleton Supabase browser client",
    registeredAs: ["default", "supabase"],
    sharesTheAuthenticatedSession: true,
    refineOptions: { disableTelemetry: true },
  },
  operationInterface: {
    isNativeRefineHooks: true,
    frameworkWrapperHook: false,
    examples: [
      "useList",
      "useMany",
      "useOne",
      "useCreate",
      "useUpdate",
      "useDelete",
    ],
  },
  schemaIsPassive: {
    executedByTheFramework: false,
    compiledIntoARuntimeSchema: false,
    databaseRemainsTheEnforcement: true,
    recordTypesDerivedFromIt: false,
    rowsReturnedToTheApplicationAreUntyped: true,
  },
  outOfScope: [
    "resource routes",
    "list, create, edit, and show pages",
    "live schema discovery",
    "SQL changes",
    "migrations",
    "indexes",
    "constraints",
    "RLS policies",
  ],
} as const;
