export const gProntoFrameworkTypeFormatDefaults = Object.freeze({
  uuid: Object.freeze({
    default: "uuid.as_is",
    options: Object.freeze({
      "uuid.as_is": "123e4567-e89b-12d3-a456-426614174000",
      "uuid.short": "123e4567",
      "uuid.no_dashes": "123e4567e89b12d3a456426614174000",
    }),
  }),
  "timestamp with time zone": Object.freeze({
    default: "timestamp with time zone.short",
    options: Object.freeze({
      "timestamp with time zone.short": "yyyy-mm-dd hh:mm",
      "timestamp with time zone.long": "yyyy-mm-dd hh:mm:ss",
      "timestamp with time zone.date": "yyyy-mm-dd",
      "timestamp with time zone.time": "hh:mm",
    }),
  }),
  date: Object.freeze({
    default: "date.short",
    options: Object.freeze({
      "date.short": "yyyy-mm-dd",
      "date.long": "dddd, d mmmm yyyy",
    }),
  }),
  boolean: Object.freeze({
    default: "boolean.yes_no",
    options: Object.freeze({
      "boolean.yes_no": "Yes/No",
      "boolean.true_false": "True/False",
    }),
  }),
  integer: Object.freeze({
    default: "integer.thousands",
    options: Object.freeze({
      "integer.plain": "1234",
      "integer.thousands": "1,234",
      "integer.european": "1.234",
    }),
  }),
  numeric: Object.freeze({
    default: "numeric.thousands",
    options: Object.freeze({
      "numeric.plain": "1234.56",
      "numeric.thousands": "1,234.56",
      "numeric.european": "1.234,56",
      "numeric.decimals_0": "1,235",
      "numeric.decimals_1": "1,234.6",
      "numeric.decimals_2": "1,234.56",
      "numeric.decimals_3": "1,234.560",
      "numeric.european_decimals_0": "1.235",
      "numeric.european_decimals_1": "1.234,6",
      "numeric.european_decimals_2": "1.234,56",
      "numeric.european_decimals_3": "1.234,560",
      "numeric.percent": "12.34 %",
    }),
  }),
  text: Object.freeze({
    default: "text.as_is",
    options: Object.freeze({
      "text.as_is": "as stored",
      "text.truncated_10": "first 10 characters followed by …",
      "text.truncated_20": "first 20 characters followed by …",
      "text.truncated_50": "first 50 characters followed by …",
      "text.truncated_100": "first 100 characters followed by …",
      "text.email_link": "clickable mailto link",
      "text.url_link": "clickable link",
    }),
  }),
  "extensions.citext": Object.freeze({
    default: "extensions.citext.as_is",
    options: Object.freeze({
      "extensions.citext.as_is": "as stored",
      "extensions.citext.truncated_10": "first 10 characters followed by …",
      "extensions.citext.truncated_20": "first 20 characters followed by …",
      "extensions.citext.truncated_50": "first 50 characters followed by …",
      "extensions.citext.truncated_100": "first 100 characters followed by …",
      "extensions.citext.email_link": "clickable mailto link",
      "extensions.citext.url_link": "clickable link",
    }),
  }),
  jsonb: Object.freeze({
    default: "jsonb.pretty",
    options: Object.freeze({
      "jsonb.pretty": "pretty-printed with two-space indent",
      "jsonb.compact": "single line",
    }),
  }),
  "text[]": Object.freeze({
    default: "text[].comma",
    options: Object.freeze({
      "text[].comma": "a, b, c",
      "text[].lines": "one item per line",
    }),
  }),
});
