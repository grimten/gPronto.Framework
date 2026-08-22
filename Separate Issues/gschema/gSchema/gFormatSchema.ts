export const gFormatSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gFormatSchema",
  title: "Format",
  description:
    "The complete immutable format catalog and the behavior used to turn supported runtime values into display strings.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gFormatSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.Formats",
    consumers: [
      "the public format catalog factory",
      "GProntoFrameworkApplicationRootComponent.Format",
      "the PostgreSQL data-contract checker",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksFormatCatalogCreation: true,
      currentCatalogRemainsAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedFormatKeysDefaultsAndDispatchTablesAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the format catalog is exposed",
    },
  },
  catalog: {
    immutable: true,
    everyNodeHasExactlyOneDefault: true,
    everyDefaultMustBeAnOptionKeyInTheSameNode: true,
    datatypeResolution:
      "remove a trailing parenthesized precision from the PostgreSQL datatype",
  },
  formatter: {
    location: "GProntoFrameworkApplicationRootComponent.Format",
    arguments: ["value", "format"],
    resultDatatype: "string | undefined",
    recognizedKeyAndNullOrUndefined: "",
    unrecognizedKey: "undefined",
    incompatibleValue: "undefined",
    throws: false,
  },
  nodes: {
    uuid: {
      default: "uuid.as_is",
      options: {
        "uuid.as_is": { result: "the unchanged string" },
        "uuid.short": { result: "the first eight string characters" },
        "uuid.no_dashes": { result: "the string with every hyphen removed" },
      },
      acceptedRuntimeValues: ["string"],
      validatesUuidContents: false,
    },
    "timestamp with time zone": {
      default: "timestamp with time zone.short",
      options: {
        "timestamp with time zone.short": { resultShape: "yyyy-mm-dd hh:mm" },
        "timestamp with time zone.long": {
          resultShape: "yyyy-mm-dd hh:mm:ss",
        },
        "timestamp with time zone.date": { resultShape: "yyyy-mm-dd" },
        "timestamp with time zone.time": { resultShape: "hh:mm" },
      },
      acceptedRuntimeValues: ["valid Date", "parseable date string"],
      timezone: "browser local time",
    },
    date: {
      default: "date.short",
      options: {
        "date.short": { resultShape: "yyyy-mm-dd" },
        "date.long": {
          resultShape: "dddd, d mmmm yyyy",
          language: "English",
        },
      },
      acceptedRuntimeValues: ["valid Date", "real yyyy-mm-dd string"],
      stringParsingTimezone: "calendar date without timezone conversion",
    },
    boolean: {
      default: "boolean.yes_no",
      options: {
        "boolean.yes_no": { false: "No", true: "Yes" },
        "boolean.true_false": { false: "False", true: "True" },
      },
      acceptedRuntimeValues: ["boolean"],
    },
    integer: {
      default: "integer.thousands",
      options: {
        "integer.plain": { example: "1234" },
        "integer.thousands": { example: "1,234" },
        "integer.european": { example: "1.234" },
      },
      acceptedRuntimeValues: ["finite integer number"],
    },
    numeric: {
      default: "numeric.thousands",
      options: {
        "numeric.plain": { example: "1234.56" },
        "numeric.thousands": { example: "1,234.56" },
        "numeric.european": { example: "1.234,56" },
        "numeric.decimals_0": { example: "1,235" },
        "numeric.decimals_1": { example: "1,234.6" },
        "numeric.decimals_2": { example: "1,234.56" },
        "numeric.decimals_3": { example: "1,234.560" },
        "numeric.european_decimals_0": { example: "1.235" },
        "numeric.european_decimals_1": { example: "1.234,6" },
        "numeric.european_decimals_2": { example: "1.234,56" },
        "numeric.european_decimals_3": { example: "1.234,560" },
        "numeric.percent": {
          example: "1234.56 %",
          multipliesByOneHundred: false,
        },
      },
      acceptedRuntimeValues: ["finite number"],
    },
    text: {
      default: "text.as_is",
      options: {
        "text.as_is": { result: "the unchanged string" },
        "text.truncated_10": { maximumCharacters: 10, marker: "…" },
        "text.truncated_20": { maximumCharacters: 20, marker: "…" },
        "text.truncated_50": { maximumCharacters: 50, marker: "…" },
        "text.truncated_100": { maximumCharacters: 100, marker: "…" },
        "text.email_link": { result: "the unchanged string" },
        "text.url_link": { result: "the unchanged string" },
      },
      acceptedRuntimeValues: ["string"],
      truncationUnit: "Unicode code point",
      linkFormatsReturnElements: false,
    },
    "extensions.citext": {
      default: "extensions.citext.as_is",
      options: {
        "extensions.citext.as_is": { result: "the unchanged string" },
        "extensions.citext.truncated_10": {
          maximumCharacters: 10,
          marker: "…",
        },
        "extensions.citext.truncated_20": {
          maximumCharacters: 20,
          marker: "…",
        },
        "extensions.citext.truncated_50": {
          maximumCharacters: 50,
          marker: "…",
        },
        "extensions.citext.truncated_100": {
          maximumCharacters: 100,
          marker: "…",
        },
        "extensions.citext.email_link": { result: "the unchanged string" },
        "extensions.citext.url_link": { result: "the unchanged string" },
      },
      acceptedRuntimeValues: ["string"],
      truncationUnit: "Unicode code point",
      linkFormatsReturnElements: false,
    },
    jsonb: {
      default: "jsonb.pretty",
      options: {
        "jsonb.pretty": { serialization: "JSON.stringify(value, undefined, 2)" },
        "jsonb.compact": { serialization: "JSON.stringify(value)" },
      },
      undefinedOrThrownSerializationReturns: "undefined",
    },
    "text[]": {
      default: "text[].comma",
      options: {
        "text[].comma": { separator: ", " },
        "text[].lines": { separator: "\n" },
      },
      acceptedRuntimeValues: ["array containing only strings"],
    },
  },
} as const;
