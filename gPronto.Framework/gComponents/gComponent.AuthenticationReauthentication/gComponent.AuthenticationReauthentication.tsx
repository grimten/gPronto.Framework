import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import { useGProntoFrameworkAuthenticationOperation } from "../../gPronto.Framework.Authentication.Operations.Runner";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";
import { GComponentTypography } from "../gComponent.Typography/gComponent.Typography";

export function GComponentAuthenticationReauthentication() {
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("Reauthentication");

  const handleReauthentication = async () => {
    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Reauthenticate.Function(),
    );
  };

  return (
    <div className="gcomponent-authentication-reauthentication">
      <GComponentFlow direction="vertical">
        <GComponentTypography
          text="Request a new verification code before completing a sensitive operation."
          variant="normal"
        />
        <GComponentButton
          variant={
            authenticationOperation.isRunning ? "primary-loading" : "primary"
          }
          text="Reauthenticate"
          onClick={handleReauthentication}
          icon="AuthenticationReauthenticate"
        />
      </GComponentFlow>
    </div>
  );
}
