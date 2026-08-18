import { useState, type FormEvent } from "react";
import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import { useGProntoFrameworkAuthenticationOperation } from "../../gPronto.Framework.Authentication.Operations.Runner";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentInput } from "../gComponent.Input/gComponent.Input";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";

export function GComponentAuthenticationInvitationAcceptance() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const authenticationOperation = useGProntoFrameworkAuthenticationOperation(
    "InvitationAcceptance",
  );

  const passwordIsMissing = password.length === 0;
  const passwordConfirmationIsMissing = passwordConfirmation.length === 0;
  const passwordsDoNotMatch = password !== passwordConfirmation;

  const submitInvitationAcceptance = async () => {
    setAttemptedSubmit(true);

    if (
      passwordIsMissing ||
      passwordConfirmationIsMissing ||
      passwordsDoNotMatch
    ) {
      return;
    }

    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Accept.Invitation.Function(
        password,
      ),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitInvitationAcceptance();
  };

  return (
    <form
      className="gcomponent-authentication-invitation-acceptance"
      noValidate
      onSubmit={handleSubmit}
    >
      <GComponentFlow direction="vertical">
        <GComponentInput
          kind="password"
          label="Password"
          name="password"
          value={password}
          onChange={setPassword}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && passwordIsMissing
              ? "Password is required."
              : undefined
          }
        />
        <GComponentInput
          kind="password"
          label="Confirm password"
          name="password-confirmation"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && passwordConfirmationIsMissing
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
          text="Accept invitation"
          onClick={() => void submitInvitationAcceptance()}
          icon="AuthenticationInvitationAccept"
        />
      </GComponentFlow>
    </form>
  );
}
