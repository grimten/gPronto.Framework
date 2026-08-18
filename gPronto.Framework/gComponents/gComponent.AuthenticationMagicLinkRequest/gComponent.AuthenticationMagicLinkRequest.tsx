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

export function GComponentAuthenticationMagicLinkRequest() {
  const [email, setEmail] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState<string>();
  const emailValidationIsActive = useRef(false);
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("MagicLinkRequest");

  const emailIsMissing = email.trim().length === 0;

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

  const requestMagicLink = async () => {
    setAttemptedSubmit(true);
    emailValidationIsActive.current = true;
    const emailIsValid = validateEmail(email);

    if (emailIsMissing || !emailIsValid) {
      return;
    }

    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Send.MagicLink.Function(
        email.trim(),
      ),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void requestMagicLink();
  };

  return (
    <form
      className="gcomponent-authentication-magic-link-request"
      noValidate
      onSubmit={handleSubmit}
    >
      <GComponentFlow direction="vertical">
        <GComponentInput
          kind="email"
          label="Email"
          name="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            if (emailValidationIsActive.current) {
              validateEmail(value);
            }
          }}
          onBlur={() => {
            emailValidationIsActive.current = true;
            validateEmail(email);
          }}
          required
          disabled={authenticationOperation.isRunning}
          error={
            attemptedSubmit && emailIsMissing
              ? "Email is required."
              : emailValidationError
          }
        />
        <GComponentButton
          variant={
            authenticationOperation.isRunning
              ? "primary-loading"
              : emailIsMissing
                ? "primary-disabled"
                : "primary"
          }
          text="Send magic link"
          onClick={() => void requestMagicLink()}
          icon="AuthenticationMagicLinkRequest"
        />
      </GComponentFlow>
    </form>
  );
}
