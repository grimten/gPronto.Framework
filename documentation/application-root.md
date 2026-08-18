# Application root

## Status

Draft

## Scope

gPronto.Framework:The public application-root component name, props, and application definition.
gPronto.Framework:The public properties exposed through the application-root component.
gPronto.Framework:The public `User`, `Organisation`, and `Session` property shapes.
gPronto.Framework:The public Authentication status and error-message values.
gPronto.Framework:The public Authentication function tree.
gPronto.Framework:Excludes application bootstrap files and Authentication state synchronization.
gPronto.Framework:Excludes the internal behavior of subsystems exposed through the component.

## Verification

Date: 2026-08-18

## Rules

<rule category="component" id="component-name">

The public application-root component **MUST** be named `GProntoFrameworkApplicationRootComponent`.

</rule>

<rule category="component" id="component-props">

The application-root component **MUST** receive exactly one `application` prop.

</rule>

<rule category="application-definition" id="application-definition">

The application definition **MUST** contain `styling`, `webpages`, and `supabase`.

</rule>

<rule category="public-properties" id="public-properties">

The application-root component **MUST** expose `User`, `Organisation`, `Session`, `Authentication`, `Codecs`, `Decode`, `Encode`, `Format`, `Formats`, `Messages`, `Notify`, `Styles`, `Validate`, `Validators`, `AuthenticationStatus`, and `AuthenticationErrorMessage`.

The `User`, `Organisation`, and `Session` objects **MUST** be non-extensible.

The property descriptors for `User`, `Organisation`, `Session`, `Authentication`, `Codecs`, `Decode`, `Encode`, `Format`, `Formats`, `Messages`, `Notify`, `Styles`, `Validate`, and `Validators` on `GProntoFrameworkApplicationRootComponent` **MUST** have `writable: false` and `configurable: false`.

Every listed `User` and `Organisation` field **MUST** be readable and writable. `Session.SessionId` **MUST** be readable and **MUST NOT** be writable.

Every `User` and `Organisation` field **MUST** be a string and **MUST** default to `-`.

`Session.SessionId` **MUST** be a readonly string and **MUST** default to `-`.

</rule>

<rule category="authentication-state" id="authentication-status">

`AuthenticationStatus` **MUST** be exactly `Initializing`, `SignedOut`, `SignedIn`, or `Failure`.

</rule>

<rule category="authentication-state" id="authentication-error-message">

`AuthenticationErrorMessage` **MUST** be `-` when the authentication status is not `Failure`.

</rule>

<rule category="authentication-interface" id="authentication-interface">

Every leaf object in the authentication function tree **MUST** have exactly one own property named `Function`. Every object in the authentication function tree **MUST** satisfy `Object.isFrozen(value) === true`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-application-root">

The **Agent** **MUST** validate these **Rules** against the current **gPronto.Framework** public application-root contract and implementation:

- `application-root.md: rule:[component-name]`
- `application-root.md: rule:[component-props]`
- `application-root.md: rule:[application-definition]`
- `application-root.md: rule:[public-properties]`
- `application-root.md: rule:[authentication-status]`
- `application-root.md: rule:[authentication-error-message]`
- `application-root.md: rule:[authentication-interface]`

For each listed **Rule**, the **Agent** **MUST** validate the **Rule** exactly as written.

When a validation fails, the **Agent** **MUST** mark the text containing the failed requirement by applying `documentation.md: rule:[documentation-tag-requirements]`. The `agent-error-explanation` **MUST** identify every affected **gPronto.Framework** file and reason for failure.

When every validation passes, the **Agent** **MUST** remove obsolete `agent-error` and `agent-error-explanation` tags and **MUST NOT** add a new validation-error tag.

</instructions>

## Component

`GProntoFrameworkApplicationRootComponent` is the public application-root component.

Its props have this shape:

```ts
{
  application: {
    styling: "gStyling-1" | "gStyling-2";
    webpages: GProntoFrameworkRegisteredWebpageDefinitionRegistry;
    supabase: {
      SupabaseUrl: string;
      SupabasePublishableKey: string;
    }
  }
}
```

## Public properties

| Property                     | Type or value                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `User`                       | `GProntoFrameworkApplicationRootUser`                                                                               |
| `Organisation`               | `GProntoFrameworkApplicationRootOrganisation`                                                                       |
| `Session`                    | `GProntoFrameworkApplicationRootSession`                                                                            |
| `Authentication`             | `GProntoFrameworkAuthenticationPublicInterface`                                                                     |
| `Codecs`                     | Immutable value-codec catalog                                                                                       |
| `Decode`                     | `(value: unknown, descriptor) => GProntoFrameworkValueCodecResult`                                                  |
| `Encode`                     | `(value: unknown, descriptor) => GProntoFrameworkValueCodecResult`                                                  |
| `Format`                     | `(value: unknown, format: string) => string \| undefined`                                                           |
| `Formats`                    | Immutable format catalog                                                                                            |
| `Messages`                   | Immutable message catalog                                                                                           |
| `Notify`                     | `(request: GProntoFrameworkNotificationRequest) => void`                                                            |
| `Styles`                     | Immutable object containing `Icons`                                                                                 |
| `Validate`                   | `(value: unknown, validators: readonly GProntoFrameworkValidationDescriptor[]) => GProntoFrameworkValidationResult` |
| `Validators`                 | Immutable validator catalog                                                                                         |
| `AuthenticationStatus`       | `Initializing`, `SignedOut`, `SignedIn`, or `Failure`                                                               |
| `AuthenticationErrorMessage` | `string`                                                                                                            |

The property objects are stable. Reading a property returns its current value without replacing the containing public object.

`Codecs`, `Formats`, `Messages`, and `Validators` are immutable catalogs. `Decode`, `Encode`, `Format`, `Notify`, and `Validate` are stable function values.

The assignment and publication behavior of Authentication-owned public values is defined in [Application-root state](application-root-state.md).

`User` and `Organisation` expose getters and setters for their listed fields. `Session` exposes a getter and no setter for `SessionId`.

## User

Every `User` property is a string.

| Property          | Default |
| ----------------- | ------- |
| `UserId`          | `-`     |
| `AuthUserId`      | `-`     |
| `Email`           | `-`     |
| `FirstName`       | `-`     |
| `LastName`        | `-`     |
| `Role`            | `-`     |
| `RoleApplication` | `-`     |
| `RolePrototype`   | `-`     |
| `OrganisationId`  | `-`     |
| `ProfileUrl`      | `-`     |
| `Language`        | `-`     |
| `Locale`          | `-`     |
| `CurrencyCode`    | `-`     |
| `DateFormat`      | `-`     |
| `DatetimeFormat`  | `-`     |
| `CurrencyFormat`  | `-`     |
| `Blocked`         | `-`     |
| `CanInitiate`     | `-`     |
| `CanProcess`      | `-`     |
| `Kyc`             | `-`     |
| `Settings`        | `-`     |

## Organisation

Every `Organisation` property is a string.

| Property         | Default |
| ---------------- | ------- |
| `OrganisationId` | `-`     |
| `Name`           | `-`     |
| `Type`           | `-`     |
| `ProfileUrl`     | `-`     |
| `Kyb`            | `-`     |
| `Settings`       | `-`     |

## Session

`Session` has one readonly string property:

| Property    | Default |
| ----------- | ------- |
| `SessionId` | `-`     |

## Authentication state

`AuthenticationStatus` has exactly four values:

| Value          | Meaning                                    |
| -------------- | ------------------------------------------ |
| `Initializing` | Authentication state is being established. |
| `SignedOut`    | No authenticated session is active.        |
| `SignedIn`     | An authenticated session is active.        |
| `Failure`      | Authentication initialization failed.      |

`AuthenticationErrorMessage` is `-` unless the status is `Failure`. A failure contains the available error message or `Authentication failed.`.

## Authentication function tree

Every leaf below is an immutable object containing one `Function` property.

- `Authentication.Sign.Up.Function`
- `Authentication.Sign.In.Function`
- `Authentication.Sign.Out.Function`
- `Authentication.Send.MagicLink.Function`
- `Authentication.Send.PasswordRecovery.Function`
- `Authentication.Reset.Password.Function`
- `Authentication.Change.Password.Function`
- `Authentication.Change.Email.Function`
- `Authentication.Resend.EmailConfirmation.Function`
- `Authentication.Accept.Invitation.Function`
- `Authentication.Verify.EmailLink.Function`
- `Authentication.Reauthenticate.Function`
- `Authentication.Create.User.Function`
- `Authentication.Invite.User.Function`
- `Authentication.Update.User.Function`
- `Authentication.Delete.User.Function`

