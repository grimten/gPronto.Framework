import { useCallback, useEffect, useRef, useState } from "react";
import { gProntoFrameworkMessageCatalog } from "./gPronto.Framework.ApplicationRoot.MessageDefaults";
import { notifyGProntoFramework } from "./gPronto.Framework.ApplicationRoot.NotificationCreation";

type GProntoFrameworkAuthenticationOperationKey =
  | "SignIn"
  | "SignUp"
  | "SignOut"
  | "Reauthentication"
  | "PasswordRecoveryRequest"
  | "PasswordReset"
  | "PasswordChange"
  | "MagicLinkRequest"
  | "InvitationAcceptance"
  | "EmailConfirmationResend"
  | "EmailChange";

type GProntoFrameworkAuthenticationOperationNativeError = Readonly<{
  message?: unknown;
}>;

type GProntoFrameworkAuthenticationOperationNativeResult = Readonly<{
  error: GProntoFrameworkAuthenticationOperationNativeError | null;
}>;

type GProntoFrameworkAuthenticationOperationRunResult =
  "ignored" | "success" | "error";

type GProntoFrameworkAuthenticationOperationRunner = Readonly<{
  isRunning: boolean;
  run: (
    operation: () => Promise<GProntoFrameworkAuthenticationOperationNativeResult>,
  ) => Promise<GProntoFrameworkAuthenticationOperationRunResult>;
}>;

function readAuthenticationOperationErrorMessage(
  value: unknown,
): string | undefined {
  if (value === null || typeof value !== "object") {
    return undefined;
  }

  try {
    const message = (
      value as GProntoFrameworkAuthenticationOperationNativeError
    ).message;

    return typeof message === "string" && message.trim().length > 0
      ? message
      : undefined;
  } catch {
    return undefined;
  }
}

export function useGProntoFrameworkAuthenticationOperation(
  operationKey: GProntoFrameworkAuthenticationOperationKey,
): GProntoFrameworkAuthenticationOperationRunner {
  const [isRunning, setIsRunning] = useState(false);
  const operationInProgress = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (
      operation: () => Promise<GProntoFrameworkAuthenticationOperationNativeResult>,
    ): Promise<GProntoFrameworkAuthenticationOperationRunResult> => {
      if (operationInProgress.current) {
        return "ignored";
      }

      operationInProgress.current = true;
      if (isMounted.current) {
        setIsRunning(true);
      }

      const messages =
        gProntoFrameworkMessageCatalog.Authentication[operationKey];

      try {
        const result = await operation();

        if (result.error !== null) {
          notifyGProntoFramework({
            type: "error",
            title: messages.Failure.Title,
            message:
              readAuthenticationOperationErrorMessage(result.error) ??
              messages.Failure.Fallback,
          });
          return "error";
        }

        notifyGProntoFramework({
          type: "success",
          title: messages.Success.Title,
          message: messages.Success.Message,
        });
        return "success";
      } catch (error: unknown) {
        notifyGProntoFramework({
          type: "error",
          title: messages.Failure.Title,
          message:
            readAuthenticationOperationErrorMessage(error) ??
            messages.Failure.Fallback,
        });
        return "error";
      } finally {
        operationInProgress.current = false;
        if (isMounted.current) {
          setIsRunning(false);
        }
      }
    },
    [operationKey],
  );

  return { isRunning, run };
}
