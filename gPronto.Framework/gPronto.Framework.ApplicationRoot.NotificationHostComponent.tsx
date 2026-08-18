import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type {
  GProntoFrameworkNotificationRecord,
  GProntoFrameworkNotificationStoreEntry,
} from "./gPronto.Framework.ApplicationRoot.NotificationContract";
import {
  closeGProntoFrameworkNotification,
  completeGProntoFrameworkNotificationTransition,
  getGProntoFrameworkNotificationSnapshot,
  subscribeToGProntoFrameworkNotifications,
} from "./gPronto.Framework.ApplicationRoot.NotificationStore";
import { gProntoFrameworkTypographyRegistry } from "./gPronto.Framework.Styles.TypographyRegistry";

const ordinaryNotificationDurationMilliseconds = 4_000;

type GProntoFrameworkNotificationItemProps = Readonly<{
  entry: GProntoFrameworkNotificationStoreEntry;
}>;

function getGProntoFrameworkNotificationAutoHideDuration(
  record: GProntoFrameworkNotificationRecord,
): number {
  return record.source.kind === "refine" && record.source.progress
    ? (record.source.undoableTimeoutSeconds ?? 0) * 1_000
    : ordinaryNotificationDurationMilliseconds;
}

function GProntoFrameworkNotificationItem({
  entry,
}: GProntoFrameworkNotificationItemProps) {
  const { open, record, revision } = entry;
  const undoActivationRecordIdentifier = useRef<number | null>(null);
  const alertElementReference = useRef<HTMLDivElement | null>(null);
  const notificationAnimationReference = useRef<Animation | null>(null);
  const progressSource =
    record?.source.kind === "refine" && record.source.progress
      ? record.source
      : undefined;
  const autoHideDuration =
    getGProntoFrameworkNotificationAutoHideDuration(record);

  useEffect(() => {
    notificationAnimationReference.current?.cancel();
    notificationAnimationReference.current = null;

    const alertElement = alertElementReference.current;
    if (!open || alertElement === null) {
      return;
    }

    notificationAnimationReference.current = alertElement.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-100%)" },
      ],
      {
        duration: autoHideDuration,
        easing: "linear",
        fill: "forwards",
      },
    );
  }, [autoHideDuration, open, record, revision]);

  const assertive = record.type === "error" || record.type === "warning";

  const closeRecord = () => {
    closeGProntoFrameworkNotification(record.id);
  };

  const undoOperation = () => {
    if (
      progressSource?.cancelMutation === undefined ||
      undoActivationRecordIdentifier.current === record.id
    ) {
      return;
    }

    undoActivationRecordIdentifier.current = record.id;
    try {
      progressSource.cancelMutation();
    } finally {
      closeRecord();
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      autoHideDuration={autoHideDuration}
      open={open}
      onClose={(_event, reason) => {
        if (reason !== "clickaway") {
          closeRecord();
        }
      }}
      resumeHideDuration={autoHideDuration}
      transitionDuration={{ appear: 0, enter: 0, exit: 0 }}
      sx={{
        bottom: "auto",
        left: "auto",
        overflow: "hidden",
        pointerEvents: "auto",
        position: "static",
        right: "auto",
        transform: "none",
        width: "100%",
      }}
      TransitionProps={{
        onExited: () => {
          completeGProntoFrameworkNotificationTransition(record.id);
        },
      }}
    >
      <Alert
        ref={alertElementReference}
        sx={{ width: "100%" }}
        action={
          <Box sx={{ alignItems: "center", display: "flex" }}>
            {progressSource?.cancelMutation === undefined ? null : (
              <Button
                className={gProntoFrameworkTypographyRegistry.normal}
                color="inherit"
                size="small"
                onClick={undoOperation}
              >
                Undo operation
              </Button>
            )}
            <IconButton
              aria-label="Dismiss notification"
              color="inherit"
              size="small"
              onClick={closeRecord}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        }
        aria-live={assertive ? "assertive" : "polite"}
        role={assertive ? "alert" : "status"}
        severity={record.type}
      >
        {record.title === undefined ? null : (
          <AlertTitle className={gProntoFrameworkTypographyRegistry.h6}>
            {record.title}
          </AlertTitle>
        )}
        <span className={gProntoFrameworkTypographyRegistry.normal}>
          {record.message}
        </span>
      </Alert>
    </Snackbar>
  );
}

export function GProntoFrameworkNotificationHostComponent() {
  const snapshot = useSyncExternalStore(
    subscribeToGProntoFrameworkNotifications,
    getGProntoFrameworkNotificationSnapshot,
  );

  if (snapshot.entries.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        bottom: 16,
        display: "flex",
        flexDirection: "column-reverse",
        gap: 1.5,
        pointerEvents: "none",
        position: "fixed",
        right: 16,
        width: "min(560px, calc(100vw - 32px))",
        zIndex: (theme) => theme.zIndex.snackbar,
      }}
    >
      {snapshot.entries.map((entry) => (
        <GProntoFrameworkNotificationItem
          key={`${entry.record.id}:${entry.revision}`}
          entry={entry}
        />
      ))}
    </Box>
  );
}
