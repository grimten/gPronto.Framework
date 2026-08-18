import type {
  GProntoFrameworkValidationDescriptor,
  GProntoFrameworkValidationError,
  GProntoFrameworkValidationResult,
  GProntoFrameworkValidatorKey,
} from "./gPronto.Framework.DataResources.ValidationContract";
import { gProntoFrameworkValidatorCatalog } from "./gPronto.Framework.DataResources.ValidationRegistry";
import { validateGProntoFrameworkTypeDefault } from "./gPronto.Framework.DataResources.TypeValidationDefaults";

const validResult = Object.freeze({
  valid: true as const,
  errors: Object.freeze([]) as readonly [],
});

function isObjectWithExactKeys(
  value: unknown,
  expectedKeys: readonly string[],
): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const keys = Reflect.ownKeys(value);
  return (
    keys.length === expectedKeys.length &&
    keys.every(
      (key) => typeof key === "string" && expectedKeys.includes(key),
    ) &&
    expectedKeys.every((key) => Object.hasOwn(value, key))
  );
}

function isValidatorKey(value: unknown): value is GProntoFrameworkValidatorKey {
  return (
    typeof value === "string" &&
    Object.hasOwn(gProntoFrameworkValidatorCatalog, value)
  );
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function hasObjectIsDuplicate(values: readonly unknown[]): boolean {
  return values.some((value, index) =>
    values.slice(index + 1).some((otherValue) => Object.is(value, otherValue)),
  );
}

function hasExactStringDuplicate(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

function hasCaseInsensitiveDuplicate(values: readonly string[]): boolean {
  return (
    new Set(values.map((value) => value.toLowerCase())).size !== values.length
  );
}

function isDenseArray(value: readonly unknown[]): boolean {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
}

function isValidEnumValues(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    isDenseArray(value) &&
    value.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "boolean" ||
        (typeof item === "number" && Number.isFinite(item)),
    ) &&
    !hasObjectIsDuplicate(value)
  );
}

function isValidDomain(domain: string): boolean {
  return domain.length > 0 && !/[\s:/?#]/.test(domain) && !domain.endsWith(".");
}

function isValidDomainArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    isDenseArray(value) &&
    value.every(
      (domain): domain is string =>
        typeof domain === "string" && isValidDomain(domain),
    ) &&
    !hasCaseInsensitiveDuplicate(value)
  );
}

function isValidCountryCallingCodeArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    isDenseArray(value) &&
    value.every(
      (callingCode): callingCode is string =>
        typeof callingCode === "string" &&
        /^\+[1-9][0-9]{0,2}$/.test(callingCode),
    ) &&
    !hasExactStringDuplicate(value)
  );
}

function isValidMimeType(mimeType: string): boolean {
  return (
    mimeType === mimeType.toLowerCase() &&
    /^[^/*\s]+\/(?:[^/*\s]+|\*)$/.test(mimeType)
  );
}

function isValidMimeTypeArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    isDenseArray(value) &&
    value.every(
      (mimeType): mimeType is string =>
        typeof mimeType === "string" && isValidMimeType(mimeType),
    ) &&
    !hasExactStringDuplicate(value)
  );
}

function isValidPattern(pattern: unknown): pattern is string {
  if (typeof pattern !== "string" || pattern.length === 0) {
    return false;
  }

  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

function isValidDescriptor(
  value: unknown,
): value is GProntoFrameworkValidationDescriptor {
  try {
    if (!isObjectWithExactKeys(value, ["validator", "options"])) {
      return false;
    }

    const validator = value.validator;
    const options = value.options;

    if (!isValidatorKey(validator)) {
      return false;
    }

    switch (validator) {
      case "value.required":
      case "number.integer":
      case "uuid.standard":
      case "json.standard":
      case "email.standard":
      case "url.standard":
      case "url.https":
      case "telephone.e164":
      case "date.standard":
      case "date.past":
      case "date.future":
      case "datetime.standard":
      case "password.standard":
        return options === null;
      case "string.minimum_length":
      case "string.maximum_length":
      case "array.minimum_length":
      case "array.maximum_length":
        return (
          isObjectWithExactKeys(options, ["length"]) &&
          isNonNegativeSafeInteger(options.length)
        );
      case "string.pattern":
        return (
          isObjectWithExactKeys(options, ["pattern"]) &&
          isValidPattern(options.pattern)
        );
      case "enum.allowed":
        return (
          isObjectWithExactKeys(options, ["values"]) &&
          isValidEnumValues(options.values)
        );
      case "number.minimum":
      case "number.maximum":
        return (
          isObjectWithExactKeys(options, ["value"]) &&
          typeof options.value === "number" &&
          Number.isFinite(options.value)
        );
      case "number.precision_scale":
        return (
          isObjectWithExactKeys(options, ["precision", "scale"]) &&
          isPositiveSafeInteger(options.precision) &&
          isNonNegativeSafeInteger(options.scale) &&
          options.scale <= options.precision
        );
      case "email.domain":
      case "url.domain":
        return (
          isObjectWithExactKeys(options, ["domains"]) &&
          isValidDomainArray(options.domains)
        );
      case "telephone.country":
        return (
          isObjectWithExactKeys(options, ["countryCallingCodes"]) &&
          isValidCountryCallingCodeArray(options.countryCallingCodes)
        );
      case "file.type":
        return (
          isObjectWithExactKeys(options, ["mimeTypes"]) &&
          isValidMimeTypeArray(options.mimeTypes)
        );
      case "file.size":
        return (
          isObjectWithExactKeys(options, ["maximumBytes"]) &&
          isNonNegativeSafeInteger(options.maximumBytes)
        );
    }
  } catch {
    return false;
  }
}

function assertDescriptors(
  validators: readonly GProntoFrameworkValidationDescriptor[],
): void {
  if (!Array.isArray(validators)) {
    throw new TypeError("Invalid validator descriptor at index 0.");
  }

  for (let index = 0; index < validators.length; index += 1) {
    if (!isValidDescriptor(validators[index])) {
      throw new TypeError(`Invalid validator descriptor at index ${index}.`);
    }
  }
}

function createValidationMessage(
  descriptor: GProntoFrameworkValidationDescriptor,
): string {
  const template =
    gProntoFrameworkValidatorCatalog[descriptor.validator].defaultMessage;

  switch (descriptor.validator) {
    case "string.minimum_length":
    case "string.maximum_length":
    case "array.minimum_length":
    case "array.maximum_length":
      return template.replace("{length}", String(descriptor.options.length));
    case "number.minimum":
    case "number.maximum":
      return template.replace("{value}", String(descriptor.options.value));
    case "number.precision_scale":
      return template
        .replace("{precision}", String(descriptor.options.precision))
        .replace("{scale}", String(descriptor.options.scale));
    case "file.size":
      return template.replace(
        "{maximumBytes}",
        String(descriptor.options.maximumBytes),
      );
    default:
      return template;
  }
}

function createValidationError(
  descriptor: GProntoFrameworkValidationDescriptor,
): GProntoFrameworkValidationError {
  return Object.freeze({
    validator: descriptor.validator,
    code: gProntoFrameworkValidatorCatalog[descriptor.validator].code,
    message: createValidationMessage(descriptor),
  });
}

export function validateGProntoFrameworkValue(
  value: unknown,
  validators: readonly GProntoFrameworkValidationDescriptor[],
): GProntoFrameworkValidationResult {
  assertDescriptors(validators);

  const errors: GProntoFrameworkValidationError[] = [];

  for (const descriptor of validators) {
    if (!validateGProntoFrameworkTypeDefault(value, descriptor)) {
      errors.push(createValidationError(descriptor));
    }
  }

  if (errors.length === 0) {
    return validResult;
  }

  return Object.freeze({
    valid: false as const,
    errors: Object.freeze(errors),
  });
}
