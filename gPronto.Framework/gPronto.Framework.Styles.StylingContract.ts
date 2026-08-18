export type GProntoFrameworkStylingIdentifier = "gStyling-1" | "gStyling-2";

export type GProntoFrameworkStyling = Readonly<{
  identifier: GProntoFrameworkStylingIdentifier;
  css: string;
}>;
