# Get Emails

## Status

Draft

## Scope

gPronto.Application:Capture timing and read-state preservation for supported authentication-email recipients.
gPronto.Application:Authentication and request requirements for the read-only email API.
gPronto.Application:Response ordering, callback-link extraction, and fetch-health fields.
gPronto.Application:Excludes how Authentication sends, verifies, or processes emails.

## Verification

Date: 2026-08-18

## Rules

<rule category="email-capture" id="authentication-email-capture">

Every authentication email sent to an address matching `larssoncj+XXX@gmail.com` **MUST** be exposed by the gCodex API within one minute without changing the message's read state.

</rule>

<rule category="email-api" id="authentication-email-request">

Authentication emails **MUST** be retrieved with `GET https://gcodex.grimten.com/api/v1/authentication-emails` and a bearer token whose value is read from `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`.

The token value **MUST NOT** be written into documentation.

</rule>

<rule category="email-api" id="authentication-email-response">

The response **MUST** list emails newest-first, `links[0]` **MUST** identify the first extracted link for a matching recipient, `fetch.last_success_at` **MUST** report data freshness, and `fetch.last_error` **MUST** report the current fetch failure when one exists.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-get-emails">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current read-only gCodex API and a current authentication-email response without exposing a token or email secret. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** state the failed requirement and current evidence. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## How to get them

Every authentication email the applications send to a `larssoncj+XXX@gmail.com`
address is picked up from the Gmail inbox within one minute and exposed by the
gCodex API. The mailbox is read-only; nothing is marked as read.

Call the authenticated listing endpoint:

```http
GET https://gcodex.grimten.com/api/v1/authentication-emails
Authorization: Bearer <token>
```

The token is `gPronto.Framework:.env variable:[GCODEX_API_TOKEN]`.

The response lists every email newest-first. Filter on `to` and take `links[0]`
for the newest authentication callback link of a recipient:

```json
{
  "emails": [
    {
      "uid": 195006,
      "date": "Sat, 15 Aug 2026 06:34:05 +0000",
      "to": "larssoncj+100@gmail.com",
      "subject": "Confirm your email address",
      "links": [
        "https://.../authentication/callback?token_hash=...&type=signup"
      ],
      "file": "20260815-083405_195006.json"
    }
  ],
  "count": 1530,
  "fetch": {
    "last_success_at": "...",
    "last_error": null,
    "last_error_at": null
  }
}
```

`fetch.last_success_at` tells how fresh the data is; `fetch.last_error` is the
reason when fetching is failing. The API documentation lives at
`https://gcodex.grimten.com/docs`.
