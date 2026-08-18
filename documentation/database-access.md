# Database access

## Status

Draft

## Scope

gPronto.Application:Data API schema exposure and automatic table exposure.
gPronto.Application:Baseline table privileges for authenticated and anonymous roles.
gPronto.Application:Initial SQL script ownership of tables, privileges, policies, functions, and role data.
gPronto.Application:The Authentication property-hydration database function and its permissions.
gPronto.Application:Application roles and the access granted to each role.
gPronto.Application:Role use in RLS policies and role-field consistency requirements.
gPronto.Application:Excludes database naming, browser-client configuration, CLI procedures, and Edge Function structure.

## Verification

Date: 2026-08-18

## Rules

<rule category="data-api-exposure">

The Refine Supabase adapter **MUST** access tables through the Supabase Data API. A table **MUST** be exposed to that API and the active database role **MUST** have the required table privileges before Refine can read or mutate it.

</rule>

<rule category="data-api-exposure">

The framework resource catalog **MUST NOT** create grants, enable RLS, or create policies. The checked-in initial SQL and the hosted project configuration **MUST** remain responsible for database access.

</rule>

<rule category="table-privileges">

Every application-owned table **MUST** use this table privilege baseline:

- `anon` has no table privileges;
- `authenticated` has `SELECT`, `INSERT`, `UPDATE`, and `DELETE`;
- `service_role` has `SELECT`, `INSERT`, `UPDATE`, and `DELETE`;
- `postgres` has full privileges as the table owner;
- `anon`, `authenticated`, and `service_role` do not have `TRUNCATE`, `REFERENCES`, `TRIGGER`, or `MAINTAIN`.

</rule>

<rule category="initial-sql-script">

Each **gPronto.Application** **MUST** store its initial SQL script at its applicable repository-rooted location:

- `gPronto.Application.Backstage:supabase/backstage.sql`
- `gPronto.Application.gPrototype2:supabase/prototype2.sql`
- `gPronto.Application.gPrototype3:supabase/prototype3.sql`
- `gPronto.Application.gPrototype4:supabase/prototype4.sql`

</rule>

<rule category="authentication-property-hydration">

Every **gPronto.Application** database **MUST** contain this no-argument function:

```text
public.get_gpronto_framework_application_root_properties_version_1()
```

The function **MUST** select only the active non-deleted `public.users` row whose `auth_user_id` equals `auth.uid()`. It **MUST** left join the active non-deleted `public.organisations` row identified by `public.users.organisation_id`. It **MUST** return SQL null when there is no visible active user. An absent, deleted, unlinked, or RLS-invisible organisation **MUST** produce `organisation: null` without removing a valid user.

The function **MUST NOT** return `public.users.email`. **gPronto.Framework** **MUST** map `User.Email` from the latest Auth session.

Every initial SQL script **MUST** apply these permissions after creating the function:

```sql
revoke execute on function public.get_gpronto_framework_application_root_properties_version_1() from PUBLIC, anon;
grant execute on function public.get_gpronto_framework_application_root_properties_version_1() to authenticated;
```

RLS policies **MUST** implement only the access listed in the Role access chapter. Grants **MUST** determine whether a role may access the tables or function; RLS **MUST** determine which rows are visible. The `authenticated` role **MUST** be able to execute the function. The `anon` role **MUST NOT** be able to execute it.

</rule>

<rule category="roles">

A role **MUST** be changed only manually in the Supabase instance. A function for changing a role **MUST NOT** exist.

</rule>

<rule category="role-access">

RLS **MUST** be enabled on every application-owned table.

</rule>

<rule category="role-access" id="standard-insert-checks">

The `standard` insert policies **MUST** use exactly these `WITH CHECK` expressions:

- `logs`: `(select public.get_user_role()) = 'standard' AND auth_user_id = (select auth.uid())`;
- `data_examples`: `(select public.get_user_role()) = 'standard'`;
- `user_events`: `(select public.get_user_role()) = 'standard' AND actor_auth_user_id = (select auth.uid())`;
- `user_sessions`: `(select public.get_user_role()) = 'standard' AND exists (select 1 from public.users where users.id = user_sessions.user_id and users.auth_user_id = (select auth.uid()) and users.is_deleted = false) AND user_sessions.session_id = ((select auth.jwt()) ->> 'session_id')::uuid`.

</rule>

<rule category="role-access">

Everything not listed **MUST** be denied. An RLS policy **MUST** exist only for access allowed by this chapter.

</rule>

<rule category="role-access">

Every RLS policy **MUST** target the `authenticated` database role and **MUST** obtain the application role through `public.get_user_role()`. Browser-supplied role values **MUST NOT** be used.

</rule>

<rule category="roles-in-policies">

An RLS policy **MUST** learn the requesting user's role from inside the database by calling `public.get_user_role()`. That function **MUST** read the `role` column of the `users` row that belongs to `auth.uid()`.

The function **MUST** be declared `security definer`, **MUST** read only the `role` column, and **MUST NOT** write it.

The function **MUST** be present in every initial SQL script.

</rule>

<rule category="roles-in-policies">

Every application-owned table **MUST** have exactly one admin policy named `[TABLE_NAME]_all_admin_policy`. The policy **MUST** use `FOR ALL`, **MUST** target `authenticated`, and **MUST** use the admin-role condition for both `USING` and `WITH CHECK`.

</rule>

<rule category="roles-in-policies">

Every initial SQL script **MUST** place all `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and `CREATE POLICY` statements in one centralized RLS section after all application-owned tables have been created.

</rule>

<rule category="roles" id="role-column">

The `users` table in every **gPronto.Application** Supabase project **MUST** contain a column named `role` of type `citext`.

The `role` column of the `users` table **MUST** have the database default `standard`.

The value of the `role` column of the `users` table **MUST** be exactly `standard` or `admin`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-database-access">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against every current application SQL source and hosted database grants, RLS state, policies, roles, and hydration functions. The **Agent** has approval to perform read-only inspection and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected application and database object. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Data API exposure

Supabase no longer guarantees that newly created `public` tables are exposed automatically. Data API privileges and RLS are separate layers:

- database grants determine whether `anon` or `authenticated` can perform an operation on a table at all;
- RLS policies determine which rows that role can access after the table operation is available.

## Table privilege baseline

Table privileges make an operation available to a database role. RLS determines which rows and operations an authenticated account may use.

## Initial SQL script

## Authentication property hydration function

It returns `jsonb`, uses `LANGUAGE sql`, is `STABLE`, runs as `SECURITY INVOKER`, and has an empty `search_path`. Every referenced database object is schema-qualified.

The version-1 response shape is:

```ts
{
  version: 1;
  user: {
    id: string;
    auth_user_id: string;
    first_name: string;
    last_name: string;
    role: string;
    role_application: string | null;
    role_prototype: string | null;
    organisation_id: string | null;
  };
  organisation: {
    id: string;
    name: string;
    organisation_type: string;
  } | null;
}
```

The same function and permissions are stored in all four initial SQL scripts and were deployed to these hosted projects on 2026-08-09:

| Application                         | Project reference                                                   |
| ----------------------------------- | ------------------------------------------------------------------- |
| **gPronto.Application.Backstage**   | `gPronto.Framework:.env variable:[SUPABASE_GBACKSTAGE_PROJECTREF]`  |
| **gPronto.Application.Prototype** 2 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE2_PROJECTREF]` |
| **gPronto.Application.Prototype** 3 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE3_PROJECTREF]` |
| **gPronto.Application.Prototype** 4 | `gPronto.Framework:.env variable:[SUPABASE_GPROTOTYPE4_PROJECTREF]` |

The complete create-on-empty initial SQL scripts were not rerun against the hosted databases. Only the new function and permission block was applied in a transaction to each project. The repositories remain unlinked, and no migration workflow or migration file was introduced.

## Roles

`Role` is the role in Supabase.

There are two different roles: `standard` and `admin`.

The `users` table gives `standard` as the default.

## Role access

A `standard` user:

- can select every row from every application-owned table;
- can insert into `logs` only when `auth_user_id` equals `auth.uid()`;
- can insert any valid row into `data_examples`;
- can insert into `user_events` only when `actor_auth_user_id` equals `auth.uid()`;
- can insert into `user_sessions` only when the referenced active `users` row belongs to `auth.uid()` and `session_id` equals the current JWT session identifier;
- can update its own row in the `users` table, except the `role` column.

An `admin` user can select, insert, update, and delete every row in every application-owned table.

## Roles in policies

The lookup lives in one database function that every policy calls:

```sql
create function public.get_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.users where auth_user_id = (select auth.uid()) and is_deleted = false;
$$;
```

The where-clause assumes that the `users` table stores the Supabase Auth user id in a column named `auth_user_id`. When the database work decides that `users.id` is itself the Auth user id, the where-clause becomes `where id = (select auth.uid())`.

The admin policy has this form:

```sql
create policy [TABLE_NAME]_all_admin_policy
on public.[TABLE_NAME]
for all
to authenticated
using ((select public.get_user_role()) = 'admin')
with check ((select public.get_user_role()) = 'admin');
```

Policies combine with OR: the admin policy sits beside the applicable `standard` policies of the same table. A `standard` user passes an applicable `standard` policy, an `admin` passes the admin policy, and a signed-out request passes neither because every policy targets `authenticated`.

## Role field rules

