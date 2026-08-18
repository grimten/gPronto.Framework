# Supabase CLI

## Status

Draft

## Scope

gPronto.Application:Supabase CLI installation and version checks.
gPronto.Application:CLI authentication and hosted-project linking procedures.
gPronto.Application:Availability requirements for Supabase-related skills.
gPronto.Application:Excludes browser integration, database access policy, database naming, and Edge Functions.

## Verification

Date: 2026-08-18

## Rules

<rule category="cli-authentication">

The result **MUST** be judged by standard output only.

| Standard output                                                                                             | Meaning                                                   |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| A JSON object whose `projects` array contains every required project reference                              | The Supabase CLI is authenticated as the correct account. |
| Any other output, including an absent or empty `projects` array or one missing a required project reference | Authentication as the correct account is not confirmed.   |

You **MUST NOT** use the exit code as authentication evidence. A successful command can exit with code `0` without proving that the correct account owns every required project.

You **MUST NOT** use standard error as authentication evidence. The Supabase CLI can write

`Cannot find project ref. Have you run supabase link?`

to standard error even when the object containing the `projects` array is returned successfully. That text is about linking, not authentication, and `projects list` does not require a linked project.

An absent or empty `projects` array **MUST** be treated as a failed authentication check, but **MUST NOT** by itself be described as proof of the cause. An authenticated Supabase CLI for the correct account **MUST NOT** return an absent or empty `projects` array because the account owns one Supabase project for every **gPronto.Application**.

To confirm that the Supabase CLI is authenticated as the correct account, the returned object's `projects` array **MUST** contain all project references in [Supabase projects](supabase-projects.md).

After the script has run, the Supabase CLI authentication **MUST** be checked. If it is not authenticated, the **User** **MUST** be alerted.

</rule>

<rule category="supabase-skills">

Before working with Supabase, both skills **MUST** be checked for availability.

If both are available, use them.

If either one is missing, install them into the current repository. From the repository root, run one of these commands.

Windows PowerShell:

```powershell
npx skills add supabase/agent-skills
```

Unix shell:

```sh
npx skills add supabase/agent-skills
```

Both skills are installed together. There is no separate command for one of them.

After installing, check again that both skills are available.

If either one is still missing, the **User** **MUST** be alerted and the work **MUST NOT** continue.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-supabase-cli">

The **Agent** **MUST** validate every **Rule** and factual statement in this document by running the current Supabase CLI checks and comparing returned project references with [Supabase projects](supabase-projects.md). The **Agent** has approval to run read-only CLI checks and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** include the command contract, output channel, or missing project reference that fails. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## CLI

We use Supabase CLI to connect to Supabase instances.

Project information can be found in [Supabase projects](supabase-projects.md).

## Check: Is the Supabase CLI installed

Run one of these commands.

Windows PowerShell:

```powershell
supabase --version
```

Unix shell:

```sh
supabase --version
```

If the command is not found, the Supabase CLI is not installed and no further check is possible.

Notify the user.

## Check: Is the Supabase CLI authenticated

The Supabase CLI is authenticated with an account access token.

Run one of these commands from any folder.

Windows PowerShell:

```powershell
supabase projects list --output-format json
```

Unix shell:

```sh
supabase projects list --output-format json
```

## Action: Authenticate Supabase CLI

To authenticate Supabase CLI from the **gPronto.Tools** repository root, run one of these commands.

Windows PowerShell:

```powershell
node ".\scripts\supabase-auth.mjs"
```

Unix shell:

```sh
node "./scripts/supabase-auth.mjs"
```

## Check: Are the Supabase skills available

Two skills are published by Supabase and are used when working with Supabase and the Supabase CLI:

| Skill                              | Source                  |
| ---------------------------------- | ----------------------- |
| `supabase`                         | `supabase/agent-skills` |
| `supabase-postgres-best-practices` | `supabase/agent-skills` |

