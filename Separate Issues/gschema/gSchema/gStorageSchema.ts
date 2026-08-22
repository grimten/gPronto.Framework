export const gStorageSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gStorageSchema",
  title: "Storage",
  description:
    "The envelope every stored browser value shares, the keys the framework owns, the payload under each, and the normalization and migration rules.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gStorageSchema",
    runtimeLocation: null,
    consumers: [
      "the public-properties storage codec and repository",
      "the PostgreSQL data-table settings codec and repository",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksStorageRepositoryStartup: true,
      currentCodecsRemainAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedKeysEnvelopeShapesAndMigrationRulesAreRemovedAfterAdoption: true,
      unsupportedVersion: "throw before a stored payload is consumed",
    },
  },
  medium: "browser localStorage",
  scopedBy: "browser origin",
  envelope: {
    keyOrder: ["Version", "Format", "Payload"],
    fields: {
      Version: {
        datatype: "integer",
        required: true,
        nullable: false,
        default: 1,
        allowedValues: [1],
      },
      Format: {
        datatype: "string",
        required: true,
        nullable: false,
        default: "PlainJson",
        allowedValues: ["PlainJson"],
      },
      Payload: {
        datatype: "object",
        required: true,
        nullable: false,
      },
    },
    exactOwnKeysRequired: true,
  },
  envelopeIsSharedByEveryKey: true,
  entries: {
    publicProperties: {
      storageKey: "gPronto.Framework.LocalStorage",
      payload: {
        keyOrder: ["User", "Organisation", "Session"],
        fields: {
          User: {
            datatype: "gUserSchema.fields",
            required: true,
            nullable: false,
          },
          Organisation: {
            datatype: "gOrganisationSchema.fields",
            required: true,
            nullable: false,
          },
          Session: {
            datatype: "gSessionSchema.fields",
            required: true,
            nullable: false,
          },
        },
        exactOwnKeysRequired: true,
      },
      readSynchronouslyDuringModuleInitialization: true,
      normalization: {
        missingStorage: "defaults",
        malformedJson: "defaults",
        missingPayload: "defaults",
        nonObjectMember: "defaults",
        missingField: "its default",
        nonStringFieldValue: "its default",
        normalizedEnvelopeIsWrittenBack: true,
      },
      throwsOn: {
        unsupportedVersion:
          "Unsupported gPronto.Framework localStorage version: <version>.",
        unsupportedFormat:
          "Unsupported gPronto.Framework localStorage format: <format>.",
        storageAccessReadSerializationOrWriteError: true,
      },
      notPersisted: ["the authentication status", "the error message"],
      crossTab: {
        storageEventResetsReceivingTabsToDefaults: true,
        doesNotChangeTheAuthenticationStatus: true,
        theClearingDocumentReceivesNoEventOfItsOwn: true,
      },
    },
    postgresDataTableSettings: {
      storageKey: "gPronto.Framework.PostgresDataTableSettings",
      payload: {
        keyedBy: ["AuthUserId", "resource identifier"],
        entry: {
          visibleColumns: {
            datatype: "readonly string[]",
            required: true,
            nullable: false,
          },
          sort: {
            datatype: "object",
            required: true,
            nullable: true,
            fields: {
              field: {
                datatype: "string",
                required: true,
                nullable: false,
              },
              order: {
                datatype: "string",
                required: true,
                nullable: false,
                allowedValues: ["asc", "desc"],
              },
            },
          },
        },
      },
      entriesContainExactly: ["visibleColumns", "sort"],
      actionColumnsAreStored: false,
      writtenAfter: ["a column visibility change", "a sorting change"],
      notReadOrWrittenWhenAuthUserIdIs: ["", "-"],
      precedence: [
        "a valid saved entry",
        "the public defaults",
        "the gPostgresDataContract settings",
      ],
      ignoredWhen: [
        "malformed storage",
        "an unsupported version or format",
        "an invalid resource entry",
        "an unknown column",
        "a duplicated column",
        "a non-sortable sort column",
      ],
      migration: {
        fromKey: "gPronto.Framework.DataTableSettings",
        appliedWhen: "the current key holds no valid settings",
        transform: "prefix every resource key with postgres_",
        deletesOrModifiesTheFormerKey: false,
        afterTheAttemptOnlyTheCurrentKeyParticipates: true,
      },
      failureNotifications: {
        read: {
          key: "GComponentPostgresDataTable.Settings.ReadFailure",
          message: "The saved table settings could not be loaded.",
          deduplicated: true,
        },
        write: {
          key: "GComponentPostgresDataTable.Settings.WriteFailure",
          message: "The table settings could not be saved.",
          deduplicated: true,
        },
        aStorageFailurePreventsRendering: false,
      },
    },
  },
  trust: {
    authoritative: false,
    usableByRlsPolicies: false,
    writtenToAServer: false,
    note: "browser-controlled cached state and preferences",
  },
} as const;
