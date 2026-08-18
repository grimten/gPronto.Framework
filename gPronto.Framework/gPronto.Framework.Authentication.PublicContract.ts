import type { gProntoFrameworkAuthenticationCreateUser } from "./gPronto.Framework.Authentication.Administration.CreateUser";
import type { gProntoFrameworkAuthenticationDeleteUser } from "./gPronto.Framework.Authentication.Administration.DeleteUser";
import type { gProntoFrameworkAuthenticationInviteUser } from "./gPronto.Framework.Authentication.Administration.InviteUser";
import type { gProntoFrameworkAuthenticationUpdateUser } from "./gPronto.Framework.Authentication.Administration.UpdateUser";
import type { gProntoFrameworkAuthenticationAcceptInvitation } from "./gPronto.Framework.Authentication.Operations.AcceptInvitation";
import type { gProntoFrameworkAuthenticationChangeEmail } from "./gPronto.Framework.Authentication.Operations.ChangeEmail";
import type { gProntoFrameworkAuthenticationChangePassword } from "./gPronto.Framework.Authentication.Operations.ChangePassword";
import type { gProntoFrameworkAuthenticationReauthenticate } from "./gPronto.Framework.Authentication.Operations.Reauthenticate";
import type { gProntoFrameworkAuthenticationResendEmailConfirmation } from "./gPronto.Framework.Authentication.Operations.ResendEmailConfirmation";
import type { gProntoFrameworkAuthenticationResetPassword } from "./gPronto.Framework.Authentication.Operations.ResetPassword";
import type { gProntoFrameworkAuthenticationSendMagicLink } from "./gPronto.Framework.Authentication.Operations.SendMagicLink";
import type { gProntoFrameworkAuthenticationSendPasswordRecovery } from "./gPronto.Framework.Authentication.Operations.SendPasswordRecovery";
import type { gProntoFrameworkAuthenticationSignIn } from "./gPronto.Framework.Authentication.Operations.SignIn";
import type { gProntoFrameworkAuthenticationSignOut } from "./gPronto.Framework.Authentication.Operations.SignOut";
import type { gProntoFrameworkAuthenticationSignUp } from "./gPronto.Framework.Authentication.Operations.SignUp";
import type { gProntoFrameworkAuthenticationVerifyEmailLink } from "./gPronto.Framework.Authentication.Operations.VerifyEmailLink";
import type { GProntoFrameworkAuthenticationStatus } from "./gPronto.Framework.Authentication.StateContract";

export type GProntoFrameworkAuthenticationPublicInterface = {
  readonly Sign: {
    readonly Up: {
      readonly Function: typeof gProntoFrameworkAuthenticationSignUp;
    };
    readonly In: {
      readonly Function: typeof gProntoFrameworkAuthenticationSignIn;
    };
    readonly Out: {
      readonly Function: typeof gProntoFrameworkAuthenticationSignOut;
    };
  };
  readonly Send: {
    readonly MagicLink: {
      readonly Function: typeof gProntoFrameworkAuthenticationSendMagicLink;
    };
    readonly PasswordRecovery: {
      readonly Function: typeof gProntoFrameworkAuthenticationSendPasswordRecovery;
    };
  };
  readonly Reset: {
    readonly Password: {
      readonly Function: typeof gProntoFrameworkAuthenticationResetPassword;
    };
  };
  readonly Change: {
    readonly Password: {
      readonly Function: typeof gProntoFrameworkAuthenticationChangePassword;
    };
    readonly Email: {
      readonly Function: typeof gProntoFrameworkAuthenticationChangeEmail;
    };
  };
  readonly Resend: {
    readonly EmailConfirmation: {
      readonly Function: typeof gProntoFrameworkAuthenticationResendEmailConfirmation;
    };
  };
  readonly Accept: {
    readonly Invitation: {
      readonly Function: typeof gProntoFrameworkAuthenticationAcceptInvitation;
    };
  };
  readonly Verify: {
    readonly EmailLink: {
      readonly Function: typeof gProntoFrameworkAuthenticationVerifyEmailLink;
    };
  };
  readonly Reauthenticate: {
    readonly Function: typeof gProntoFrameworkAuthenticationReauthenticate;
  };
  readonly Create: {
    readonly User: {
      readonly Function: typeof gProntoFrameworkAuthenticationCreateUser;
    };
  };
  readonly Invite: {
    readonly User: {
      readonly Function: typeof gProntoFrameworkAuthenticationInviteUser;
    };
  };
  readonly Update: {
    readonly User: {
      readonly Function: typeof gProntoFrameworkAuthenticationUpdateUser;
    };
  };
  readonly Delete: {
    readonly User: {
      readonly Function: typeof gProntoFrameworkAuthenticationDeleteUser;
    };
  };
};

export type GProntoFrameworkAuthenticationPublicProperties = {
  readonly Authentication: GProntoFrameworkAuthenticationPublicInterface;
  readonly AuthenticationStatus: GProntoFrameworkAuthenticationStatus;
  readonly AuthenticationErrorMessage: string;
};
