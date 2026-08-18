import type {
  GProntoFrameworkValidatorCatalog,
  GProntoFrameworkValidatorKey,
} from "./gPronto.Framework.DataResources.ValidationContract";

function createCatalogEntry<Key extends GProntoFrameworkValidatorKey>(
  code: Key,
  defaultMessage: string,
): Readonly<{ code: Key; defaultMessage: string }> {
  return Object.freeze({ code, defaultMessage });
}

export const gProntoFrameworkValidatorCatalog = Object.freeze({
  "value.required": createCatalogEntry(
    "value.required",
    "A value is required.",
  ),
  "string.minimum_length": createCatalogEntry(
    "string.minimum_length",
    "Enter at least {length} characters.",
  ),
  "string.maximum_length": createCatalogEntry(
    "string.maximum_length",
    "Enter no more than {length} characters.",
  ),
  "string.pattern": createCatalogEntry(
    "string.pattern",
    "Enter a value in the required format.",
  ),
  "enum.allowed": createCatalogEntry(
    "enum.allowed",
    "Select an allowed value.",
  ),
  "number.minimum": createCatalogEntry(
    "number.minimum",
    "Enter a value greater than or equal to {value}.",
  ),
  "number.maximum": createCatalogEntry(
    "number.maximum",
    "Enter a value less than or equal to {value}.",
  ),
  "number.integer": createCatalogEntry(
    "number.integer",
    "Enter a whole number.",
  ),
  "number.precision_scale": createCatalogEntry(
    "number.precision_scale",
    "Enter a number with at most {precision} digits and {scale} decimal places.",
  ),
  "array.minimum_length": createCatalogEntry(
    "array.minimum_length",
    "Select at least {length} values.",
  ),
  "array.maximum_length": createCatalogEntry(
    "array.maximum_length",
    "Select no more than {length} values.",
  ),
  "uuid.standard": createCatalogEntry("uuid.standard", "Enter a valid UUID."),
  "json.standard": createCatalogEntry("json.standard", "Enter valid JSON."),
  "email.standard": createCatalogEntry(
    "email.standard",
    "Enter a valid email address.",
  ),
  "email.domain": createCatalogEntry(
    "email.domain",
    "Enter an email address from an allowed domain.",
  ),
  "url.standard": createCatalogEntry(
    "url.standard",
    "Enter a valid HTTP or HTTPS URL.",
  ),
  "url.https": createCatalogEntry("url.https", "Enter a secure HTTPS URL."),
  "url.domain": createCatalogEntry(
    "url.domain",
    "Enter a URL from an allowed domain.",
  ),
  "telephone.e164": createCatalogEntry(
    "telephone.e164",
    "Enter a valid international telephone number.",
  ),
  "telephone.country": createCatalogEntry(
    "telephone.country",
    "Enter a telephone number from an allowed country calling code.",
  ),
  "date.standard": createCatalogEntry("date.standard", "Enter a valid date."),
  "date.past": createCatalogEntry("date.past", "Enter a date before today."),
  "date.future": createCatalogEntry("date.future", "Enter a date after today."),
  "datetime.standard": createCatalogEntry(
    "datetime.standard",
    "Enter a valid date and time.",
  ),
  "file.type": createCatalogEntry(
    "file.type",
    "Select a file with an allowed type.",
  ),
  "file.size": createCatalogEntry(
    "file.size",
    "Select a file no larger than {maximumBytes} bytes.",
  ),
  "password.standard": createCatalogEntry(
    "password.standard",
    "Enter a password containing at least 8 characters.",
  ),
}) satisfies GProntoFrameworkValidatorCatalog;
