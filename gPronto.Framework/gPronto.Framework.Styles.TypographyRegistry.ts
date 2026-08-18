export const gProntoFrameworkTypographyRegistry = Object.freeze({
  normal: "gcomponent-typography--normal",
  small: "gcomponent-typography--small",
  lead: "gcomponent-typography--lead",
  h1: "gcomponent-typography--h1",
  h2: "gcomponent-typography--h2",
  h3: "gcomponent-typography--h3",
  h4: "gcomponent-typography--h4",
  h5: "gcomponent-typography--h5",
  h6: "gcomponent-typography--h6",
} as const);

export type GProntoFrameworkTypographyVariant =
  keyof typeof gProntoFrameworkTypographyRegistry;
