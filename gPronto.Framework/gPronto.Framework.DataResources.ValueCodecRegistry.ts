import type { GProntoFrameworkValueCodecCatalog } from "./gPronto.Framework.DataResources.ValueCodecContract";

export const gProntoFrameworkValueCodecCatalog = Object.freeze({
  "boolean.standard": Object.freeze({
    decodeError: Object.freeze({
      code: "boolean.standard.decode",
      message: "The database value is not a boolean.",
    }),
    encodeError: Object.freeze({
      code: "boolean.standard.encode",
      message: "Enter a boolean value.",
    }),
  }),
  "number.standard": Object.freeze({
    decodeError: Object.freeze({
      code: "number.standard.decode",
      message: "The database value is not a finite number.",
    }),
    encodeError: Object.freeze({
      code: "number.standard.encode",
      message: "Enter a finite number.",
    }),
  }),
  "string.standard": Object.freeze({
    decodeError: Object.freeze({
      code: "string.standard.decode",
      message: "The database value is not text.",
    }),
    encodeError: Object.freeze({
      code: "string.standard.encode",
      message: "Enter text.",
    }),
  }),
  "text.array.comma": Object.freeze({
    decodeError: Object.freeze({
      code: "text.array.comma.decode",
      message: "The database value is not a text array.",
    }),
    encodeError: Object.freeze({
      code: "text.array.comma.encode",
      message: "Enter a comma-separated list.",
    }),
  }),
  "jsonb.standard": Object.freeze({
    decodeError: Object.freeze({
      code: "jsonb.standard.decode",
      message: "The database JSON value could not be displayed.",
    }),
    encodeError: Object.freeze({
      code: "jsonb.standard.encode",
      message: "Enter valid JSON.",
    }),
  }),
  "timestamp.local": Object.freeze({
    decodeError: Object.freeze({
      code: "timestamp.local.decode",
      message: "The database date and time is invalid.",
    }),
    encodeError: Object.freeze({
      code: "timestamp.local.encode",
      message: "Enter a valid date and time.",
    }),
  }),
} as const) satisfies GProntoFrameworkValueCodecCatalog;
