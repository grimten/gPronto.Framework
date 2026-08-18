import { GComponentLoader } from "../gComponent.Loader/gComponent.Loader";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";
import { GComponentTypography } from "../gComponent.Typography/gComponent.Typography";

export type GComponentAuthenticationLoadingProps = Readonly<{
  message?: string;
}>;

export function GComponentAuthenticationLoading({
  message = "Authentication is loading.",
}: GComponentAuthenticationLoadingProps) {
  return (
    <div className="gcomponent-authentication-loading">
      <GComponentFlow direction="vertical">
        <GComponentLoader label={message} />
        <GComponentTypography text={message} variant="normal" />
      </GComponentFlow>
    </div>
  );
}
