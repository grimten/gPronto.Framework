import { GProntoFrameworkApplicationRootComponent } from "../../gPronto.Framework.ApplicationRoot.PublicComponent";
import { useGProntoFrameworkAuthenticationOperation } from "../../gPronto.Framework.Authentication.Operations.Runner";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";
import { GComponentTypography } from "../gComponent.Typography/gComponent.Typography";

export function GComponentAuthenticationSignOut() {
  const authenticationOperation =
    useGProntoFrameworkAuthenticationOperation("SignOut");

  const handleSignOut = async () => {
    await authenticationOperation.run(() =>
      GProntoFrameworkApplicationRootComponent.Authentication.Sign.Out.Function(),
    );
  };

  return (
    <div className="gcomponent-authentication-sign-out">
      <GComponentFlow direction="vertical">
        <GComponentTypography
          text="Sign out of the current application on this device."
          variant="normal"
        />
        <GComponentButton
          variant={
            authenticationOperation.isRunning ? "danger-loading" : "danger"
          }
          text="Sign out"
          onClick={handleSignOut}
          icon="AuthenticationSignOut"
        />
      </GComponentFlow>
    </div>
  );
}
