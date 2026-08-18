import { useRef, useState, type FormEvent } from "react";
import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import { useGProntoFrameworkAuthenticationOperation } from "../../gPronto.Framework.Authentication.Operations.Runner";
import { validateGProntoFrameworkValue } from "../../gPronto.Framework.DataResources.ValueValidation";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentInput } from "../gComponent.Input/gComponent.Input";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";

const emailValidationDescriptors = [
  { validator: "email.standard", options: null },
] as const;

export function GComponentAuthenticationEmailChange() {
  const formReference = useRef<HTMLFormElement>(null);
  const [newEmail, setNewEmail] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState<string>();
  const emailValidationIsActive = useRef(false);
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("EmailChange");

  const newEmailIsMissing = newEmail.trim().length === 0;

  const validateEmail = (value: string): boolean => {
    const validationResult = validateGProntoFrameworkValue(
      value.trim(),
      emailValidationDescriptors,
    );

    setEmailValidationError(
      validationResult.valid ? undefined : validationResult.errors[0].message,
    );
    return validationResult.valid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAttemptedSubmit(true);
    emailValidationIsActive.current = true;
    const emailIsValid = validateEmail(newEmail);

    if (newEmailIsMissing || !emailIsValid) {
      return;
    }

    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Change.Email.Function(
        newEmail.trim(),
      ),
    );
  };

  return (
    <form
      ref={formReference}
      className="gcomponent-authentication-email-change"
      noValidate
      onSubmit={handleSubmit}
    >
      <GComponentFlow direction="vertical">
        <GComponentInput
          kind="email"
          label="New email"
          name="new-email"
          value={newEmail}
          onChange={(value) => {
            setNewEmail(value);
            if (emailValidationIsActive.current) {
              validateEmail(value);
            }
          }}
          onBlur={() => {
            emailValidationIsActive.current = true;
            validateEmail(newEmail);
          }}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && newEmailIsMissing
              ? "New email is required."
              : emailValidationError
          }
        />
        <GComponentButton
          variant={
            authenticationOperation.isRunning
              ? "primary-loading"
              : newEmailIsMissing
                ? "primary-disabled"
                : "primary"
          }
          text="Change email"
          onClick={() => formReference.current?.requestSubmit()}
          icon="AuthenticationEmailChange"
        />
      </GComponentFlow>
    </form>
  );
}
