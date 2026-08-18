export type GProntoFrameworkValueCodecKey =
  | "boolean.standard"
  | "number.standard"
  | "string.standard"
  | "text.array.comma"
  | "jsonb.standard"
  | "timestamp.local";

export type GProntoFrameworkValueCodecDescriptor =
  | Readonly<{
      codec: "boolean.standard";
      options: Readonly<{ allowNull: boolean }>;
    }>
  | Readonly<{
      codec: "number.standard";
      options: Readonly<{ allowNull: boolean }>;
    }>
  | Readonly<{
      codec: "string.standard";
      options: Readonly<{ allowNull: boolean }>;
    }>
  | Readonly<{
      codec: "text.array.comma";
      options: Readonly<{ allowNull: boolean }>;
    }>
  | Readonly<{
      codec: "jsonb.standard";
      options: Readonly<{ allowNull: boolean }>;
    }>
  | Readonly<{
      codec: "timestamp.local";
      options: Readonly<{ allowNull: boolean }>;
    }>;

export type GProntoFrameworkValueCodecDirection = "decode" | "encode";

export type GProntoFrameworkValueCodecErrorCode =
  `${GProntoFrameworkValueCodecKey}.${GProntoFrameworkValueCodecDirection}`;

export type GProntoFrameworkValueCodecError = Readonly<{
  codec: GProntoFrameworkValueCodecKey;
  direction: GProntoFrameworkValueCodecDirection;
  code: GProntoFrameworkValueCodecErrorCode;
  message: string;
}>;

export type GProntoFrameworkValueCodecResult<T = unknown> =
  | Readonly<{ success: true; value: T }>
  | Readonly<{ success: false; error: GProntoFrameworkValueCodecError }>;

export type GProntoFrameworkValueCodecCatalog = Readonly<
  Record<
    GProntoFrameworkValueCodecKey,
    Readonly<{
      decodeError: Readonly<{ code: string; message: string }>;
      encodeError: Readonly<{ code: string; message: string }>;
    }>
  >
>;
