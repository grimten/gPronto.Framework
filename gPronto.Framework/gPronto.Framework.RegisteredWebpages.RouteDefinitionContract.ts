export type GProntoFrameworkRegisteredWebpageRouteDefinition =
  | {
      kind: "path";
      path: string;
    }
  | {
      kind: "not-found";
    };
