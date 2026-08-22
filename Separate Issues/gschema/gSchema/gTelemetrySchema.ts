export const gTelemetrySchema = {
  gSchemaVersion: 1,
  gSchemaName: "gTelemetrySchema",
  title: "Telemetry",
  description:
    "The three telemetry records: what each row holds, the conditions under which it is written, and how each runtime is started and stopped.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gTelemetrySchema",
    runtimeLocation: null,
    consumers: [
      "the browser-error telemetry runtime",
      "the User-event telemetry runtime",
      "the User-session heartbeat runtime",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksTelemetryStartup: true,
      currentRuntimesRemainAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedEventRowsConditionsAndIntervalsAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before a telemetry runtime registers listeners",
    },
  },
  publicLocation: null,
  publicLocationIsNullBecause: "every telemetry runtime is internal",
  uuidPattern:
    "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
  uuidMatchingIsCaseInsensitive: true,
  records: {
    browserError: {
      table: "logs",
      listeners: ["error", "unhandledrejection"],
      otherListeners: false,
      writtenWhen: [
        "the authentication status is SignedIn",
        "auth_user_id is a valid UUID",
      ],
      skippedWriteIsReported: true,
      row: {
        log_category: "-",
        level: "-",
        source: "-",
        auth_user_id: "the signed-in Auth user id",
        actor_user_id:
          "the public user id when it is a valid UUID, otherwise null",
        message: "the error message, or the fallback",
        error_code: "the error name, or -",
        event: "error or unhandledrejection",
        metadata: {
          route: "the current pathname",
          stack: "the error stack, or null",
        },
      },
      errorDescription: {
        fromAnError: { message: "its message, or the fallback when empty", name: "its name", stack: "its stack, or null" },
        fromANonEmptyString: { message: "the string", name: "-", stack: null },
        fromAnythingElse: { message: "the fallback", name: "-", stack: null },
      },
      fallbacks: {
        error: "An unhandled error occurred.",
        unhandledrejection: "An unhandled promise rejection occurred.",
      },
      failedWriteIncrementsACounter: true,
      failedWriteIsReported: true,
    },
    userEvent: {
      table: "user_events",
      eventTypes: ["page_visit", "button_click"],
      writtenWhen: [
        "the runtime is active",
        "the authentication status is SignedIn",
        "actor_user_id is a valid UUID",
        "session_id is a valid UUID",
      ],
      pageVisit: {
        input: ["key", "page_id", "route", "session_id", "actor_user_id"],
        row: ["event_type", "page_id", "route", "session_id", "actor_user_id"],
        keyIsUsedForDeduplicationOnly: true,
        keyIsWrittenToTheRow: false,
        twoConsecutiveVisitsWithTheSameKeyProduceOneRow: true,
        remembersTheKeyAndThePageId: true,
      },
      buttonClick: {
        input: ["route", "session_id", "actor_user_id", "metadata.text"],
        row: [
          "event_type",
          "page_id",
          "route",
          "session_id",
          "actor_user_id",
          "metadata",
        ],
        pageId: "the most recently recorded page id, otherwise null",
      },
      failedWriteIncrementsACounter: true,
      failedWriteIsReported: true,
      stoppingClearsTheRememberedPageVisit: true,
    },
    heartbeat: {
      table: "user_sessions",
      activityListeners: ["pointerdown", "keydown", "scroll", "touchstart"],
      listenersArePassive: true,
      intervalMilliseconds: 30000,
      writtenWhen: [
        "the runtime is active",
        "activity has occurred since the last successful heartbeat",
        "no request is in flight",
        "the authentication status is SignedIn",
        "user_id is a valid UUID",
        "session_id is a valid UUID",
      ],
      operation: "upsert",
      onConflict: "user_id,session_id",
      row: {
        user_id: "the public user id",
        session_id: "the public session id",
        last_seen_at: "the current ISO timestamp",
        is_visible: "whether the document visibility state is visible",
        is_deleted: false,
      },
      onFailure: {
        pendingActivityIsPreserved: true,
        retriedOnTheNextQualifyingInterval: true,
        reported: false,
        countsFailures: false,
      },
      onSuccess: {
        pendingActivityIsClearedOnlyWhenNoNewerActivityOccurred: true,
      },
    },
  },
  runtimeLifetime: {
    activeClientsPerRuntime: 1,
    startingWithTheSameClientAddsAConsumer: true,
    startingWithADifferentClientThrows: true,
    stopsAfterTheLastConsumerStops: true,
    errors: {
      logs: "A different logs runtime is already active.",
      userEvents: "A different user event runtime is already active.",
      heartbeat: "A different heartbeat runtime is already active.",
    },
  },
} as const;
