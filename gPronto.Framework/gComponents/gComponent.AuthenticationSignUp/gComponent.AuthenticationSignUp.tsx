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

export function GComponentAuthenticationSignUp() {
  const formReference = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState<string>();
  const emailValidationIsActive = useRef(false);
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("SignUp");

  const emailIsMissing = email.trim().length === 0;
  const passwordIsMissing = password.length === 0;
  const passwordConfirmationIsMissing = passwordConfirmation.length === 0;
  const passwordsDoNotMatch =
    !passwordIsMissing &&
    !passwordConfirmationIsMissing &&
    password !== passwordConfirmation;
  const formIsInvalid =
    emailIsMissing ||
    passwordIsMissing ||
    passwordConfirmationIsMissing ||
    passwordsDoNotMatch;

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
    const emailIsValid = validateEmail(email);

    if (formIsInvalid || !emailIsValid) {
      return;
    }

    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Sign.Up.Function(
        email.trim(),
        password,
      ),
    );
  };

  return (
    <form
      ref={formReference}
      className="gcomponent-authentication-sign-up"
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
          text="Sign up"
          onClick={() => formReference.current?.requestSubmit()}
          icon="AuthenticationSignUp"
        />
      </GComponentFlow>
    </form>
  );
}
