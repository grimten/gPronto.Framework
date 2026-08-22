export const gSessionSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gSessionSchema",
  title: "Session",
  description:
    "The complete public Session object: its field, datatype, default, readonly behavior, hydration source, reset behavior, persistence, and trust boundary.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gSessionSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.Session",
    consumers: [
      "the public-properties default factory",
      "the public Session interface factory",
      "the public-properties storage codec",
      "the authentication hydration mapper",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksConsumerStartup: true,
      currentRuntimeRemainsAuthoritativeUntilAdopted: true,
      adoptionIsAtomicPerSchema: true,
      schemaWinsAfterAdoption: true,
      duplicatedRuntimeDefinitionsAreRemovedAfterAdoption: true,
      unsupportedVersion: "throw before a Session value is created or hydrated",
    },
  },
  object: {
    alwaysPresent: true,
    nullable: false,
    extensible: false,
    facadePropertyDescriptor: {
      writable: false,
      configurable: false,
      enumerable: true,
    },
  },
  fieldOrder: ["SessionId"],
  fields: {
    SessionId: {
      datatype: "string",
      required: true,
      nullable: false,
      default: "-",
      writable: false,
      hydratedFrom: "hydration.session.session_id",
    },
  },
  assignmentFromTheApplication: false,
  reset: {
    value: "-",
    when: [
      "the signed-in user changes",
      "hydration fails",
      "authentication clears the public state",
    ],
  },
  preservation: {
    identityOnlyAuthenticationUpdate: true,
    UserOrOrganisationAssignment: true,
  },
  replacement: {
    performedBy: "the authentication runtime",
    validatesEveryFieldAsAString: true,
    writesBeforePublishing: true,
    publishesOneSnapshot: true,
  },
  trust: {
    source: "browser-controlled cached state",
    authoritativeForAuthorization: false,
    provesASession: false,
    usableByRlsPolicies: false,
  },
} as const;
