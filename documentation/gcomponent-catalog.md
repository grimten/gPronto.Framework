# gComponent catalog

## Status

Draft

## Scope

gPronto.Framework:The current public **gComponent** catalog.
gPronto.Framework:The purpose and public inputs of each current **gComponent**.
gPronto.Framework:Excludes **gComponent** construction, implementation, styling, and detailed behavior requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="gcomponent-catalog-current">

The catalog **MUST** contain every public **gComponent** currently exported by **gPronto.Framework** and **MUST NOT** contain another component.

Every name, purpose, and public-input overview **MUST** match the current public source.

</rule>

<rule category="catalog" id="gcomponent-catalog-overview">

This document **MUST** describe only the current public **gComponent** inventory. It **MUST NOT** define how a **gComponent** is built, implemented, or styled.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-gcomponent-catalog">

The **Agent** **MUST** validate this catalog against the current public **gComponent** export barrel and component source. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Catalog

| **gComponent**                                    | Purpose                                                | Public inputs overview                                   |
| ------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| `GComponentAlert`                                 | Presents an alert message.                             | Message; optional title, color, and variant.             |
| `GComponentAuthenticationCard`                    | Frames Authentication content.                         | Title and content.                                       |
| `GComponentAuthenticationCallback`                | Presents Authentication callback progress and results. | None.                                                    |
| `GComponentAuthenticationEmailChange`             | Presents the email-change operation.                   | None.                                                    |
| `GComponentAuthenticationEmailConfirmationResend` | Presents the confirmation-email resend operation.      | None.                                                    |
| `GComponentAuthenticationInvitationAcceptance`    | Presents the invitation-acceptance operation.          | None.                                                    |
| `GComponentAuthenticationLoading`                 | Presents an Authentication loading state.              | Optional message.                                        |
| `GComponentAuthenticationMagicLinkRequest`        | Presents the magic-link request operation.             | None.                                                    |
| `GComponentAuthenticationOperationError`          | Presents an Authentication operation error.            | Optional title and message.                              |
| `GComponentAuthenticationPasswordChange`          | Presents the password-change operation.                | None.                                                    |
| `GComponentAuthenticationPasswordRecoveryRequest` | Presents the password-recovery request operation.      | None.                                                    |
| `GComponentAuthenticationPasswordReset`           | Presents the password-reset operation.                 | None.                                                    |
| `GComponentAuthenticationReauthentication`        | Presents the reauthentication operation.               | None.                                                    |
| `GComponentAuthenticationResultMessage`           | Presents an Authentication result.                     | Optional title, message, and result type.                |
| `GComponentAuthenticationSignIn`                  | Presents the sign-in operation.                        | None.                                                    |
| `GComponentAuthenticationSignOut`                 | Presents the sign-out operation.                       | None.                                                    |
| `GComponentAuthenticationSignUp`                  | Presents the sign-up operation.                        | None.                                                    |
| `GComponentBadge`                                 | Presents short status text.                            | Text; optional color and variant.                        |
| `GComponentButton`                                | Presents a framework button.                           | Variant, text, action; optional icon and icon-only mode. |
| `GComponentFooter`                                | Presents current organisation and user information.    | None.                                                    |
| `GComponentFlow`                                  | Arranges child content horizontally or vertically.     | Direction and content; optional gap and alignment.       |
| `GComponentHeader`                                | Presents the current organisation and navigation.      | None.                                                    |
| `GComponentInput`                                 | Presents the supported input controls.                 | Kind, label, value, and kind-specific inputs.            |
| `GComponentLoader`                                | Presents a loading indicator.                          | Optional size, color, and label.                         |
| `GComponentNavigation`                            | Presents links for registered path routes.             | Optional vertical or horizontal orientation.             |
| `GComponentNothing`                               | Presents no visible content.                           | None.                                                    |
| `GComponentPostgresDataTable`                     | Presents data for one registered PostgreSQL resource.  | Resource; optional visible-column and sort defaults.     |
| `GComponentTypography`                            | Presents text using a framework typography variant.    | Text and optional variant.                               |

