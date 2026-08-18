import { useEffect, useRef, useState } from "react";
import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import type { GProntoFrameworkAuthenticationEmailLinkType } from "../../gPronto.Framework.Authentication.EmailLinkTypeContract";
import { isGProntoFrameworkAuthenticationEmailLinkType } from "../../gPronto.Framework.Authentication.EmailLinkTypeValidation";
import { GComponentAuthenticationLoading } from "../gComponent.AuthenticationLoading/gComponent.AuthenticationLoading";
import { GComponentAuthenticationOperationError } from "../gComponent.AuthenticationOperationError/gComponent.AuthenticationOperationError";
import { GComponentAuthenticationResultMessage } from "../gComponent.AuthenticationResultMessage/gComponent.AuthenticationResultMessage";

type AuthenticationCallbackEmailLink =
  | { kind: "absent" }
  | { kind: "invalid" }
  | {
      kind: "present";
      tokenHash: string;
      type: GProntoFrameworkAuthenticationEmailLinkType;
    };

type AuthenticationCallbackExchange =
  | { kind: "none" }
  | { kind: "verifying" }
  | { kind: "invalid-link" }
  | { kind: "failed"; message: string }
  | { kind: "completed" };

function readAuthenticationCallbackEmailLink(): AuthenticationCallbackEmailLink {
  const searchParameters = new URLSearchParams(window.location.search);
  const tokenHash = searchParameters.get("token_hash");

  if (tokenHash === null || tokenHash.length === 0) {
    return { kind: "absent" };
  }

  const type = searchParameters.get("type");

  if (!isGProntoFrameworkAuthenticationEmailLinkType(type)) {
    return { kind: "invalid" };
  }

  return { kind: "present", tokenHash, type };
}

export function GComponentAuthenticationCallback() {
  const exchangeStarted = useRef(false);
  const [exchange, setExchange] = useState<AuthenticationCallbackExchange>({
    kind: "none",
  });

  useEffect(() => {
    if (exchangeStarted.current) {
      return;
    }

    exchangeStarted.current = true;

    const emailLink = readAuthenticationCallbackEmailLink();

    if (emailLink.kind === "absent") {
      return;
    }

    if (emailLink.kind === "invalid") {
      setExchange({ kind: "invalid-link" });
      return;
    }

    setExchange({ kind: "verifying" });

    void (async () => {
      try {
        const verifyResult =
          await GProntoFrameworkApplicationRootComponent.Authentication.Verify.EmailLink.Function(
            emailLink.tokenHash,
            emailLink.type,
          );

        setExchange(
          verifyResult.error
            ? {
                kind: "failed",
                message:
                  verifyResult.error.message || "Email verification failed.",
              }
            : { kind: "completed" },
        );
      } catch (error: unknown) {
        setExchange({
          kind: "failed",
          message:
            error instanceof Error && error.message.length > 0
              ? error.message
              : "Email verification failed.",
        });
      }
    })();
  }, []);

  const status = GProntoFrameworkApplicationRootComponent.AuthenticationStatus;

  let content;

  if (exchange.kind === "verifying") {
    content = (
      <GComponentAuthenticationLoading message="Completing authentication." />
    );
  } else if (exchange.kind === "invalid-link") {
    content = (
      <GComponentAuthenticationOperationError message="The email verification link is invalid." />
    );
  } else if (exchange.kind === "failed") {
    content = (
      <GComponentAuthenticationOperationError message={exchange.message} />
    );
  } else if (status === "Failure") {
    content = (
      <GComponentAuthenticationOperationError
        message={
          GProntoFrameworkApplicationRootComponent.AuthenticationErrorMessage
        }
      />
    );
  } else if (status === "SignedIn") {
    content = (
      <GComponentAuthenticationResultMessage
        title="Authentication completed"
        message="Authentication completed."
        type="success"
      />
    );
  } else if (exchange.kind === "completed") {
    content = (
      <GComponentAuthenticationLoading message="Completing authentication." />
    );
  } else if (status === "SignedOut") {
    content = (
      <GComponentAuthenticationResultMessage
        title="No authenticated session"
        message="No authenticated session was received."
      />
    );
  } else {
    content = (
      <GComponentAuthenticationLoading message="Completing authentication." />
    );
  }

  return <div className="gcomponent-authentication-callback">{content}</div>;
}
