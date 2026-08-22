export const gValueCodecSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gValueCodecSchema",
  title: "Value codec",
  description:
    "The complete immutable value-codec catalog: exact keys, option shapes, accepted values, conversions, and failure results.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gValueCodecSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.Codecs",
    consumers: [
      "the value-codec catalog factory",
      "GProntoFrameworkApplicationRootComponent.Decode",
      "GProntoFrameworkApplicationRootComponent.Encode",
      "schema-driven form controls",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksCodecCatalogCreation: true,
      currentCatalogRemainsAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedCodecKeysOptionsConversionsAndMessagesAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the codec catalog is exposed",
    },
  },
  catalogLocation: "GProntoFrameworkApplicationRootComponent.Codecs",
  appliedThrough: [
    "GProntoFrameworkApplicationRootComponent.Decode",
    "GProntoFrameworkApplicationRootComponent.Encode",
  ],
  immutable: true,
  descriptor: {
    exactOwnKeys: ["codec", "options"],
    fields: {
      codec: {
        datatype: "valueCodecKey",
        required: true,
        nullable: false,
      },
      options: {
        datatype: "object",
        required: true,
        nullable: false,
      },
    },
  },
  result: {
    successFields: ["success", "value"],
    failureFields: ["success", "error"],
    errorFields: ["codec", "direction", "code", "message"],
    directions: ["decode", "encode"],
    errorCode: "<codec>.<direction>",
    throwsForConversionFailure: false,
    invalidDescriptorThrows: "TypeError",
  },
  sharedOptions: {
    allowNull: {
      datatype: "boolean",
      required: true,
      nullable: false,
    },
  },
  codecs: {
    "boolean.standard": {
      options: ["allowNull"],
      decode: "accept a boolean; nullish input becomes false when allowed",
      encode: "accept a boolean",
      decodeError: {
        code: "boolean.standard.decode",
        message: "The database value is not a boolean.",
      },
      encodeError: {
        code: "boolean.standard.encode",
        message: "Enter a boolean value.",
      },
    },
    "number.standard": {
      options: ["allowNull"],
      decode:
        "accept a finite number or a non-empty string that converts to a finite number; nullish input becomes null when allowed",
      encode: "accept a finite number; accept null only when allowed",
      decodeError: {
        code: "number.standard.decode",
        message: "The database value is not a finite number.",
      },
      encodeError: {
        code: "number.standard.encode",
        message: "Enter a finite number.",
      },
    },
    "string.standard": {
      options: ["allowNull"],
      decode: "accept a string; nullish input becomes an empty string when allowed",
      encode: "accept a string; an empty string becomes null when allowed",
      decodeError: {
        code: "string.standard.decode",
        message: "The database value is not text.",
      },
      encodeError: {
        code: "string.standard.encode",
        message: "Enter text.",
      },
    },
    "text.array.comma": {
      options: ["allowNull"],
      decode:
        "accept an array containing only strings and join it with comma-space; nullish input becomes an empty string when allowed",
      encode:
        "accept a string, split on commas, trim each item, and encode an empty string as null when allowed or an empty array otherwise",
      decodeError: {
        code: "text.array.comma.decode",
        message: "The database value is not a text array.",
      },
      encodeError: {
        code: "text.array.comma.encode",
        message: "Enter a comma-separated list.",
      },
    },
    "jsonb.standard": {
      options: ["allowNull"],
      decode:
        "accept a finite JSON-compatible value and pretty-print it with two spaces",
      encode:
        "parse a JSON string and accept only finite JSON-compatible values; an empty string becomes null when allowed",
      decodeError: {
        code: "jsonb.standard.decode",
        message: "The database JSON value could not be displayed.",
      },
      encodeError: {
        code: "jsonb.standard.encode",
        message: "Enter valid JSON.",
      },
    },
    "timestamp.local": {
      options: ["allowNull"],
      decode:
        "accept a valid Date or parseable date string and produce a browser-local datetime-local string",
      encode:
        "accept a valid datetime-local string and produce an ISO timestamp; an empty string becomes null when allowed",
      decodeError: {
        code: "timestamp.local.decode",
        message: "The database date and time is invalid.",
      },
      encodeError: {
        code: "timestamp.local.encode",
        message: "Enter a valid date and time.",
      },
    },
  },
} as const;
