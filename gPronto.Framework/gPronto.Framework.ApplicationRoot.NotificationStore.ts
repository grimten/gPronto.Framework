import type {
  GProntoFrameworkNotificationRecord,
  GProntoFrameworkNotificationRequest,
  GProntoFrameworkNotificationStoreEntry,
  GProntoFrameworkNotificationStoreSnapshot,
  GProntoFrameworkNotificationType,
} from "./gPronto.Framework.ApplicationRoot.NotificationContract";

type GProntoFrameworkNotificationStoreListener = () => void;

type GProntoFrameworkRefineNotificationRequest = Readonly<{
  type: GProntoFrameworkNotificationType;
  message: string;
  title?: string;
  key?: string;
  progress: boolean;
  cancelMutation?: () => void;
  undoableTimeoutSeconds?: number;
}>;

const listeners = new Set<GProntoFrameworkNotificationStoreListener>();

const directSource = Object.freeze({ kind: "direct" as const });

let nextNotificationIdentifier = 1;
let notificationQueue: readonly GProntoFrameworkNotificationStoreEntry[] = [];
let notificationSnapshot = createSnapshot(notificationQueue);

function createSnapshot(
  queue: readonly GProntoFrameworkNotificationStoreEntry[],
): GProntoFrameworkNotificationStoreSnapshot {
  return Object.freeze({
    entries: Object.freeze([...queue]),
  });
}

function publishQueue(
  nextQueue: readonly GProntoFrameworkNotificationStoreEntry[],
): void {
  notificationQueue = nextQueue;
  notificationSnapshot = createSnapshot(notificationQueue);

  for (const listener of listeners) {
    listener();
  }
}

function allocateNotificationIdentifier(): number {
  const identifier = nextNotificationIdentifier;
  nextNotificationIdentifier += 1;
  return identifier;
}

function hasActiveDeduplicationKey(key: string): boolean {
  return notificationQueue.some(
    ({ record }) => record.deduplicationKey === key,
  );
}

export function hasActiveGProntoFrameworkNotificationDeduplicationKey(
  key: string,
): boolean {
  return hasActiveDeduplicationKey(key);
}

function createDirectRecord(
  request: GProntoFrameworkNotificationRequest,
): GProntoFrameworkNotificationRecord {
  return Object.freeze({
    id: allocateNotificationIdentifier(),
    type: request.type,
    message: request.message,
    ...(request.title === undefined ? {} : { title: request.title }),
    ...(request.deduplicationKey === undefined
      ? {}
      : { deduplicationKey: request.deduplicationKey }),
    source: directSource,
  });
}

function createRefineRecord(
  request: GProntoFrameworkRefineNotificationRequest,
  identifier: number,
): GProntoFrameworkNotificationRecord {
  const source = Object.freeze({
    kind: "refine" as const,
    ...(request.key === undefined ? {} : { key: request.key }),
    progress: request.progress,
    ...(request.cancelMutation === undefined
      ? {}
      : { cancelMutation: request.cancelMutation }),
    ...(request.undoableTimeoutSeconds === undefined
      ? {}
      : { undoableTimeoutSeconds: request.undoableTimeoutSeconds }),
  });

  return Object.freeze({
    id: identifier,
    type: request.type,
    message: request.message,
    ...(request.title === undefined ? {} : { title: request.title }),
    ...(request.key === undefined ? {} : { deduplicationKey: request.key }),
    source,
  });
}

function appendRecord(record: GProntoFrameworkNotificationRecord): void {
  publishQueue([
    ...notificationQueue,
    Object.freeze({ record, open: true, revision: 0 }),
  ]);
}

export function enqueueGProntoFrameworkDirectNotification(
  request: GProntoFrameworkNotificationRequest,
): void {
  if (
    request.deduplicationKey !== undefined &&
    hasActiveDeduplicationKey(request.deduplicationKey)
  ) {
    return;
  }

  appendRecord(createDirectRecord(request));
}

export function openGProntoFrameworkRefineNotification(
  request: GProntoFrameworkRefineNotificationRequest,
): void {
  const matchingIndex =
    request.key === undefined
      ? -1
      : notificationQueue.findIndex(
          ({ record }) => record.deduplicationKey === request.key,
        );

  if (matchingIndex >= 0) {
    const matchingEntry = notificationQueue[matchingIndex];

    if (
      !request.progress ||
      matchingEntry.record.source.kind !== "refine" ||
      !matchingEntry.record.source.progress
    ) {
      return;
    }

    const updatedEntry = Object.freeze({
      record: createRefineRecord(request, matchingEntry.record.id),
      open: matchingEntry.open,
      revision: matchingEntry.open
        ? matchingEntry.revision + 1
        : matchingEntry.revision,
    });

    publishQueue(
      notificationQueue.map((entry, index) =>
        index === matchingIndex ? updatedEntry : entry,
      ),
    );
    return;
  }

  appendRecord(createRefineRecord(request, allocateNotificationIdentifier()));
}

export function closeGProntoFrameworkNotification(
  notificationIdentifier: number,
): void {
  const matchingIndex = notificationQueue.findIndex(
    ({ record }) => record.id === notificationIdentifier,
  );

  if (matchingIndex < 0) {
    return;
  }

  const matchingEntry = notificationQueue[matchingIndex];
  if (!matchingEntry.open) {
    return;
  }

  publishQueue(
    notificationQueue.map((entry, index) =>
      index === matchingIndex
        ? Object.freeze({ ...matchingEntry, open: false })
        : entry,
    ),
  );
}

export function closeGProntoFrameworkRefineNotification(key: string): void {
  const matchingEntry = notificationQueue.find(
    ({ record }) =>
      record.source.kind === "refine" && record.source.key === key,
  );

  if (matchingEntry === undefined) {
    return;
  }

  closeGProntoFrameworkNotification(matchingEntry.record.id);
}

export function completeGProntoFrameworkNotificationTransition(
  notificationIdentifier: number,
): void {
  const matchingEntry = notificationQueue.find(
    ({ record }) => record.id === notificationIdentifier,
  );

  if (matchingEntry === undefined || matchingEntry.open) {
    return;
  }

  publishQueue(
    notificationQueue.filter(
      ({ record }) => record.id !== notificationIdentifier,
    ),
  );
}

export function subscribeToGProntoFrameworkNotifications(
  listener: GProntoFrameworkNotificationStoreListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getGProntoFrameworkNotificationSnapshot(): GProntoFrameworkNotificationStoreSnapshot {
  return notificationSnapshot;
}
