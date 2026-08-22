export const gValidationSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gValidationSchema",
  title: "Validation",
  description:
    "The complete immutable validator catalog: exact keys, option shapes, error codes, default messages, and validation-result behavior.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gValidationSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.Validators",
    consumers: [
      "the validator catalog factory",
      "GProntoFrameworkApplicationRootComponent.Validate",
      "the PostgreSQL data-contract checker",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksValidatorCatalogCreation: true,
      currentCatalogRemainsAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedValidatorKeysOptionsCodesAndMessagesAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the validator catalog is exposed",
    },
  },
  catalogLocation: "GProntoFrameworkApplicationRootComponent.Validators",
  appliedThrough: "GProntoFrameworkApplicationRootComponent.Validate",
  immutable: true,
  descriptor: {
    exactOwnKeys: ["validator", "options"],
    fields: {
      validator: {
        datatype: "validatorKey",
        required: true,
        nullable: false,
      },
      options: {
        datatype: "object",
        required: true,
        nullable: true,
      },
    },
    alsoHeldIn:
      "the validation.validators array of a gPostgresDataContract column",
  },
  result: {
    valid: { valid: true, errors: [] },
    invalidErrorFields: ["validator", "code", "message"],
    codeAlwaysEqualsValidatorKey: true,
    throwsForAnInvalidRuntimeValue: false,
    invalidDescriptorThrows: "TypeError",
  },
  messagePlaceholderForm: "{optionName}",
  validators: {
    "value.required": {
      options: null,
      code: "value.required",
      defaultMessage: "A value is required.",
    },
    "string.minimum_length": {
      options: {
        length: { datatype: "number", required: true, nullable: false },
      },
      code: "string.minimum_length",
      defaultMessage: "Enter at least {length} characters.",
    },
    "string.maximum_length": {
      options: {
        length: { datatype: "number", required: true, nullable: false },
      },
      code: "string.maximum_length",
      defaultMessage: "Enter no more than {length} characters.",
    },
    "string.pattern": {
      options: {
        pattern: { datatype: "string", required: true, nullable: false },
      },
      code: "string.pattern",
      defaultMessage: "Enter a value in the required format.",
    },
    "enum.allowed": {
      options: {
        values: {
          datatype: "readonly (string | number | boolean)[]",
          required: true,
          nullable: false,
        },
      },
      code: "enum.allowed",
      defaultMessage: "Select an allowed value.",
    },
    "number.minimum": {
      options: {
        value: { datatype: "number", required: true, nullable: false },
      },
      code: "number.minimum",
      defaultMessage: "Enter a value greater than or equal to {value}.",
    },
    "number.maximum": {
      options: {
        value: { datatype: "number", required: true, nullable: false },
      },
      code: "number.maximum",
      defaultMessage: "Enter a value less than or equal to {value}.",
    },
    "number.integer": {
      options: null,
      code: "number.integer",
      defaultMessage: "Enter a whole number.",
    },
    "number.precision_scale": {
      options: {
        precision: { datatype: "number", required: true, nullable: false },
        scale: { datatype: "number", required: true, nullable: false },
      },
      code: "number.precision_scale",
      defaultMessage:
        "Enter a number with at most {precision} digits and {scale} decimal places.",
    },
    "array.minimum_length": {
      options: {
        length: { datatype: "number", required: true, nullable: false },
      },
      code: "array.minimum_length",
      defaultMessage: "Select at least {length} values.",
    },
    "array.maximum_length": {
      options: {
        length: { datatype: "number", required: true, nullable: false },
      },
      code: "array.maximum_length",
      defaultMessage: "Select no more than {length} values.",
    },
    "uuid.standard": {
      options: null,
      code: "uuid.standard",
      defaultMessage: "Enter a valid UUID.",
    },
    "json.standard": {
      options: null,
      code: "json.standard",
      defaultMessage: "Enter valid JSON.",
    },
    "email.standard": {
      options: null,
      code: "email.standard",
      defaultMessage: "Enter a valid email address.",
    },
    "email.domain": {
      options: {
        domains: {
          datatype: "readonly string[]",
          required: true,
          nullable: false,
        },
      },
      code: "email.domain",
      defaultMessage: "Enter an email address from an allowed domain.",
    },
    "url.standard": {
      options: null,
      code: "url.standard",
      defaultMessage: "Enter a valid HTTP or HTTPS URL.",
    },
    "url.https": {
      options: null,
      code: "url.https",
      defaultMessage: "Enter a secure HTTPS URL.",
    },
    "url.domain": {
      options: {
        domains: {
          datatype: "readonly string[]",
          required: true,
          nullable: false,
        },
      },
      code: "url.domain",
      defaultMessage: "Enter a URL from an allowed domain.",
    },
    "telephone.e164": {
      options: null,
      code: "telephone.e164",
      defaultMessage: "Enter a valid international telephone number.",
    },
    "telephone.country": {
      options: {
        countryCallingCodes: {
          datatype: "readonly string[]",
          required: true,
          nullable: false,
        },
      },
      code: "telephone.country",
      defaultMessage:
        "Enter a telephone number from an allowed country calling code.",
    },
    "date.standard": {
      options: null,
      code: "date.standard",
      defaultMessage: "Enter a valid date.",
    },
    "date.past": {
      options: null,
      code: "date.past",
      defaultMessage: "Enter a date before today.",
    },
    "date.future": {
      options: null,
      code: "date.future",
      defaultMessage: "Enter a date after today.",
    },
    "datetime.standard": {
      options: null,
      code: "datetime.standard",
      defaultMessage: "Enter a valid date and time.",
    },
    "file.type": {
      options: {
        mimeTypes: {
          datatype: "readonly string[]",
          required: true,
          nullable: false,
        },
      },
      code: "file.type",
      defaultMessage: "Select a file with an allowed type.",
    },
    "file.size": {
      options: {
        maximumBytes: {
          datatype: "number",
          required: true,
          nullable: false,
        },
      },
      code: "file.size",
      defaultMessage: "Select a file no larger than {maximumBytes} bytes.",
    },
    "password.standard": {
      options: null,
      code: "password.standard",
      defaultMessage: "Enter a password containing at least 8 characters.",
    },
  },
} as const;
