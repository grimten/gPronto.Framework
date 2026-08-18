import type {
  GProntoFrameworkValidationDescriptor,
  GProntoFrameworkValidatorKey,
} from "./gPronto.Framework.DataResources.ValidationContract";

type GProntoFrameworkValidationDescriptorFor<
  Key extends GProntoFrameworkValidatorKey,
> = Extract<GProntoFrameworkValidationDescriptor, { validator: Key }>;

type GProntoFrameworkTypeValidationDefaults = Readonly<{
  [Key in GProntoFrameworkValidatorKey]: (
    value: unknown,
    options: GProntoFrameworkValidationDescriptorFor<Key>["options"],
  ) => boolean;
}>;

type GProntoFrameworkCalendarDate = Readonly<{
  year: number;
  month: number;
  day: number;
}>;

const standardUuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const standardEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const standardTelephonePattern = /^\+[1-9][0-9]{1,14}$/;

function expandScientificNumber(value: number): string {
  const valueText = String(value);
  const match = /^(-?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/.exec(valueText);

  if (match === null) {
    return valueText;
  }

  const sign = match[1];
  const integerDigits = match[2];
  const fractionalDigits = match[3] ?? "";
  const exponent = Number(match[4]);
  const digits = integerDigits + fractionalDigits;
  const decimalIndex = integerDigits.length + exponent;

  if (decimalIndex <= 0) {
    return `${sign}0.${"0".repeat(-decimalIndex)}${digits}`;
  }

  if (decimalIndex >= digits.length) {
    return `${sign}${digits}${"0".repeat(decimalIndex - digits.length)}`;
  }

  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

function countNumberPrecisionAndScale(value: number): Readonly<{
  precision: number;
  scale: number;
}> {
  const expandedValue = expandScientificNumber(value);
  const unsignedValue = expandedValue.startsWith("-")
    ? expandedValue.slice(1)
    : expandedValue;
  const [integerDigits, fractionalDigits = ""] = unsignedValue.split(".");
  const normalizedIntegerDigits = integerDigits.replace(/^0+(?=\d)/, "");

  return {
    precision: normalizedIntegerDigits.length + fractionalDigits.length,
    scale: fractionalDigits.length,
  };
}

function resolveStandardUrl(value: unknown): URL | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

function resolveStandardDate(
  value: unknown,
): GProntoFrameworkCalendarDate | undefined {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) {
      return undefined;
    }

    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
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

  return validationDate.getUTCFullYear() === year &&
    validationDate.getUTCMonth() + 1 === month &&
    validationDate.getUTCDate() === day
    ? { year, month, day }
    : undefined;
}

function compareCalendarDateToToday(value: unknown): -1 | 0 | 1 | undefined {
  const valueDate = resolveStandardDate(value);
  if (valueDate === undefined) {
    return undefined;
  }

  const today = new Date();
  const valueParts = [valueDate.year, valueDate.month, valueDate.day] as const;
  const todayParts = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  ] as const;

  for (let index = 0; index < valueParts.length; index += 1) {
    if (valueParts[index] < todayParts[index]) {
      return -1;
    }

    if (valueParts[index] > todayParts[index]) {
      return 1;
    }
  }

  return 0;
}

function isJsonCompatibleValue(
  value: unknown,
  ancestors: Set<object>,
): boolean {
  if (value === null) {
    return true;
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "object" || ancestors.has(value)) {
    return false;
  }

  ancestors.add(value);

  try {
    if (Array.isArray(value)) {
      const keys = Reflect.ownKeys(value);
      if (keys.length !== value.length + 1) {
        return false;
      }

      for (let index = 0; index < value.length; index += 1) {
        if (
          !Object.hasOwn(value, index) ||
          !isJsonCompatibleValue(value[index], ancestors)
        ) {
          return false;
        }
      }

      return keys.every(
        (key) =>
          key === "length" ||
          (typeof key === "string" &&
            Number.isSafeInteger(Number(key)) &&
            Number(key) >= 0 &&
            Number(key) < value.length &&
            String(Number(key)) === key),
      );
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      return false;
    }

    for (const key of Reflect.ownKeys(value)) {
      if (
        typeof key !== "string" ||
        !isJsonCompatibleValue(
          (value as Record<string, unknown>)[key],
          ancestors,
        )
      ) {
        return false;
      }
    }

    return true;
  } finally {
    ancestors.delete(value);
  }
}

function isBrowserFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function mimeTypeMatches(
  fileMimeType: string,
  allowedMimeType: string,
): boolean {
  const normalizedFileMimeType = fileMimeType.toLowerCase();

  if (!allowedMimeType.endsWith("/*")) {
    return normalizedFileMimeType === allowedMimeType;
  }

  const prefix = allowedMimeType.slice(0, -1);
  return (
    normalizedFileMimeType.startsWith(prefix) &&
    normalizedFileMimeType.length > prefix.length
  );
}

export const gProntoFrameworkTypeValidationDefaults = Object.freeze({
  "value.required": (value) =>
    value !== null &&
    value !== undefined &&
    value !== "" &&
    (!Array.isArray(value) || value.length > 0),
  "string.minimum_length": (value, options) =>
    typeof value === "string" && Array.from(value).length >= options.length,
  "string.maximum_length": (value, options) =>
    typeof value === "string" && Array.from(value).length <= options.length,
  "string.pattern": (value, options) =>
    typeof value === "string" && new RegExp(options.pattern).test(value),
  "enum.allowed": (value, options) =>
    options.values.some((allowedValue) => Object.is(allowedValue, value)),
  "number.minimum": (value, options) =>
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= options.value,
  "number.maximum": (value, options) =>
    typeof value === "number" &&
    Number.isFinite(value) &&
    value <= options.value,
  "number.integer": (value) =>
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value),
  "number.precision_scale": (value, options) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return false;
    }

    const counts = countNumberPrecisionAndScale(value);
    return (
      counts.precision <= options.precision && counts.scale <= options.scale
    );
  },
  "array.minimum_length": (value, options) =>
    Array.isArray(value) && value.length >= options.length,
  "array.maximum_length": (value, options) =>
    Array.isArray(value) && value.length <= options.length,
  "uuid.standard": (value) =>
    typeof value === "string" && standardUuidPattern.test(value),
  "json.standard": (value) => {
    if (typeof value === "string") {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }

    return isJsonCompatibleValue(value, new Set<object>());
  },
  "email.standard": (value) =>
    typeof value === "string" && standardEmailPattern.test(value),
  "email.domain": (value, options) => {
    if (typeof value !== "string" || !standardEmailPattern.test(value)) {
      return false;
    }

    const domain = value.slice(value.lastIndexOf("@") + 1).toLowerCase();
    return options.domains.some(
      (allowedDomain) => allowedDomain.toLowerCase() === domain,
    );
  },
  "url.standard": (value) => resolveStandardUrl(value) !== undefined,
  "url.https": (value) => resolveStandardUrl(value)?.protocol === "https:",
  "url.domain": (value, options) => {
    const url = resolveStandardUrl(value);
    return (
      url !== undefined &&
      options.domains.some(
        (allowedDomain) =>
          allowedDomain.toLowerCase() === url.hostname.toLowerCase(),
      )
    );
  },
  "telephone.e164": (value) =>
    typeof value === "string" && standardTelephonePattern.test(value),
  "telephone.country": (value, options) => {
    if (typeof value !== "string" || !standardTelephonePattern.test(value)) {
      return false;
    }

    return options.countryCallingCodes.some((callingCode) => {
      const suffix = value.slice(callingCode.length);
      return value.startsWith(callingCode) && /^[0-9]+$/.test(suffix);
    });
  },
  "date.standard": (value) => resolveStandardDate(value) !== undefined,
  "date.past": (value) => compareCalendarDateToToday(value) === -1,
  "date.future": (value) => compareCalendarDateToToday(value) === 1,
  "datetime.standard": (value) =>
    value instanceof Date
      ? Number.isFinite(value.getTime())
      : typeof value === "string" && Number.isFinite(Date.parse(value)),
  "file.type": (value, options) =>
    isBrowserFile(value) &&
    options.mimeTypes.some((mimeType) => mimeTypeMatches(value.type, mimeType)),
  "file.size": (value, options) =>
    isBrowserFile(value) && value.size <= options.maximumBytes,
  "password.standard": (value) =>
    typeof value === "string" && Array.from(value).length >= 8,
}) satisfies GProntoFrameworkTypeValidationDefaults;

export function validateGProntoFrameworkTypeDefault(
  value: unknown,
  descriptor: GProntoFrameworkValidationDescriptor,
): boolean {
  if (
    descriptor.validator !== "value.required" &&
    (value === null || value === undefined || value === "")
  ) {
    return true;
  }

  try {
    switch (descriptor.validator) {
      case "value.required":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "string.minimum_length":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "string.maximum_length":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "string.pattern":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "enum.allowed":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "number.minimum":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "number.maximum":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "number.integer":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "number.precision_scale":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "array.minimum_length":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "array.maximum_length":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "uuid.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "json.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "email.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "email.domain":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "url.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "url.https":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "url.domain":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "telephone.e164":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "telephone.country":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "date.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "date.past":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "date.future":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "datetime.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
      case "file.type":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "file.size":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
          descriptor.options,
        );
      case "password.standard":
        return gProntoFrameworkTypeValidationDefaults[descriptor.validator](
          value,
        );
    }
  } catch {
    return false;
  }
}
