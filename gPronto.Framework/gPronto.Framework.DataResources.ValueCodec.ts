import type {
  GProntoFrameworkValueCodecDescriptor,
  GProntoFrameworkValueCodecDirection,
  GProntoFrameworkValueCodecError,
  GProntoFrameworkValueCodecKey,
  GProntoFrameworkValueCodecResult,
} from "./gPronto.Framework.DataResources.ValueCodecContract";
import { gProntoFrameworkValueCodecCatalog } from "./gPronto.Framework.DataResources.ValueCodecRegistry";

type GProntoFrameworkValueCodecDescriptorFor<
  TCodec extends GProntoFrameworkValueCodecKey,
> = Extract<GProntoFrameworkValueCodecDescriptor, { codec: TCodec }>;

type GProntoFrameworkJsonCompatibleValue =
  | null
  | boolean
  | number
  | string
  | readonly GProntoFrameworkJsonCompatibleValue[]
  | Readonly<{
      [key: string]: GProntoFrameworkJsonCompatibleValue;
    }>;

type ValidatedValueCodecDescriptor = Readonly<{
  codec: GProntoFrameworkValueCodecKey;
  allowNull: boolean;
}>;

const invalidValueCodecDescriptor = (): TypeError =>
  new TypeError("Invalid value codec descriptor.");

const hasExactlyOwnKeys = (
  value: object,
  expectedKeys: readonly PropertyKey[],
): boolean => {
  const ownKeys = Reflect.ownKeys(value);

  return (
    ownKeys.length === expectedKeys.length &&
    ownKeys.every((key) => expectedKeys.includes(key))
  );
};

const isValueCodecKey = (
  value: unknown,
): value is GProntoFrameworkValueCodecKey =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(
    gProntoFrameworkValueCodecCatalog,
    value,
  );

const validateValueCodecDescriptor = (
  descriptor: unknown,
): ValidatedValueCodecDescriptor => {
  try {
    if (
      typeof descriptor !== "object" ||
      descriptor === null ||
      Array.isArray(descriptor) ||
      !hasExactlyOwnKeys(descriptor, ["codec", "options"])
    ) {
      throw invalidValueCodecDescriptor();
    }

    const codec = Reflect.get(descriptor, "codec") as unknown;
    const options = Reflect.get(descriptor, "options") as unknown;

    if (
      !isValueCodecKey(codec) ||
      typeof options !== "object" ||
      options === null ||
      Array.isArray(options) ||
      !hasExactlyOwnKeys(options, ["allowNull"])
    ) {
      throw invalidValueCodecDescriptor();
    }

    const allowNull = Reflect.get(options, "allowNull") as unknown;

    if (typeof allowNull !== "boolean") {
      throw invalidValueCodecDescriptor();
    }

    return Object.freeze({ codec, allowNull });
  } catch {
    throw invalidValueCodecDescriptor();
  }
};

const createValueCodecSuccess = <TValue>(
  value: TValue,
): GProntoFrameworkValueCodecResult<TValue> =>
  Object.freeze({ success: true, value });

const createValueCodecError = (
  codec: GProntoFrameworkValueCodecKey,
  direction: GProntoFrameworkValueCodecDirection,
): GProntoFrameworkValueCodecResult<never> => {
  const codecDefinition = gProntoFrameworkValueCodecCatalog[codec];
  const errorDefinition =
    direction === "decode"
      ? codecDefinition.decodeError
      : codecDefinition.encodeError;
  const error = Object.freeze({
    codec,
    direction,
    code: errorDefinition.code,
    message: errorDefinition.message,
  }) satisfies GProntoFrameworkValueCodecError;

  return Object.freeze({ success: false, error });
};

const decodeNullValue = (
  codec: GProntoFrameworkValueCodecKey,
): GProntoFrameworkValueCodecResult<boolean | number | string | null> => {
  if (codec === "boolean.standard") {
    return createValueCodecSuccess(false);
  }

  if (codec === "number.standard") {
    return createValueCodecSuccess(null);
  }

  return createValueCodecSuccess("");
};

const isJsonCompatibleValue = (
  value: unknown,
  ancestors: Set<object> = new Set<object>(),
): value is GProntoFrameworkJsonCompatibleValue => {
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

  if (Array.isArray(value)) {
    const ownKeys = Reflect.ownKeys(value);
    const elementKeys = ownKeys.filter((key) => key !== "length");

    if (
      elementKeys.length !== value.length ||
      elementKeys.some((key) => {
        if (typeof key !== "string") {
          return true;
        }

        const index = Number(key);
        return (
          !Number.isInteger(index) ||
          index < 0 ||
          index >= value.length ||
          String(index) !== key
        );
      })
    ) {
      return false;
    }

    ancestors.add(value);

    try {
      return elementKeys.every((key) =>
        isJsonCompatibleValue(Reflect.get(value, key), ancestors),
      );
    } finally {
      ancestors.delete(value);
    }
  }

  const prototype = Object.getPrototypeOf(value);

  if (prototype !== Object.prototype && prototype !== null) {
    return false;
  }

  const ownKeys = Reflect.ownKeys(value);

  if (ownKeys.some((key) => typeof key !== "string")) {
    return false;
  }

  ancestors.add(value);

  try {
    return ownKeys.every((key) =>
      isJsonCompatibleValue(Reflect.get(value, key), ancestors),
    );
  } finally {
    ancestors.delete(value);
  }
};

const decodeJsonValue = (
  value: unknown,
): GProntoFrameworkValueCodecResult<string> => {
  try {
    if (!isJsonCompatibleValue(value)) {
      return createValueCodecError("jsonb.standard", "decode");
    }

    const serializedValue = JSON.stringify(value, null, 2);

    if (serializedValue === undefined) {
      return createValueCodecError("jsonb.standard", "decode");
    }

    return createValueCodecSuccess(serializedValue);
  } catch {
    return createValueCodecError("jsonb.standard", "decode");
  }
};

const padDatePart = (value: number, length: number): string =>
  String(value).padStart(length, "0");

const decodeTimestampValue = (
  value: unknown,
): GProntoFrameworkValueCodecResult<string> => {
  try {
    const date =
      typeof value === "string"
        ? new Date(value)
        : value instanceof Date
          ? new Date(value.getTime())
          : null;

    if (date === null || !Number.isFinite(date.getTime())) {
      return createValueCodecError("timestamp.local", "decode");
    }

    const milliseconds = date.getMilliseconds();
    const localTimestamp = [
      padDatePart(date.getFullYear(), 4),
      "-",
      padDatePart(date.getMonth() + 1, 2),
      "-",
      padDatePart(date.getDate(), 2),
      "T",
      padDatePart(date.getHours(), 2),
      ":",
      padDatePart(date.getMinutes(), 2),
      ":",
      padDatePart(date.getSeconds(), 2),
      milliseconds === 0 ? "" : `.${padDatePart(milliseconds, 3)}`,
    ].join("");

    return createValueCodecSuccess(localTimestamp);
  } catch {
    return createValueCodecError("timestamp.local", "decode");
  }
};

const localTimestampPattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?$/;

const encodeTimestampValue = (
  value: string,
): GProntoFrameworkValueCodecResult<string> => {
  try {
    const match = localTimestampPattern.exec(value);

    if (match === null) {
      return createValueCodecError("timestamp.local", "encode");
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hours = Number(match[4]);
    const minutes = Number(match[5]);
    const seconds = match[6] === undefined ? 0 : Number(match[6]);
    const milliseconds = match[7] === undefined ? 0 : Number(match[7]);
    const date = new Date(0);

    date.setFullYear(year, month - 1, day);
    date.setHours(hours, minutes, seconds, milliseconds);

    if (
      !Number.isFinite(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date.getHours() !== hours ||
      date.getMinutes() !== minutes ||
      (match[6] !== undefined && date.getSeconds() !== seconds) ||
      (match[7] !== undefined && date.getMilliseconds() !== milliseconds)
    ) {
      return createValueCodecError("timestamp.local", "encode");
    }

    return createValueCodecSuccess(date.toISOString());
  } catch {
    return createValueCodecError("timestamp.local", "encode");
  }
};

export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"boolean.standard">,
): GProntoFrameworkValueCodecResult<boolean>;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"number.standard">,
): GProntoFrameworkValueCodecResult<number | null>;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"string.standard">,
): GProntoFrameworkValueCodecResult<string>;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"text.array.comma">,
): GProntoFrameworkValueCodecResult<string>;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"jsonb.standard">,
): GProntoFrameworkValueCodecResult<string>;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"timestamp.local">,
): GProntoFrameworkValueCodecResult<string>;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptor,
): GProntoFrameworkValueCodecResult;
export function decodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptor,
): GProntoFrameworkValueCodecResult {
  const { codec, allowNull } = validateValueCodecDescriptor(descriptor);

  if (value === null || value === undefined) {
    return allowNull
      ? decodeNullValue(codec)
      : createValueCodecError(codec, "decode");
  }

  switch (codec) {
    case "boolean.standard":
      return typeof value === "boolean"
        ? createValueCodecSuccess(value)
        : createValueCodecError(codec, "decode");
    case "number.standard": {
      if (typeof value === "number" && Number.isFinite(value)) {
        return createValueCodecSuccess(value);
      }

      if (typeof value === "string" && value !== "") {
        const numberValue = Number(value);

        if (Number.isFinite(numberValue)) {
          return createValueCodecSuccess(numberValue);
        }
      }

      return createValueCodecError(codec, "decode");
    }
    case "string.standard":
      return typeof value === "string"
        ? createValueCodecSuccess(value)
        : createValueCodecError(codec, "decode");
    case "text.array.comma":
      try {
        if (
          Array.isArray(value) &&
          Array.prototype.every.call(
            value,
            (item: unknown) => typeof item === "string",
          )
        ) {
          return createValueCodecSuccess(
            Array.prototype.join.call(value, ", ") as string,
          );
        }
      } catch {
        return createValueCodecError(codec, "decode");
      }

      return createValueCodecError(codec, "decode");
    case "jsonb.standard":
      return decodeJsonValue(value);
    case "timestamp.local":
      return decodeTimestampValue(value);
  }

  return createValueCodecError(codec, "decode");
}

export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"boolean.standard">,
): GProntoFrameworkValueCodecResult<boolean>;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"number.standard">,
): GProntoFrameworkValueCodecResult<number | null>;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"string.standard">,
): GProntoFrameworkValueCodecResult<string | null>;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"text.array.comma">,
): GProntoFrameworkValueCodecResult<readonly string[] | null>;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"jsonb.standard">,
): GProntoFrameworkValueCodecResult<GProntoFrameworkJsonCompatibleValue | null>;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptorFor<"timestamp.local">,
): GProntoFrameworkValueCodecResult<string | null>;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptor,
): GProntoFrameworkValueCodecResult;
export function encodeGProntoFrameworkValue(
  value: unknown,
  descriptor: GProntoFrameworkValueCodecDescriptor,
): GProntoFrameworkValueCodecResult {
  const { codec, allowNull } = validateValueCodecDescriptor(descriptor);

  switch (codec) {
    case "boolean.standard":
      return typeof value === "boolean"
        ? createValueCodecSuccess(value)
        : createValueCodecError(codec, "encode");
    case "number.standard":
      if (value === null) {
        return allowNull
          ? createValueCodecSuccess(null)
          : createValueCodecError(codec, "encode");
      }

      return typeof value === "number" && Number.isFinite(value)
        ? createValueCodecSuccess(value)
        : createValueCodecError(codec, "encode");
    case "string.standard":
      if (typeof value !== "string") {
        return createValueCodecError(codec, "encode");
      }

      return value === "" && allowNull
        ? createValueCodecSuccess(null)
        : createValueCodecSuccess(value);
    case "text.array.comma":
      if (typeof value !== "string") {
        return createValueCodecError(codec, "encode");
      }

      if (value === "") {
        return createValueCodecSuccess(allowNull ? null : []);
      }

      return createValueCodecSuccess(
        value.split(",").map((item) => item.trim()),
      );
    case "jsonb.standard":
      if (typeof value !== "string") {
        return createValueCodecError(codec, "encode");
      }

      if (value === "") {
        return allowNull
          ? createValueCodecSuccess(null)
          : createValueCodecError(codec, "encode");
      }

      try {
        const parsedValue = JSON.parse(value) as unknown;

        return isJsonCompatibleValue(parsedValue)
          ? createValueCodecSuccess(parsedValue)
          : createValueCodecError(codec, "encode");
      } catch {
        return createValueCodecError(codec, "encode");
      }
    case "timestamp.local":
      if (typeof value !== "string") {
        return createValueCodecError(codec, "encode");
      }

      if (value === "") {
        return allowNull
          ? createValueCodecSuccess(null)
          : createValueCodecError(codec, "encode");
      }

      return encodeTimestampValue(value);
  }

  return createValueCodecError(codec, "encode");
}
