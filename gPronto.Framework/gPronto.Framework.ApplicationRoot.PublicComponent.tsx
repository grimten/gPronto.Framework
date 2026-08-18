import { useEffect, useSyncExternalStore, type ReactElement } from "react";
import { GProntoFrameworkApplicationRootComponent as GProntoFrameworkApplicationRootRenderingComponent } from "./gPronto.Framework.ApplicationRoot.Component";
import type { GProntoFrameworkApplicationRootComponentProps } from "./gPronto.Framework.ApplicationRoot.ComponentPropsContract";
import {
  gProntoFrameworkApplicationRootPublicProperties,
  type GProntoFrameworkApplicationRootPublicProperties,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesInterface";
import {
  getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  subscribeToGProntoFrameworkApplicationRootPublicProperties,
} from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import { gProntoFrameworkAuthenticationPublicInterface } from "./gPronto.Framework.Authentication.PublicInterface";
import type { GProntoFrameworkAuthenticationPublicProperties } from "./gPronto.Framework.Authentication.PublicContract";
import { startGProntoFrameworkAuthenticationRuntime } from "./gPronto.Framework.Authentication.Runtime";
import { initializeGProntoFrameworkSupabaseBrowserClient } from "./gPronto.Framework.Supabase.BrowserClient";
import {
  getGProntoFrameworkAuthenticationStateSnapshot,
  subscribeToGProntoFrameworkAuthenticationState,
} from "./gPronto.Framework.Authentication.StateStore";
import { formatGProntoFrameworkValue } from "./gPronto.Framework.DataResources.FormatCreation";
import { gProntoFrameworkTypeFormatDefaults } from "./gPronto.Framework.DataResources.TypeFormatDefaults";
import {
  decodeGProntoFrameworkValue,
  encodeGProntoFrameworkValue,
} from "./gPronto.Framework.DataResources.ValueCodec";
import { gProntoFrameworkValueCodecCatalog } from "./gPronto.Framework.DataResources.ValueCodecRegistry";
import { validateGProntoFrameworkValue } from "./gPronto.Framework.DataResources.ValueValidation";
import { gProntoFrameworkValidatorCatalog } from "./gPronto.Framework.DataResources.ValidationRegistry";
import { startGProntoFrameworkLogsRuntime } from "./gPronto.Framework.Logs.Runtime";
import { startGProntoFrameworkUserEventRuntime } from "./gPronto.Framework.UserEvents.Runtime";
import { startGProntoFrameworkUserSessionHeartbeatRuntime } from "./gPronto.Framework.UserSessionHeartbeat.Runtime";
import { gProntoFrameworkStylesPublicInterface } from "./gPronto.Framework.Styles.PublicInterface";
import { notifyGProntoFramework } from "./gPronto.Framework.ApplicationRoot.NotificationCreation";
import { gProntoFrameworkMessageCatalog } from "./gPronto.Framework.ApplicationRoot.MessageDefaults";

type GProntoFrameworkApplicationRootPublicComponent = ((
  props: GProntoFrameworkApplicationRootComponentProps,
) => ReactElement) &
  GProntoFrameworkApplicationRootPublicProperties &
  GProntoFrameworkAuthenticationPublicProperties & {
    readonly Codecs: typeof gProntoFrameworkValueCodecCatalog;
    readonly Decode: typeof decodeGProntoFrameworkValue;
    readonly Encode: typeof encodeGProntoFrameworkValue;
    readonly Format: typeof formatGProntoFrameworkValue;
    readonly Formats: typeof gProntoFrameworkTypeFormatDefaults;
    readonly Messages: typeof gProntoFrameworkMessageCatalog;
    readonly Notify: typeof notifyGProntoFramework;
    readonly Styles: typeof gProntoFrameworkStylesPublicInterface;
    readonly Validate: typeof validateGProntoFrameworkValue;
    readonly Validators: typeof gProntoFrameworkValidatorCatalog;
  };

function GProntoFrameworkApplicationRootPublicComponentImplementation(
  props: GProntoFrameworkApplicationRootComponentProps,
): ReactElement {
  const supabaseClient = initializeGProntoFrameworkSupabaseBrowserClient(
    props.application.supabase,
  );

  useSyncExternalStore(
    subscribeToGProntoFrameworkApplicationRootPublicProperties,
    getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  );

  useSyncExternalStore(
    subscribeToGProntoFrameworkAuthenticationState,
    getGProntoFrameworkAuthenticationStateSnapshot,
  );

  useEffect(
    () => startGProntoFrameworkAuthenticationRuntime(supabaseClient),
    [supabaseClient],
  );

  useEffect(
    () => startGProntoFrameworkUserSessionHeartbeatRuntime(supabaseClient),
    [supabaseClient],
  );

  useEffect(
    () => startGProntoFrameworkLogsRuntime(supabaseClient),
    [supabaseClient],
  );

  useEffect(
    () => startGProntoFrameworkUserEventRuntime(supabaseClient),
    [supabaseClient],
  );

  return <GProntoFrameworkApplicationRootRenderingComponent {...props} />;
}

Object.defineProperties(
  GProntoFrameworkApplicationRootPublicComponentImplementation,
  {
    User: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkApplicationRootPublicProperties.User,
      writable: false,
    },
    Organisation: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkApplicationRootPublicProperties.Organisation,
      writable: false,
    },
    Session: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkApplicationRootPublicProperties.Session,
      writable: false,
    },
    Authentication: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkAuthenticationPublicInterface,
      writable: false,
    },
    Codecs: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkValueCodecCatalog,
      writable: false,
    },
    Decode: {
      configurable: false,
      enumerable: true,
      value: decodeGProntoFrameworkValue,
      writable: false,
    },
    Encode: {
      configurable: false,
      enumerable: true,
      value: encodeGProntoFrameworkValue,
      writable: false,
    },
    Format: {
      configurable: false,
      enumerable: true,
      value: formatGProntoFrameworkValue,
      writable: false,
    },
    Formats: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkTypeFormatDefaults,
      writable: false,
    },
    Messages: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkMessageCatalog,
      writable: false,
    },
    Notify: {
      configurable: false,
      enumerable: true,
      value: notifyGProntoFramework,
      writable: false,
    },
    Styles: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkStylesPublicInterface,
      writable: false,
    },
    Validate: {
      configurable: false,
      enumerable: true,
      value: validateGProntoFrameworkValue,
      writable: false,
    },
    Validators: {
      configurable: false,
      enumerable: true,
      value: gProntoFrameworkValidatorCatalog,
      writable: false,
    },
    AuthenticationStatus: {
      configurable: false,
      enumerable: true,
      get: () => getGProntoFrameworkAuthenticationStateSnapshot().Status,
    },
    AuthenticationErrorMessage: {
      configurable: false,
      enumerable: true,
      get: () => getGProntoFrameworkAuthenticationStateSnapshot().ErrorMessage,
    },
  },
);

export const GProntoFrameworkApplicationRootComponent =
  GProntoFrameworkApplicationRootPublicComponentImplementation as GProntoFrameworkApplicationRootPublicComponent;
