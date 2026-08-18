import { gProntoFrameworkAuthenticationCreateUser } from "./gPronto.Framework.Authentication.Administration.CreateUser";
import { gProntoFrameworkAuthenticationDeleteUser } from "./gPronto.Framework.Authentication.Administration.DeleteUser";
import { gProntoFrameworkAuthenticationInviteUser } from "./gPronto.Framework.Authentication.Administration.InviteUser";
import { gProntoFrameworkAuthenticationUpdateUser } from "./gPronto.Framework.Authentication.Administration.UpdateUser";
import { gProntoFrameworkAuthenticationAcceptInvitation } from "./gPronto.Framework.Authentication.Operations.AcceptInvitation";
import { gProntoFrameworkAuthenticationChangeEmail } from "./gPronto.Framework.Authentication.Operations.ChangeEmail";
import { gProntoFrameworkAuthenticationChangePassword } from "./gPronto.Framework.Authentication.Operations.ChangePassword";
import { gProntoFrameworkAuthenticationReauthenticate } from "./gPronto.Framework.Authentication.Operations.Reauthenticate";
import { gProntoFrameworkAuthenticationResendEmailConfirmation } from "./gPronto.Framework.Authentication.Operations.ResendEmailConfirmation";
import { gProntoFrameworkAuthenticationResetPassword } from "./gPronto.Framework.Authentication.Operations.ResetPassword";
import { gProntoFrameworkAuthenticationSendMagicLink } from "./gPronto.Framework.Authentication.Operations.SendMagicLink";
import { gProntoFrameworkAuthenticationSendPasswordRecovery } from "./gPronto.Framework.Authentication.Operations.SendPasswordRecovery";
import { gProntoFrameworkAuthenticationSignIn } from "./gPronto.Framework.Authentication.Operations.SignIn";
import { gProntoFrameworkAuthenticationSignOut } from "./gPronto.Framework.Authentication.Operations.SignOut";
import { gProntoFrameworkAuthenticationSignUp } from "./gPronto.Framework.Authentication.Operations.SignUp";
import { gProntoFrameworkAuthenticationVerifyEmailLink } from "./gPronto.Framework.Authentication.Operations.VerifyEmailLink";
import type { GProntoFrameworkAuthenticationPublicInterface } from "./gPronto.Framework.Authentication.PublicContract";

function freezeFunction<
  FunctionType extends (...arguments_: never[]) => unknown,
>(Function: FunctionType): Readonly<{ Function: FunctionType }> {
  return Object.freeze({ Function });
}

export const gProntoFrameworkAuthenticationPublicInterface: GProntoFrameworkAuthenticationPublicInterface =
  Object.freeze({
    Sign: Object.freeze({
      Up: freezeFunction(gProntoFrameworkAuthenticationSignUp),
      In: freezeFunction(gProntoFrameworkAuthenticationSignIn),
      Out: freezeFunction(gProntoFrameworkAuthenticationSignOut),
    }),
    Send: Object.freeze({
      MagicLink: freezeFunction(gProntoFrameworkAuthenticationSendMagicLink),
      PasswordRecovery: freezeFunction(
        gProntoFrameworkAuthenticationSendPasswordRecovery,
      ),
    }),
    Reset: Object.freeze({
      Password: freezeFunction(gProntoFrameworkAuthenticationResetPassword),
    }),
    Change: Object.freeze({
      Password: freezeFunction(gProntoFrameworkAuthenticationChangePassword),
      Email: freezeFunction(gProntoFrameworkAuthenticationChangeEmail),
    }),
    Resend: Object.freeze({
      EmailConfirmation: freezeFunction(
        gProntoFrameworkAuthenticationResendEmailConfirmation,
      ),
    }),
    Accept: Object.freeze({
      Invitation: freezeFunction(
        gProntoFrameworkAuthenticationAcceptInvitation,
      ),
    }),
    Verify: Object.freeze({
      EmailLink: freezeFunction(gProntoFrameworkAuthenticationVerifyEmailLink),
    }),
    Reauthenticate: freezeFunction(
      gProntoFrameworkAuthenticationReauthenticate,
    ),
    Create: Object.freeze({
      User: freezeFunction(gProntoFrameworkAuthenticationCreateUser),
    }),
    Invite: Object.freeze({
      User: freezeFunction(gProntoFrameworkAuthenticationInviteUser),
    }),
    Update: Object.freeze({
      User: freezeFunction(gProntoFrameworkAuthenticationUpdateUser),
    }),
    Delete: Object.freeze({
      User: freezeFunction(gProntoFrameworkAuthenticationDeleteUser),
    }),
  });
