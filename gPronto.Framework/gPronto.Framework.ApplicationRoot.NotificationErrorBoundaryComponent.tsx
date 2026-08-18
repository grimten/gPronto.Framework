import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportGProntoFrameworkError } from "./gPronto.Framework.ApplicationRoot.NotificationErrorCreation";

type GProntoFrameworkNotificationErrorBoundaryComponentProps = Readonly<{
  children: ReactNode;
}>;

type GProntoFrameworkNotificationErrorBoundaryComponentState = Readonly<{
  failed: boolean;
}>;

export class GProntoFrameworkNotificationErrorBoundaryComponent extends Component<
  GProntoFrameworkNotificationErrorBoundaryComponentProps,
  GProntoFrameworkNotificationErrorBoundaryComponentState
> {
  public state: GProntoFrameworkNotificationErrorBoundaryComponentState = {
    failed: false,
  };

  public static getDerivedStateFromError(): GProntoFrameworkNotificationErrorBoundaryComponentState {
    return { failed: true };
  }

  public componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    reportGProntoFrameworkError(
      error,
      "The gPronto.Framework application root could not render.",
    );
  }

  public render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
