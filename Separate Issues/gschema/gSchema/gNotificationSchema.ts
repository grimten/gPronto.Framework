export const gNotificationSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gNotificationSchema",
  title: "Notification",
  description:
    "A notification request, the record it becomes, how records are deduplicated, and the lifecycle a record goes through.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gNotificationSchema",
    runtimeLocation: null,
    consumers: [
      "GProntoFrameworkApplicationRootComponent.Notify",
      "the notification store",
      "the notification host",
      "the Refine notification provider",
      "the framework error reporter",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksNotificationRuntimeStartup: true,
      currentRuntimeRemainsAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedNotificationTypesAndDefaultsAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the notification runtime starts",
    },
  },
  appliedThrough: "GProntoFrameworkApplicationRootComponent.Notify",
  request: {
    exactOwnKeys: ["type", "message", "title", "deduplicationKey"],
    fields: {
      type: {
        datatype: "notificationType",
        required: true,
        nullable: false,
      },
      message: { datatype: "string", required: true, nullable: false },
      title: { datatype: "string", required: false, nullable: false },
      deduplicationKey: {
        datatype: "string",
        required: false,
        nullable: false,
      },
    },
  },
  requestRules: {
    emptyMessageIsDropped: true,
    blankTitleIsTreatedAsAbsent: true,
    blankDeduplicationKeyIsTreatedAsAbsent: true,
    messageAndTitleAreNotTrimmedBeforeStorage: true,
  },
  creationPaths: {
    direct: {
      entryPoint: "Notify",
      buildsTheRequest: "the caller",
      defaultDeduplicationKey:
        "JSON.stringify([\"direct\", type, trimmed title, trimmed message])",
    },
    error: {
      entryPoint: "reportGProntoFrameworkError(error, contextMessage)",
      buildsTheRequest: "the framework",
      type: "error",
      title: "the context message, which must be non-empty",
      message: "the error message, falling back to the context message",
      defaultDeduplicationKey:
        "JSON.stringify([\"error\", contextMessage, message])",
      reusesTheKeyOfTheSameErrorObjectWhileItIsStillShowing: true,
      alsoWritesToTheBrowserConsole: true,
    },
    refine: {
      entryPoint: "the notification provider given to Refine",
      buildsTheRequest: "Refine",
      typeMapping: { progress: "info" },
      descriptionBecomes: "title",
      deduplicationKey: "the Refine key, when one is supplied",
      extraValues: [
        "key",
        "progress",
        "cancelMutation",
        "undoableTimeoutSeconds",
      ],
    },
  },
  record: {
    exactOwnKeys: [
      "id",
      "type",
      "message",
      "title",
      "deduplicationKey",
      "source",
    ],
    fields: {
      id: {
        datatype: "number",
        required: true,
        nullable: false,
        assignedBy: "the store",
        startsAt: 1,
        increments: 1,
      },
      type: {
        datatype: "notificationType",
        required: true,
        nullable: false,
      },
      message: { datatype: "string", required: true, nullable: false },
      title: { datatype: "string", required: false, nullable: false },
      deduplicationKey: {
        datatype: "string",
        required: false,
        nullable: false,
      },
      source: {
        datatype: "notificationSource",
        required: true,
        nullable: false,
      },
    },
    source: {
      discriminator: "kind",
      kinds: {
        direct: {
          exactOwnKeys: ["kind"],
          fields: {
            kind: {
              datatype: "string",
              required: true,
              nullable: false,
              allowedValues: ["direct"],
            },
          },
        },
        refine: {
          exactOwnKeys: [
            "kind",
            "key",
            "progress",
            "cancelMutation",
            "undoableTimeoutSeconds",
          ],
          fields: {
            kind: {
              datatype: "string",
              required: true,
              nullable: false,
              allowedValues: ["refine"],
            },
            key: { datatype: "string", required: false, nullable: false },
            progress: {
              datatype: "boolean",
              required: true,
              nullable: false,
            },
            cancelMutation: {
              datatype: "() => void",
              required: false,
              nullable: false,
            },
            undoableTimeoutSeconds: {
              datatype: "number",
              required: false,
              nullable: false,
            },
          },
        },
      },
    },
    frozen: true,
    serializable: false,
    notSerializableBecause: "a refine source may hold a cancelMutation function",
  },
  deduplication: {
    direct: {
      whenAnActiveRecordHasTheSameKey: "the new request is dropped",
    },
    refine: {
      whenAnActiveRecordHasTheSameKey:
        "the new request is dropped, unless both the existing and the new record are progress records",
      whenBothAreProgressRecords:
        "the existing record is replaced in place, keeping its id, and its revision increments while it is open",
    },
  },
  entry: {
    exactOwnKeys: ["record", "open", "revision"],
    fields: {
      record: {
        datatype: "notificationRecord",
        required: true,
        nullable: false,
      },
      open: {
        datatype: "boolean",
        required: true,
        nullable: false,
        initial: true,
      },
      revision: {
        datatype: "number",
        required: true,
        nullable: false,
        initial: 0,
      },
    },
  },
  lifecycle: [
    "appended to the queue with open true",
    "closed by the host or by Refine, which sets open false",
    "removed from the queue when its transition completes",
  ],
  presentation: {
    global: true,
    transient: true,
    inlineAlert: false,
    ordinaryAutoHideMilliseconds: 4000,
    progressAutoHideMilliseconds: "undoableTimeoutSeconds multiplied by 1000",
    progressRecordsOfferUndo: true,
  },
  runtime: {
    runtimesPerDocument: 1,
    ownReactRoot: true,
    hostElement: "a div appended to the document body",
    startedBeforeTheApplicationRoot: true,
    survivesABootstrapFailure: true,
    windowListeners: ["error", "unhandledrejection"],
    stylingAppliedAfterItIsResolved: true,
  },
  valueSets: {
    notificationType: ["success", "error", "warning", "info"],
  },
} as const;
