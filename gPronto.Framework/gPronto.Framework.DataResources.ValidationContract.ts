export type GProntoFrameworkValidatorKey =
  | "value.required"
  | "string.minimum_length"
  | "string.maximum_length"
  | "string.pattern"
  | "enum.allowed"
  | "number.minimum"
  | "number.maximum"
  | "number.integer"
  | "number.precision_scale"
  | "array.minimum_length"
  | "array.maximum_length"
  | "uuid.standard"
  | "json.standard"
  | "email.standard"
  | "email.domain"
  | "url.standard"
  | "url.https"
  | "url.domain"
  | "telephone.e164"
  | "telephone.country"
  | "date.standard"
  | "date.past"
  | "date.future"
  | "datetime.standard"
  | "file.type"
  | "file.size"
  | "password.standard";

export type GProntoFrameworkValidationDescriptor =
  | Readonly<{ validator: "value.required"; options: null }>
  | Readonly<{
      validator: "string.minimum_length";
      options: Readonly<{ length: number }>;
    }>
  | Readonly<{
      validator: "string.maximum_length";
      options: Readonly<{ length: number }>;
    }>
  | Readonly<{
      validator: "string.pattern";
      options: Readonly<{ pattern: string }>;
    }>
  | Readonly<{
      validator: "enum.allowed";
      options: Readonly<{
        values: readonly (string | number | boolean)[];
      }>;
    }>
  | Readonly<{
      validator: "number.minimum";
      options: Readonly<{ value: number }>;
    }>
  | Readonly<{
      validator: "number.maximum";
      options: Readonly<{ value: number }>;
    }>
  | Readonly<{ validator: "number.integer"; options: null }>
  | Readonly<{
      validator: "number.precision_scale";
      options: Readonly<{ precision: number; scale: number }>;
    }>
  | Readonly<{
      validator: "array.minimum_length";
      options: Readonly<{ length: number }>;
    }>
  | Readonly<{
      validator: "array.maximum_length";
      options: Readonly<{ length: number }>;
    }>
  | Readonly<{ validator: "uuid.standard"; options: null }>
  | Readonly<{ validator: "json.standard"; options: null }>
  | Readonly<{ validator: "email.standard"; options: null }>
  | Readonly<{
      validator: "email.domain";
      options: Readonly<{ domains: readonly string[] }>;
    }>
  | Readonly<{ validator: "url.standard"; options: null }>
  | Readonly<{ validator: "url.https"; options: null }>
  | Readonly<{
      validator: "url.domain";
      options: Readonly<{ domains: readonly string[] }>;
    }>
  | Readonly<{ validator: "telephone.e164"; options: null }>
  | Readonly<{
      validator: "telephone.country";
      options: Readonly<{ countryCallingCodes: readonly string[] }>;
    }>
  | Readonly<{ validator: "date.standard"; options: null }>
  | Readonly<{ validator: "date.past"; options: null }>
  | Readonly<{ validator: "date.future"; options: null }>
  | Readonly<{ validator: "datetime.standard"; options: null }>
  | Readonly<{
      validator: "file.type";
      options: Readonly<{ mimeTypes: readonly string[] }>;
    }>
  | Readonly<{
      validator: "file.size";
      options: Readonly<{ maximumBytes: number }>;
    }>
  | Readonly<{ validator: "password.standard"; options: null }>;

export type GProntoFrameworkValidationError = Readonly<{
  validator: GProntoFrameworkValidatorKey;
  code: GProntoFrameworkValidatorKey;
  message: string;
}>;

export type GProntoFrameworkValidationResult =
  | Readonly<{ valid: true; errors: readonly [] }>
  | Readonly<{
      valid: false;
      errors: readonly GProntoFrameworkValidationError[];
    }>;

export type GProntoFrameworkValidatorCatalog = Readonly<
  Record<
    GProntoFrameworkValidatorKey,
    Readonly<{
      code: GProntoFrameworkValidatorKey;
      defaultMessage: string;
    }>
  >
>;
