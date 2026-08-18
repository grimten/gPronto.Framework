import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { createRoot, type Root } from "react-dom/client";
import { reportGProntoFrameworkError } from "./gPronto.Framework.ApplicationRoot.NotificationErrorCreation";
import { GProntoFrameworkNotificationHostComponent } from "./gPronto.Framework.ApplicationRoot.NotificationHostComponent";
import type { GProntoFrameworkStyling } from "./gPronto.Framework.Styles.StylingContract";

type GProntoFrameworkNotificationRuntime = Readonly<{
  applyStyling: (styling: GProntoFrameworkStyling) => void;
}>;

type ActiveGProntoFrameworkNotificationRuntime = {
  readonly root: Root;
  styling: GProntoFrameworkStyling | undefined;
};

const runtimes = new WeakMap<Document, GProntoFrameworkNotificationRuntime>();

function renderNotificationHost(
  runtime: ActiveGProntoFrameworkNotificationRuntime,
): void {
  const styling = runtime.styling;

  runtime.root.render(
    <StyledEngineProvider injectFirst>
      {styling === undefined ? null : (
        <style data-gpronto-styling={styling.identifier}>{styling.css}</style>
      )}
      <GProntoFrameworkNotificationHostComponent />
    </StyledEngineProvider>,
  );
}

function createNotificationRuntime(
  browserDocument: Document,
): GProntoFrameworkNotificationRuntime {
  const hostElement = browserDocument.createElement("div");
  hostElement.dataset.gprontoNotificationHost = "";

  const hostParent = browserDocument.body ?? browserDocument.documentElement;

  if (hostParent === null) {
    throw new Error(
      "The browser document cannot host framework notifications.",
    );
  }

  hostParent.append(hostElement);

  const activeRuntime: ActiveGProntoFrameworkNotificationRuntime = {
    root: createRoot(hostElement),
    styling: undefined,
  };

  renderNotificationHost(activeRuntime);

  browserDocument.defaultView?.addEventListener("error", (event) => {
    const error =
      event.error ??
      (event.message.trim().length > 0
        ? event.message
        : "An unhandled browser error occurred.");

    reportGProntoFrameworkError(error, "An unhandled browser error occurred.");
  });

  browserDocument.defaultView?.addEventListener(
    "unhandledrejection",
    (event) => {
      reportGProntoFrameworkError(
        event.reason,
        "An unhandled promise rejection occurred.",
      );
    },
  );

  return Object.freeze({
    applyStyling(styling: GProntoFrameworkStyling): void {
      activeRuntime.styling = styling;
      renderNotificationHost(activeRuntime);
    },
  });
}

export function startGProntoFrameworkNotificationRuntime(
  browserDocument: Document,
): GProntoFrameworkNotificationRuntime {
  const existingRuntime = runtimes.get(browserDocument);

  if (existingRuntime !== undefined) {
    return existingRuntime;
  }

  const runtime = createNotificationRuntime(browserDocument);
  runtimes.set(browserDocument, runtime);
  return runtime;
}
