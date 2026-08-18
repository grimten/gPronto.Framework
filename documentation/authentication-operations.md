# Authentication operations

## Status

Draft

## Scope

gPronto.Framework:The immutable public Authentication operation object.
gPronto.Framework:The input, Supabase call, and result contract of each public Authentication function.
gPronto.Framework:Excludes Authentication runtime-state synchronization.
gPronto.Framework:Excludes user-interface composition and hosted Supabase configuration.

## Verification

Date: 2026-08-18

## Rules

<rule category="public-authentication-object">

The root component has one permanent `Authentication` object. Its nested objects and final function holders are frozen. They cannot be replaced or extended.

The implemented browser functions return the applicable native Supabase result without a second framework result envelope.

### Sign up

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Sign.Up.Function(
  email,
  password,
);
```

Calls `supabase.auth.signUp`. It supplies the explicit callback URL as `emailRedirectTo`. Supabase project settings determine confirmation behavior.

### Sign in

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Sign.In.Function(
  email,
  password,
);
```

Calls `supabase.auth.signInWithPassword`.

### Sign out

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Sign.Out.Function();
```

Calls `supabase.auth.signOut({ scope: "local" })`. The resulting `SIGNED_OUT` event clears the framework `User` and `Organisation` state.

### Send magic link

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Send.MagicLink.Function(
  email,
);
```

Calls `supabase.auth.signInWithOtp` with the explicit callback URL and:

```ts
shouldCreateUser: false;
```

Magic links are therefore limited to existing users.

### Send password recovery

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Send.PasswordRecovery.Function(
  email,
);
```

Calls `supabase.auth.resetPasswordForEmail` with the explicit callback URL.

### Reset password

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Reset.Password.Function(
  newPassword,
);
```

Calls `supabase.auth.updateUser({ password: newPassword })`. The function assumes Supabase has already established the applicable recovery session.

### Change password

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Change.Password.Function(
  currentPassword,
  newPassword,
);
```

Calls `supabase.auth.updateUser` with `password` and `current_password`.

### Change email

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Change.Email.Function(
  newEmail,
);
```

Calls `supabase.auth.updateUser` with the new email and the explicit `emailRedirectTo` callback URL. Supabase project settings determine the confirmation behavior.

### Resend email confirmation

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Resend.EmailConfirmation.Function(
  email,
);
```

Calls `supabase.auth.resend` with type `signup` and the explicit callback URL.

### Accept invitation

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Accept.Invitation.Function(
  password,
);
```

Calls `supabase.auth.updateUser({ password })`. The function assumes the invitation link has already established the invited user's session.

### Verify email link

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Verify.EmailLink.Function(
  tokenHash,
  type,
);
```

Calls `supabase.auth.verifyOtp` with the token hash from an authentication email link. The type is exactly one of `signup`, `invite`, `magiclink`, `recovery`, `email_change`, or `email`. A token hash is verified exactly once.

### Reauthenticate

```ts
GProntoFrameworkApplicationRootComponent.Authentication.Reauthenticate.Function();
```

Calls `supabase.auth.reauthenticate` so Supabase can initiate its reauthentication flow.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-authentication-operations">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current public Authentication object, operation signatures, Supabase calls, and result contracts. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the operation and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Public authentication object

