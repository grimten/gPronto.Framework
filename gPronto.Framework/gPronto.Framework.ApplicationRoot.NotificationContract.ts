export type GProntoFrameworkNotificationType =
  "success" | "error" | "warning" | "info";

export type GProntoFrameworkNotificationRequest = Readonly<{
  type: GProntoFrameworkNotificationType;
  message: string;
  title?: string;
  deduplicationKey?: string;
}>;

export type GProntoFrameworkNotificationRecord = Readonly<{
  id: number;
  type: GProntoFrameworkNotificationType;
  message: string;
  title?: string;
  deduplicationKey?: string;
  source:
    | Readonly<{ kind: "direct" }>
    | Readonly<{
        kind: "refine";
        key?: string;
        progress: boolean;
        cancelMutation?: () => void;
        undoableTimeoutSeconds?: number;
      }>;
}>;

export type GProntoFrameworkNotificationStoreEntry = Readonly<{
  record: GProntoFrameworkNotificationRecord;
  open: boolean;
  revision: number;
}>;

export type GProntoFrameworkNotificationStoreSnapshot = Readonly<{
  entries: readonly GProntoFrameworkNotificationStoreEntry[];
}>;
