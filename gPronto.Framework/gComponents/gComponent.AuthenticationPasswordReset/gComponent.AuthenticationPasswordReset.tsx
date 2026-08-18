import { useRef, useState, type FormEvent } from "react";
import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import { useGProntoFrameworkAuthenticationOperation } from "../../gPronto.Framework.Authentication.Operations.Runner";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentInput } from "../gComponent.Input/gComponent.Input";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";

export function GComponentAuthenticationPasswordReset() {
  const formReference = useRef<HTMLFormElement>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("PasswordReset");

  const newPasswordIsMissing = newPassword.length === 0;
  const newPasswordConfirmationIsMissing = newPasswordConfirmation.length === 0;
  const passwordsDoNotMatch =
    !newPasswordIsMissing &&
    !newPasswordConfirmationIsMissing &&
    newPassword !== newPasswordConfirmation;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAttemptedSubmit(true);

    if (
      newPasswordIsMissing ||
      newPasswordConfirmationIsMissing ||
      passwordsDoNotMatch
    ) {
      return;
    }

    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Reset.Password.Function(
        newPassword,
      ),
    );
  };

  return (
    <form
      ref={formReference}
      className="gcomponent-authentication-password-reset"
      noValidate
      onSubmit={handleSubmit}
    >
      <GComponentFlow direction="vertical">
        <GComponentInput
          kind="password"
          label="New password"
          name="new-password"
          value={newPassword}
          onChange={setNewPassword}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && newPasswordIsMissing
              ? "New password is required."
              : undefined
          }
        />
        <GComponentInput
          kind="password"
          label="Confirm new password"
          name="new-password-confirmation"
          value={newPasswordConfirmation}
          onChange={setNewPasswordConfirmation}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && newPasswordConfirmationIsMissing
              ? "Password confirmation is required."
              : attemptedSubmit && passwordsDoNotMatch
                ? "Passwords do not match."
                : undefined
          }
        />
        <GComponentButton
          variant={
            authenticationOperation.isRunning ? "primary-loading" : "primary"
          }
          text="Reset password"
          onClick={() => formReference.current?.requestSubmit()}
          icon="AuthenticationPasswordReset"
        />
      </GComponentFlow>
    </form>
  );
}
