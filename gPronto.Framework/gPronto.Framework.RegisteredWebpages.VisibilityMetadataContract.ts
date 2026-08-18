export type GProntoFrameworkRegisteredWebpageVisibilityMetadata =
  | {
      mode: "public";
      redirectPath: null;
    }
  | {
      mode: "authenticated";
      redirectPath: string;
    };
