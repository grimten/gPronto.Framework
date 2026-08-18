import { useRef, useState, type FormEvent } from "react";
import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import { useGProntoFrameworkAuthenticationOperation } from "../../gPronto.Framework.Authentication.Operations.Runner";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentInput } from "../gComponent.Input/gComponent.Input";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";

export function GComponentAuthenticationPasswordChange() {
  const formReference = useRef<HTMLFormElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("PasswordChange");

  const currentPasswordIsMissing = currentPassword.length === 0;
  const newPasswordIsMissing = newPassword.length === 0;
  const newPasswordConfirmationIsMissing = newPasswordConfirmation.length === 0;
  const newPasswordsDoNotMatch =
    !newPasswordIsMissing &&
    !newPasswordConfirmationIsMissing &&
    newPassword !== newPasswordConfirmation;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAttemptedSubmit(true);

    if (
      currentPasswordIsMissing ||
      newPasswordIsMissing ||
      newPasswordConfirmationIsMissing ||
      newPasswordsDoNotMatch
    ) {
      return;
    }

    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Change.Password.Function(
        currentPassword,
        newPassword,
      ),
    );
  };

  return (
    <form
      ref={formReference}
      className="gcomponent-authentication-password-change"
      noValidate
      onSubmit={handleSubmit}
    >
      <GComponentFlow direction="vertical">
        <GComponentInput
          kind="password"
          label="Current password"
          name="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && currentPasswordIsMissing
              ? "Current password is required."
              : undefined
          }
        />
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
              : attemptedSubmit && newPasswordsDoNotMatch
                ? "New passwords must match."
                : undefined
          }
        />
        <GComponentButton
          variant={
            authenticationOperation.isRunning ? "primary-loading" : "primary"
          }
          text="Change password"
          onClick={() => formReference.current?.requestSubmit()}
          icon="AuthenticationPasswordChange"
        />
      </GComponentFlow>
    </form>
  );
}
