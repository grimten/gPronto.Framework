import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { GProntoFrameworkApplicationDefinition } from "./gPronto.Framework.ApplicationRoot.ApplicationDefinitionContract";
import type { GProntoFrameworkApplicationBootstrapRequest } from "./gPronto.Framework.ApplicationRoot.BootstrapContract";
import { reportGProntoFrameworkError } from "./gPronto.Framework.ApplicationRoot.NotificationErrorCreation";
import { GProntoFrameworkNotificationErrorBoundaryComponent } from "./gPronto.Framework.ApplicationRoot.NotificationErrorBoundaryComponent";
import { startGProntoFrameworkNotificationRuntime } from "./gPronto.Framework.ApplicationRoot.NotificationRuntime";
import { GProntoFrameworkApplicationRootComponent } from "./gPronto.Framework.ApplicationRoot.PublicComponent";
import { createGProntoFrameworkRegisteredWebpageDefinitionRegistryFromModules } from "./gPronto.Framework.RegisteredWebpages.ModuleRegistryCreation";
import { resolveGProntoFrameworkStyling } from "./gPronto.Framework.Styles.StylingRegistry";
import { validateGProntoFrameworkSupabaseConfiguration } from "./gPronto.Framework.Supabase.ConfigurationValidation";

const completedBootstrapDocuments = new WeakSet<Document>();

export function bootstrapGProntoFrameworkApplication(
  request: GProntoFrameworkApplicationBootstrapRequest,
): void {
  const notificationRuntime =
    startGProntoFrameworkNotificationRuntime(document);
  let root: Root | undefined;

  try {
    if (completedBootstrapDocuments.has(document)) {
      throw new Error(
        "The gPronto.Framework application has already been bootstrapped for this document.",
      );
    }

    const rootElement = document.getElementById("root");

    if (rootElement === null) {
      throw new Error("The application root element is missing.");
    }

    const styling = resolveGProntoFrameworkStyling(request.styling);
    notificationRuntime.applyStyling(styling);
    const supabase = validateGProntoFrameworkSupabaseConfiguration(
      request.supabase,
    );
    const webpages =
      createGProntoFrameworkRegisteredWebpageDefinitionRegistryFromModules(
        request.webpageModules,
      );
    const application: GProntoFrameworkApplicationDefinition = {
      styling: request.styling,
      webpages,
      supabase,
    };
    root = createRoot(rootElement);

    root.render(
      <GProntoFrameworkNotificationErrorBoundaryComponent>
        <StrictMode>
          <GProntoFrameworkApplicationRootComponent application={application} />
        </StrictMode>
      </GProntoFrameworkNotificationErrorBoundaryComponent>,
    );

    completedBootstrapDocuments.add(document);
  } catch (error) {
    if (root !== undefined) {
      try {
        root.unmount();
      } catch {
        // Preserve the original bootstrap error.
      }
    }

    reportGProntoFrameworkError(
      error,
      "The gPronto.Framework application could not be bootstrapped.",
    );
    throw error;
  }
}
