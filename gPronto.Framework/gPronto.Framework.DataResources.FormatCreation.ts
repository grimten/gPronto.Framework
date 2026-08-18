import { gProntoFrameworkTypeFormatDefaults } from "./gPronto.Framework.DataResources.TypeFormatDefaults";

const gProntoFrameworkEnglishDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const gProntoFrameworkEnglishMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type GProntoFrameworkDateParts = Readonly<{
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
}>;

function isGProntoFrameworkFormatRecognized(format: string): boolean {
  return Object.values(gProntoFrameworkTypeFormatDefaults).some((node) =>
    Object.hasOwn(node.options, format),
  );
}

function padGProntoFrameworkDatePart(value: number, width: number): string {
  return String(value).padStart(width, "0");
}

function resolveGProntoFrameworkTimestamp(value: unknown): Date | undefined {
  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : typeof value === "string"
        ? new Date(value)
        : undefined;

  if (date === undefined || Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function formatGProntoFrameworkTimestampDate(date: Date): string {
  return [
    padGProntoFrameworkDatePart(date.getFullYear(), 4),
    padGProntoFrameworkDatePart(date.getMonth() + 1, 2),
    padGProntoFrameworkDatePart(date.getDate(), 2),
  ].join("-");
}

function formatGProntoFrameworkTimestampTime(
  date: Date,
  includeSeconds: boolean,
): string {
  const parts = [
    padGProntoFrameworkDatePart(date.getHours(), 2),
    padGProntoFrameworkDatePart(date.getMinutes(), 2),
  ];

  if (includeSeconds) {
    parts.push(padGProntoFrameworkDatePart(date.getSeconds(), 2));
  }

  return parts.join(":");
}

function resolveGProntoFrameworkDateParts(
  value: unknown,
): GProntoFrameworkDateParts | undefined {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return undefined;
    }

    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
      dayOfWeek: value.getDay(),
    };
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (match === null) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const validationDate = new Date(0);
  validationDate.setUTCHours(0, 0, 0, 0);
  validationDate.setUTCFullYear(year, month - 1, day);

  if (
    validationDate.getUTCFullYear() !== year ||
    validationDate.getUTCMonth() + 1 !== month ||
    validationDate.getUTCDate() !== day
  ) {
    return undefined;
  }

  return { year, month, day, dayOfWeek: validationDate.getUTCDay() };
}

function formatGProntoFrameworkDateParts(
  parts: GProntoFrameworkDateParts,
): string {
  return [
    padGProntoFrameworkDatePart(parts.year, 4),
    padGProntoFrameworkDatePart(parts.month, 2),
    padGProntoFrameworkDatePart(parts.day, 2),
  ].join("-");
}

function convertGProntoFrameworkNumberToPlainString(value: number): string {
  const numberText = String(value);
  const exponentialMatch = /^(-?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/.exec(
    numberText,
  );

  if (exponentialMatch === null) {
    return numberText;
  }

  const sign = exponentialMatch[1];
  const integerDigits = exponentialMatch[2];
  const fractionDigits = exponentialMatch[3] ?? "";
  const exponent = Number(exponentialMatch[4]);
  const digits = integerDigits + fractionDigits;
  const decimalIndex = integerDigits.length + exponent;

  if (decimalIndex <= 0) {
    return `${sign}0.${"0".repeat(-decimalIndex)}${digits}`;
  }

  if (decimalIndex >= digits.length) {
    return `${sign}${digits}${"0".repeat(decimalIndex - digits.length)}`;
  }

  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

function formatGProntoFrameworkGroupedNumber(
  value: number,
  groupingSeparator: string,
  decimalSeparator: string,
): string {
  const plainValue = convertGProntoFrameworkNumberToPlainString(value);
  const sign = plainValue.startsWith("-") ? "-" : "";
  const unsignedValue = sign.length === 0 ? plainValue : plainValue.slice(1);
  const [integerDigits, fractionDigits] = unsignedValue.split(".");
  const groupedIntegerDigits = integerDigits.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    groupingSeparator,
  );

  return fractionDigits === undefined
    ? `${sign}${groupedIntegerDigits}`
    : `${sign}${groupedIntegerDigits}${decimalSeparator}${fractionDigits}`;
}

function formatGProntoFrameworkFixedNumber(
  value: number,
  decimalDigits: number,
  european: boolean,
): string {
  return new Intl.NumberFormat(european ? "de-DE" : "en-US", {
    useGrouping: true,
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  }).format(value);
}

function truncateGProntoFrameworkText(value: string, length: number): string {
  const characters = Array.from(value);

  return characters.length <= length
    ? value
    : `${characters.slice(0, length).join("")}…`;
}

export function formatGProntoFrameworkValue(
  value: unknown,
  format: string,
): string | undefined {
  if (!isGProntoFrameworkFormatRecognized(format)) {
    return undefined;
  }

  if (value === null || value === undefined) {
    return "";
  }

  switch (format) {
    case "uuid.as_is":
      return typeof value === "string" ? value : undefined;
    case "uuid.short":
      return typeof value === "string" ? value.slice(0, 8) : undefined;
    case "uuid.no_dashes":
      return typeof value === "string" ? value.replaceAll("-", "") : undefined;
    case "timestamp with time zone.short":
    case "timestamp with time zone.long":
    case "timestamp with time zone.date":
    case "timestamp with time zone.time": {
      const date = resolveGProntoFrameworkTimestamp(value);

      if (date === undefined) {
        return undefined;
      }

      if (format === "timestamp with time zone.date") {
        return formatGProntoFrameworkTimestampDate(date);
      }

      if (format === "timestamp with time zone.time") {
        return formatGProntoFrameworkTimestampTime(date, false);
      }

      return `${formatGProntoFrameworkTimestampDate(date)} ${formatGProntoFrameworkTimestampTime(
        date,
        format === "timestamp with time zone.long",
      )}`;
    }
    case "date.short":
    case "date.long": {
      const dateParts = resolveGProntoFrameworkDateParts(value);

      if (dateParts === undefined) {
        return undefined;
      }

      if (format === "date.short") {
        return formatGProntoFrameworkDateParts(dateParts);
      }

      return `${gProntoFrameworkEnglishDayNames[dateParts.dayOfWeek]}, ${dateParts.day} ${gProntoFrameworkEnglishMonthNames[dateParts.month - 1]} ${padGProntoFrameworkDatePart(dateParts.year, 4)}`;
    }
    case "boolean.yes_no":
      return typeof value === "boolean" ? (value ? "Yes" : "No") : undefined;
    case "boolean.true_false":
      return typeof value === "boolean"
        ? value
          ? "True"
          : "False"
        : undefined;
    case "integer.plain":
    case "integer.thousands":
    case "integer.european": {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        !Number.isInteger(value)
      ) {
        return undefined;
      }

      if (format === "integer.plain") {
        return convertGProntoFrameworkNumberToPlainString(value);
      }

      return formatGProntoFrameworkGroupedNumber(
        value,
        format === "integer.european" ? "." : ",",
        format === "integer.european" ? "," : ".",
      );
    }
    case "numeric.plain":
    case "numeric.thousands":
    case "numeric.european":
    case "numeric.percent": {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return undefined;
      }

      if (format === "numeric.plain") {
        return convertGProntoFrameworkNumberToPlainString(value);
      }

      if (format === "numeric.percent") {
        return `${convertGProntoFrameworkNumberToPlainString(value)} %`;
      }

      return formatGProntoFrameworkGroupedNumber(
        value,
        format === "numeric.european" ? "." : ",",
        format === "numeric.european" ? "," : ".",
      );
    }
    case "numeric.decimals_0":
    case "numeric.decimals_1":
    case "numeric.decimals_2":
    case "numeric.decimals_3":
    case "numeric.european_decimals_0":
    case "numeric.european_decimals_1":
    case "numeric.european_decimals_2":
    case "numeric.european_decimals_3": {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return undefined;
      }

      return formatGProntoFrameworkFixedNumber(
        value,
        Number(format.slice(-1)),
        format.startsWith("numeric.european_"),
      );
    }
    case "text.as_is":
    case "text.email_link":
    case "text.url_link":
    case "extensions.citext.as_is":
    case "extensions.citext.email_link":
    case "extensions.citext.url_link":
      return typeof value === "string" ? value : undefined;
    case "text.truncated_10":
    case "extensions.citext.truncated_10":
      return typeof value === "string"
        ? truncateGProntoFrameworkText(value, 10)
        : undefined;
    case "text.truncated_20":
    case "extensions.citext.truncated_20":
      return typeof value === "string"
        ? truncateGProntoFrameworkText(value, 20)
        : undefined;
    case "text.truncated_50":
    case "extensions.citext.truncated_50":
      return typeof value === "string"
        ? truncateGProntoFrameworkText(value, 50)
        : undefined;
    case "text.truncated_100":
    case "extensions.citext.truncated_100":
      return typeof value === "string"
        ? truncateGProntoFrameworkText(value, 100)
        : undefined;
    case "jsonb.pretty":
    case "jsonb.compact":
      try {
        return JSON.stringify(
          value,
          undefined,
          format === "jsonb.pretty" ? 2 : undefined,
        );
      } catch {
        return undefined;
      }
    case "text[].comma":
    case "text[].lines":
      return Array.isArray(value) &&
        value.every((item): item is string => typeof item === "string")
        ? value.join(format === "text[].comma" ? ", " : "\n")
        : undefined;
    default:
      return undefined;
  }
}
