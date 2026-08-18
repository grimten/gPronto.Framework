type GProntoFrameworkAuthenticationOperationMessages = Readonly<{
  Success: Readonly<{
    Title: string;
    Message: string;
  }>;
  Failure: Readonly<{
    Title: string;
    Fallback: string;
  }>;
}>;

type GProntoFrameworkAuthenticationMessageCatalog = Readonly<{
  SignIn: GProntoFrameworkAuthenticationOperationMessages;
  SignUp: GProntoFrameworkAuthenticationOperationMessages;
  SignOut: GProntoFrameworkAuthenticationOperationMessages;
  Reauthentication: GProntoFrameworkAuthenticationOperationMessages;
  PasswordRecoveryRequest: GProntoFrameworkAuthenticationOperationMessages;
  PasswordReset: GProntoFrameworkAuthenticationOperationMessages;
  PasswordChange: GProntoFrameworkAuthenticationOperationMessages;
  MagicLinkRequest: GProntoFrameworkAuthenticationOperationMessages;
  InvitationAcceptance: GProntoFrameworkAuthenticationOperationMessages;
  EmailConfirmationResend: GProntoFrameworkAuthenticationOperationMessages;
  EmailChange: GProntoFrameworkAuthenticationOperationMessages;
}>;

export type GProntoFrameworkMessageCatalog = Readonly<{
  Authentication: GProntoFrameworkAuthenticationMessageCatalog;
}>;

function createAuthenticationOperationMessages(
  successTitle: string,
  successMessage: string,
  failureTitle: string,
  failureFallback: string,
): GProntoFrameworkAuthenticationOperationMessages {
  return Object.freeze({
    Success: Object.freeze({
      Title: successTitle,
      Message: successMessage,
    }),
    Failure: Object.freeze({
      Title: failureTitle,
      Fallback: failureFallback,
    }),
  });
}

const gProntoFrameworkAuthenticationMessageCatalog = Object.freeze({
  SignIn: createAuthenticationOperationMessages(
    "Success",
    "Signed in.",
    "Sign-in failed",
    "Sign-in failed.",
  ),
  SignUp: createAuthenticationOperationMessages(
    "Success",
    "Sign-up request received. If email confirmation is required, check your email and confirm your account before signing in.",
    "Sign-up failed",
    "Sign-up failed.",
  ),
  SignOut: createAuthenticationOperationMessages(
    "Signed out",
    "Signed out of the current application on this device.",
    "Sign-out failed",
    "Authentication sign-out failed.",
  ),
  Reauthentication: createAuthenticationOperationMessages(
    "Verification code requested",
    "A verification code was sent to your confirmed email address or phone number.",
    "Reauthentication failed",
    "Reauthentication could not be requested.",
  ),
  PasswordRecoveryRequest: createAuthenticationOperationMessages(
    "Request received",
    "If this email can receive password recovery instructions, they have been sent.",
    "Request failed",
    "Password recovery failed.",
  ),
  PasswordReset: createAuthenticationOperationMessages(
    "Success",
    "Password reset.",
    "Password reset failed",
    "Password reset failed.",
  ),
  PasswordChange: createAuthenticationOperationMessages(
    "Success",
    "Password changed.",
    "Password change failed",
    "Password change failed.",
  ),
  MagicLinkRequest: createAuthenticationOperationMessages(
    "Request received",
    "If this email can receive a magic link, check your inbox.",
    "Request failed",
    "Unable to send a magic link.",
  ),
  InvitationAcceptance: createAuthenticationOperationMessages(
    "Success",
    "Invitation accepted. Your password has been set.",
    "Invitation acceptance failed",
    "Invitation acceptance failed.",
  ),
  EmailConfirmationResend: createAuthenticationOperationMessages(
    "Request sent",
    "If this email is awaiting confirmation, a confirmation message has been sent.",
    "Request failed",
    "The confirmation email could not be requested.",
  ),
  EmailChange: createAuthenticationOperationMessages(
    "Success",
    "Email change requested. Check your email for confirmation instructions. Depending on the authentication settings, confirmation may be required from both your current and new email addresses.",
    "Email change failed",
    "Email change failed.",
  ),
}) satisfies GProntoFrameworkAuthenticationMessageCatalog;

export const gProntoFrameworkMessageCatalog: GProntoFrameworkMessageCatalog =
  Object.freeze({
    Authentication: gProntoFrameworkAuthenticationMessageCatalog,
  });
