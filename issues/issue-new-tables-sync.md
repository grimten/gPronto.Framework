# Synchronize Backstage prototype metadata to prototype databases

## Status

Ready for implementation.

## Goal

Backstage is the source of truth for prototype metadata and prototype webpage metadata. Add a standalone scheduled reverse synchronization so each prototype database receives only its own prototype row and its own webpage rows. Leave the current prototype-to-Backstage material synchronization function and schedule unchanged.

```text
prototype material tables -> Backstage project_prototype_* tables
Backstage project_prototypes and project_prototypes_webpages -> matching prototype database
```

## Scope

### Included

- Add `public.project_prototypes_webpages` to Backstage.
- Add `public.project_prototypes` and `public.project_prototypes_webpages` to gPrototype2, gPrototype3, and gPrototype4.
- Leave `public.sync_project_prototype_material_version_1()` and its existing ten-second schedule unchanged.
- Add a standalone reverse function named `public.sync_backstage_project_prototype_material_version_1()`.
- Add a separate ten-second cron job named `sync-backstage-project-prototype-material-version-1` for the standalone reverse function.
- Update all four create-on-empty initial SQL files.
- Prepare rollback SQL, deploy to all four existing hosted databases, verify the result, and clean up verification rows.

### Excluded

- A new migration framework or migration-directory convention.
- Hard-delete reconciliation.
- Moving an existing webpage row from one prototype to another.
- Moving a prototype connection to a different destination database after synchronization has begun.
- Redesigning the existing prototype-to-Backstage material schema or acknowledgement protocol.
- A Backstage administrator webpage, application routing, or navigation for managing webpage metadata.

## Current implementation

The current function is defined in:

`gPronto.Application.Backstage:supabase/backstage.sql`

For each `public.project_prototypes` row with a non-null `material_sync_connection_secret_id`, it:

1. resolves the prototype database connection string from Vault;
2. reads prototype material whose `is_backstage_mirrored` value is `false`;
3. upserts that material into Backstage `public.project_prototype_*` tables;
4. acknowledges each imported source row through separate `extensions.dblink_exec` calls.

This existing function and its cron job are outside the modification scope. Do not change its empty-batch branch, acknowledgement order, SQL, name, or schedule.

The new `public.sync_backstage_project_prototype_material_version_1()` function independently loops over the same configured prototypes and performs only Backstage-to-prototype synchronization. It may reuse the existing Vault lookup pattern, but it must not call, replace, or share control flow with the existing forward function. A failure in either scheduled function must not change the execution or acknowledgement behavior of the other.

The checked-in application SQL files are complete create-on-empty scripts. They abort when any target table already exists and must not be executed against the populated hosted databases.

## Database contracts

### Existing Backstage parent table

`public.project_prototypes` already exists in hosted Backstage. Do not recreate or replace it. Reverse synchronization reads these columns:

- `id`
- `created_at`
- `updated_at`
- `is_deleted`
- `project_id`
- `name`
- `production_url`
- `staging_url`
- `development_url`
- `repository_url`

`material_sync_connection_secret_id` remains Backstage-only connection metadata. Use it to establish the remote connection, but never include it in a reverse payload or remote upsert.

### Prototype parent table

Create this table in every prototype initial SQL file and hosted database:

```sql
create table public.project_prototypes (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    is_deleted boolean default false not null,
    project_id uuid,
    name extensions.citext not null,
    production_url extensions.citext,
    staging_url extensions.citext,
    development_url extensions.citext,
    repository_url extensions.citext,
    material_sync_connection_secret_id uuid,
    constraint project_prototypes_pkey primary key (id)
);
```

The nullable `material_sync_connection_secret_id` column keeps the prototype parent table aligned with the Backstage parent shape. Synchronization leaves it null on insert and never updates it.

### Webpage table

Create this table in Backstage and every prototype:

```sql
create table public.project_prototypes_webpages (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    is_deleted boolean default false not null,
    prototype_id uuid not null,
    path extensions.citext,
    name extensions.citext,
    description extensions.citext,
    constraint project_prototypes_webpages_pkey primary key (id),
    constraint project_prototypes_webpages_prototype_id_fkey
        foreign key (prototype_id)
        references public.project_prototypes (id)
);

create index project_prototypes_webpages_prototype_id_idx
    on public.project_prototypes_webpages (prototype_id);
```

The foreign key uses PostgreSQL's default `ON UPDATE NO ACTION` and `ON DELETE NO ACTION` behavior. Do not add a unique constraint or unique index on `(prototype_id, path)`. The source `id` is the synchronization identity and conflict target. `path`, `name`, and `description` remain nullable.

## Source-row invariants

- Backstage rows are authoritative.
- `project_prototypes_webpages.prototype_id` is required on insert and must not be reassigned afterward.
- Application workflows use `is_deleted` for deletion. Hard deletion is not propagated.
- An existing webpage row is not reassigned to another prototype.
- Ordinary application writes must preserve these invariants. Privileged direct SQL is reserved for reviewed operational work and must preserve them explicitly.

## Triggers

### Backstage

Attach these four triggers to Backstage `public.project_prototypes_webpages`:

- `project_prototypes_webpages_before_update_touch_trigger` runs before each update and calls `public.set_updated_at()` to set `updated_at` to the current time;
- `project_prototypes_webpages_after_insert_audit_trigger` runs after each insert and calls `public.record_audit_event()`;
- `project_prototypes_webpages_after_update_audit_trigger` runs after each update and calls `public.record_audit_event()`;
- `project_prototypes_webpages_after_delete_audit_trigger` runs after each delete and calls `public.record_audit_event()`.

The existing `public.project_prototypes` triggers remain unchanged.

### Prototypes

Do not attach any of the following to the two destination tables:

- `public.reset_backstage_mirrored()`;
- an `is_backstage_mirrored` column;
- a local update-touch trigger;
- local audit triggers.

The reverse upsert must preserve Backstage timestamps exactly. The destination tables must not enter the forward material loop, and reverse upserts must not create new prototype audit material.

## RLS and grants

Enable RLS on both new prototype tables and on Backstage `public.project_prototypes_webpages`.

Use the existing access pattern in every database:

- no policy or table grant for `anon`;
- a `SELECT` policy for authenticated users whose `public.get_user_role()` result is `standard`;
- an all-operations policy for authenticated users whose `public.get_user_role()` result is `admin`, with matching `USING` and `WITH CHECK` expressions;
- explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` table grants for `authenticated` and `service_role` after first revoking all table privileges from `anon`, `authenticated`, and `service_role`.

RLS limits standard authenticated users to reads despite their table-level grants. `service_role` and the trusted direct database connection used by `dblink` retain write access. Do not expose a service-role key or database connection string to browser code.

## Initial SQL changes

Update these create-on-empty files:

- `gPronto.Application.Backstage:supabase/backstage.sql`
- `gPronto.Application.gPrototype2:supabase/prototype2.sql`
- `gPronto.Application.gPrototype3:supabase/prototype3.sql`
- `gPronto.Application.gPrototype4:supabase/prototype4.sql`

Backstage changes:

1. add `project_prototypes_webpages` to the preflight table list;
2. create the webpage table after `project_prototypes`;
3. add its foreign-key index, triggers, RLS policies, revokes, and grants;
4. add `public.sync_backstage_project_prototype_material_version_1()` as a new standalone function;
5. keep the existing `public.sync_project_prototype_material_version_1()` body and cron schedule statement unchanged;
6. add a separate ten-second cron schedule statement for `sync-backstage-project-prototype-material-version-1` that calls the new standalone function.

Prototype changes:

1. add `project_prototypes` and `project_prototypes_webpages` to each preflight table list;
2. create the parent before the child;
3. add the foreign-key index, RLS policies, revokes, and grants;
4. do not add destination tables to the forward material query.

## Reverse synchronization design

### Per-prototype order

Within `public.sync_backstage_project_prototype_material_version_1()`, use this order:

1. Loop over `public.project_prototypes` rows with a non-null `material_sync_connection_secret_id`.
2. Resolve the connection string with the same Vault lookup pattern used by the existing function.
3. Build one explicit JSON object for the current Backstage prototype row, excluding `material_sync_connection_secret_id`.
4. Send one parent upsert to the matching prototype with `extensions.dblink_exec`.
5. Build one JSON array containing only Backstage webpage rows whose `prototype_id` equals the current prototype ID.
6. When that array is non-empty, send one batched webpage upsert to the same prototype.
7. Continue to the next prototype.

The standalone reverse function does not read `material_batch`, import prototype material, or execute forward acknowledgements.

### Payload and SQL safety

- Construct payloads with explicit `jsonb_build_object` keys. Do not use `to_jsonb(row)`, `SELECT *`, or another unrestricted row conversion for reverse synchronization.
- Pass JSON text into remote SQL through `pg_catalog.format()` with `%L` literal quoting.
- Keep schema, table, and column identifiers fixed in the SQL. Do not derive an identifier from row data.
- Convert payloads on the remote side with typed `jsonb_populate_record` or `jsonb_to_recordset` expressions and explicit insert columns.
- Fully qualify non-built-in functions and relations.
- Never include a connection string, decrypted Vault value, or complete payload in an exception message or log.

### Parent upsert

Insert these destination columns:

- `id`
- `created_at`
- `updated_at`
- `is_deleted`
- `project_id`
- `name`
- `production_url`
- `staging_url`
- `development_url`
- `repository_url`

Use `ON CONFLICT (id) DO UPDATE` for the same synchronized columns. Do not insert or update `material_sync_connection_secret_id`.

Add a `WHERE` condition using row comparison with `IS DISTINCT FROM` so an unchanged parent does not receive another physical update.

### Synchronizing webpage metadata

This operation copies database metadata only. It does not publish webpage files or webpage content.

For each prototype, send all Backstage webpage rows belonging to that prototype in one batched insert-or-update command. Insert a destination row when its `id` is absent. When the destination already has the same `id`, update it only when one or more synchronized values differ.

Insert and update:

- `id`
- `created_at`
- `updated_at`
- `is_deleted`
- `prototype_id`
- `path`
- `name`
- `description`

Use `ON CONFLICT (id) DO UPDATE` and an `IS DISTINCT FROM` row comparison so unchanged webpages do not receive physical updates. Updating `prototype_id` in the destination repairs destination drift; the source-row invariant still prevents ordinary source reassignment.

Skip the remote webpage command when the payload array is empty.

### Failure behavior

Keep the connection-string form of `extensions.dblink_exec` and do not add a persistent remote connection or a remote transaction spanning parent and webpage upserts.

The calls therefore commit independently. If the parent succeeds and the webpage command fails:

1. raise a local error that includes the prototype ID but not the connection string or payload;
2. fail the current standalone reverse-function run;
3. leave the existing forward function and its acknowledgements unaffected;
4. allow the local reverse-function transaction to roll back;
5. let the next reverse scheduled run repeat the idempotent parent upsert and repair the webpage state.

Keep remote `fail_on_error` behavior enabled. Preserve the remote SQLSTATE when adding prototype context where practical.

## Existing forward synchronization

Do not modify `public.sync_project_prototype_material_version_1()` or its cron job. Keep its function definition, name, ten-second schedule, material types, Backstage destination columns, conflict targets, update behavior, control flow, acknowledgement order, and remote acknowledgement statements unchanged.

The standalone reverse function must not call the existing forward function or share its `material_batch`, acknowledgement loop, or error handling.

The existing limitation that separate acknowledgement commands can partially succeed remains outside this change.

## Canonical implementation SQL

The SQL in this section is the required implementation, not pseudocode. Preserve identifier names, column order, policy expressions, explicit grants, payload fields, conflict targets, and conditional-update predicates unless a reviewed implementation change updates this Issue document first.

Run every schema or function block as the database owner. Run prototype blocks independently in gPrototype2, gPrototype3, and gPrototype4. Never reuse a prototype connection string for another target.

### Prototype destination schema

Apply this block once to each populated prototype database. The checked-in initial SQL files must contain the same table, index, policy, revoke, and grant statements in their existing creation and centralized-security sections.

```sql
begin;

do $preflight$
begin
    if pg_catalog.to_regclass('public.project_prototypes') is not null then
        raise exception 'public.project_prototypes already exists; no prototype objects were created.';
    end if;

    if pg_catalog.to_regclass('public.project_prototypes_webpages') is not null then
        raise exception 'public.project_prototypes_webpages already exists; no prototype objects were created.';
    end if;

    if pg_catalog.to_regtype('extensions.citext') is null then
        raise exception 'Required type extensions.citext is not available; no prototype objects were created.';
    end if;

    if pg_catalog.to_regprocedure('public.get_user_role()') is null then
        raise exception 'Required function public.get_user_role() is not available; no prototype objects were created.';
    end if;
end
$preflight$;

create table public.project_prototypes (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    is_deleted boolean default false not null,
    project_id uuid,
    name extensions.citext not null,
    production_url extensions.citext,
    staging_url extensions.citext,
    development_url extensions.citext,
    repository_url extensions.citext,
    material_sync_connection_secret_id uuid,
    constraint project_prototypes_pkey primary key (id)
);

create table public.project_prototypes_webpages (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    is_deleted boolean default false not null,
    prototype_id uuid not null,
    path extensions.citext,
    name extensions.citext,
    description extensions.citext,
    constraint project_prototypes_webpages_pkey primary key (id),
    constraint project_prototypes_webpages_prototype_id_fkey
        foreign key (prototype_id)
        references public.project_prototypes (id)
        on update no action
        on delete no action
);

create index project_prototypes_webpages_prototype_id_idx
    on public.project_prototypes_webpages (prototype_id);

alter table public.project_prototypes enable row level security;
alter table public.project_prototypes_webpages enable row level security;

create policy project_prototypes_select_standard_policy
    on public.project_prototypes
    for select
    to authenticated
    using ((select public.get_user_role()) = 'standard');

create policy project_prototypes_all_admin_policy
    on public.project_prototypes
    for all
    to authenticated
    using ((select public.get_user_role()) = 'admin')
    with check ((select public.get_user_role()) = 'admin');

create policy project_prototypes_webpages_select_standard_policy
    on public.project_prototypes_webpages
    for select
    to authenticated
    using ((select public.get_user_role()) = 'standard');

create policy project_prototypes_webpages_all_admin_policy
    on public.project_prototypes_webpages
    for all
    to authenticated
    using ((select public.get_user_role()) = 'admin')
    with check ((select public.get_user_role()) = 'admin');

revoke all privileges
on table
    public.project_prototypes,
    public.project_prototypes_webpages
from anon, authenticated, service_role;

grant select, insert, update, delete
on table
    public.project_prototypes,
    public.project_prototypes_webpages
to authenticated, service_role;

commit;
```

Do not add sequences because both IDs are UUIDs. Do not add an index for either primary key because PostgreSQL creates those unique indexes with the primary keys. The child foreign-key index is required because PostgreSQL does not create it automatically. Do not add triggers to either prototype destination table.

### Backstage webpage schema

Apply this block to populated Backstage before creating the reverse function. In the checked-in Backstage initial SQL, place the table and trigger statements immediately after `public.project_prototypes`, enable RLS in the centralized RLS section, place the policies beside the parent policies, and add the table to the existing centralized revoke and grant lists.

```sql
begin;

do $preflight$
begin
    if pg_catalog.to_regclass('public.project_prototypes') is null then
        raise exception 'Required parent table public.project_prototypes is not available; no Backstage object was created.';
    end if;

    if pg_catalog.to_regclass('public.project_prototypes_webpages') is not null then
        raise exception 'public.project_prototypes_webpages already exists; no Backstage object was created.';
    end if;

    if pg_catalog.to_regtype('extensions.citext') is null then
        raise exception 'Required type extensions.citext is not available; no Backstage object was created.';
    end if;

    if pg_catalog.to_regprocedure('public.set_updated_at()') is null then
        raise exception 'Required function public.set_updated_at() is not available; no Backstage object was created.';
    end if;

    if pg_catalog.to_regprocedure('public.record_audit_event()') is null then
        raise exception 'Required function public.record_audit_event() is not available; no Backstage object was created.';
    end if;

    if pg_catalog.to_regprocedure('public.get_user_role()') is null then
        raise exception 'Required function public.get_user_role() is not available; no Backstage object was created.';
    end if;
end
$preflight$;

create table public.project_prototypes_webpages (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    is_deleted boolean default false not null,
    prototype_id uuid not null,
    path extensions.citext,
    name extensions.citext,
    description extensions.citext,
    constraint project_prototypes_webpages_pkey primary key (id),
    constraint project_prototypes_webpages_prototype_id_fkey
        foreign key (prototype_id)
        references public.project_prototypes (id)
        on update no action
        on delete no action
);

create index project_prototypes_webpages_prototype_id_idx
    on public.project_prototypes_webpages (prototype_id);

create trigger project_prototypes_webpages_before_update_touch_trigger
    before update
    on public.project_prototypes_webpages
    for each row
    execute function public.set_updated_at();

create trigger project_prototypes_webpages_after_insert_audit_trigger
    after insert
    on public.project_prototypes_webpages
    for each row
    execute function public.record_audit_event();

create trigger project_prototypes_webpages_after_update_audit_trigger
    after update
    on public.project_prototypes_webpages
    for each row
    execute function public.record_audit_event();

create trigger project_prototypes_webpages_after_delete_audit_trigger
    after delete
    on public.project_prototypes_webpages
    for each row
    execute function public.record_audit_event();

alter table public.project_prototypes_webpages enable row level security;

create policy project_prototypes_webpages_select_standard_policy
    on public.project_prototypes_webpages
    for select
    to authenticated
    using ((select public.get_user_role()) = 'standard');

create policy project_prototypes_webpages_all_admin_policy
    on public.project_prototypes_webpages
    for all
    to authenticated
    using ((select public.get_user_role()) = 'admin')
    with check ((select public.get_user_role()) = 'admin');

revoke all privileges
on table public.project_prototypes_webpages
from anon, authenticated, service_role;

grant select, insert, update, delete
on table public.project_prototypes_webpages
to authenticated, service_role;

commit;
```

### Reverse synchronization function

Create this standalone function in Backstage only, after all six destination tables exist across the three prototypes. It deliberately sends the parent and webpage upserts as two independent remote commands. Each `extensions.dblink_exec` call commits in the remote database independently.

```sql
begin;

do $preflight$
begin
    if pg_catalog.to_regclass('public.project_prototypes') is null then
        raise exception 'Required source table public.project_prototypes is not available.';
    end if;

    if pg_catalog.to_regclass('public.project_prototypes_webpages') is null then
        raise exception 'Required source table public.project_prototypes_webpages is not available.';
    end if;

    if pg_catalog.to_regclass('vault.decrypted_secrets') is null then
        raise exception 'Required Vault view vault.decrypted_secrets is not available.';
    end if;

    if pg_catalog.to_regprocedure('extensions.dblink_exec(text,text)') is null then
        raise exception 'Required function extensions.dblink_exec(text,text) is not available.';
    end if;

    if pg_catalog.to_regprocedure('public.sync_backstage_project_prototype_material_version_1()') is not null then
        raise exception 'public.sync_backstage_project_prototype_material_version_1() already exists; review before replacing it.';
    end if;
end
$preflight$;

create function public.sync_backstage_project_prototype_material_version_1()
returns void
language plpgsql
security invoker
set search_path to ''
as $function$
declare
    prototype record;
    connection_string text;
    prototype_payload jsonb;
    webpage_payload jsonb;
    caught_sqlstate text;
begin
    for prototype in
        select
            project_prototypes.id as prototype_id,
            project_prototypes.created_at,
            project_prototypes.updated_at,
            project_prototypes.is_deleted,
            project_prototypes.project_id,
            project_prototypes.name,
            project_prototypes.production_url,
            project_prototypes.staging_url,
            project_prototypes.development_url,
            project_prototypes.repository_url,
            project_prototypes.material_sync_connection_secret_id
        from public.project_prototypes
        where project_prototypes.material_sync_connection_secret_id is not null
        order by project_prototypes.id
    loop
        begin
            connection_string := null;

            select decrypted_secrets.decrypted_secret
            into connection_string
            from vault.decrypted_secrets
            where decrypted_secrets.id = prototype.material_sync_connection_secret_id;

            if connection_string is null then
                raise exception
                    using
                        errcode = 'P0001',
                        message = pg_catalog.format(
                            'No connection secret resolved for prototype %s.',
                            prototype.prototype_id
                        );
            end if;

            prototype_payload := pg_catalog.jsonb_build_object(
                'id', prototype.prototype_id,
                'created_at', prototype.created_at,
                'updated_at', prototype.updated_at,
                'is_deleted', prototype.is_deleted,
                'project_id', prototype.project_id,
                'name', prototype.name,
                'production_url', prototype.production_url,
                'staging_url', prototype.staging_url,
                'development_url', prototype.development_url,
                'repository_url', prototype.repository_url
            );

            perform extensions.dblink_exec(
                connection_string,
                pg_catalog.format(
                    $remote_parent$
                    insert into public.project_prototypes as destination (
                        id,
                        created_at,
                        updated_at,
                        is_deleted,
                        project_id,
                        name,
                        production_url,
                        staging_url,
                        development_url,
                        repository_url
                    )
                    select
                        source_row.id,
                        source_row.created_at,
                        source_row.updated_at,
                        source_row.is_deleted,
                        source_row.project_id,
                        source_row.name,
                        source_row.production_url,
                        source_row.staging_url,
                        source_row.development_url,
                        source_row.repository_url
                    from pg_catalog.jsonb_populate_record(
                        null::public.project_prototypes,
                        %L::jsonb
                    ) as source_row
                    on conflict (id) do update
                    set
                        created_at = excluded.created_at,
                        updated_at = excluded.updated_at,
                        is_deleted = excluded.is_deleted,
                        project_id = excluded.project_id,
                        name = excluded.name,
                        production_url = excluded.production_url,
                        staging_url = excluded.staging_url,
                        development_url = excluded.development_url,
                        repository_url = excluded.repository_url
                    where (
                        destination.created_at,
                        destination.updated_at,
                        destination.is_deleted,
                        destination.project_id,
                        destination.name,
                        destination.production_url,
                        destination.staging_url,
                        destination.development_url,
                        destination.repository_url
                    ) is distinct from (
                        excluded.created_at,
                        excluded.updated_at,
                        excluded.is_deleted,
                        excluded.project_id,
                        excluded.name,
                        excluded.production_url,
                        excluded.staging_url,
                        excluded.development_url,
                        excluded.repository_url
                    )
                    $remote_parent$,
                    prototype_payload::text
                )
            );

            select coalesce(
                pg_catalog.jsonb_agg(
                    pg_catalog.jsonb_build_object(
                        'id', webpages.id,
                        'created_at', webpages.created_at,
                        'updated_at', webpages.updated_at,
                        'is_deleted', webpages.is_deleted,
                        'prototype_id', webpages.prototype_id,
                        'path', webpages.path,
                        'name', webpages.name,
                        'description', webpages.description
                    )
                    order by webpages.id
                ),
                '[]'::jsonb
            )
            into webpage_payload
            from public.project_prototypes_webpages as webpages
            where webpages.prototype_id = prototype.prototype_id;

            if pg_catalog.jsonb_array_length(webpage_payload) > 0 then
                perform extensions.dblink_exec(
                    connection_string,
                    pg_catalog.format(
                        $remote_webpages$
                        insert into public.project_prototypes_webpages as destination (
                            id,
                            created_at,
                            updated_at,
                            is_deleted,
                            prototype_id,
                            path,
                            name,
                            description
                        )
                        select
                            source_row.id,
                            source_row.created_at,
                            source_row.updated_at,
                            source_row.is_deleted,
                            source_row.prototype_id,
                            source_row.path,
                            source_row.name,
                            source_row.description
                        from pg_catalog.jsonb_to_recordset(%L::jsonb) as source_row (
                            id uuid,
                            created_at timestamp with time zone,
                            updated_at timestamp with time zone,
                            is_deleted boolean,
                            prototype_id uuid,
                            path extensions.citext,
                            name extensions.citext,
                            description extensions.citext
                        )
                        on conflict (id) do update
                        set
                            created_at = excluded.created_at,
                            updated_at = excluded.updated_at,
                            is_deleted = excluded.is_deleted,
                            prototype_id = excluded.prototype_id,
                            path = excluded.path,
                            name = excluded.name,
                            description = excluded.description
                        where (
                            destination.created_at,
                            destination.updated_at,
                            destination.is_deleted,
                            destination.prototype_id,
                            destination.path,
                            destination.name,
                            destination.description
                        ) is distinct from (
                            excluded.created_at,
                            excluded.updated_at,
                            excluded.is_deleted,
                            excluded.prototype_id,
                            excluded.path,
                            excluded.name,
                            excluded.description
                        )
                        $remote_webpages$,
                        webpage_payload::text
                    )
                );
            end if;
        exception
            when others then
                get stacked diagnostics
                    caught_sqlstate = returned_sqlstate;

                raise exception
                    using
                        errcode = caught_sqlstate,
                        message = pg_catalog.format(
                            'Backstage reverse synchronization failed for prototype %s.',
                            prototype.prototype_id
                        );
        end;
    end loop;
end;
$function$;

revoke execute
on function public.sync_backstage_project_prototype_material_version_1()
from public, anon, authenticated, service_role;

commit;
```

The function must be owned by the trusted database owner that schedules the cron job. Do not grant browser-facing roles permission to call it. The error wrapper intentionally reports only the prototype ID and SQLSTATE; it does not reproduce the decrypted connection string, generated remote SQL, or JSON payload.

The function processes every configured prototype in ID order. A failure stops that invocation at the failing prototype. Earlier remote commands can already be committed, while later prototypes are left for the retry. The `IS DISTINCT FROM` predicates make all such retries safe and prevent physical rewrites when every synchronized value already matches.

### Reverse cron registration

Run this in Backstage only after the function and all prototype destination objects have been verified. The preflight prevents accidental replacement or duplication of the named job.

```sql
do $preflight$
begin
    if pg_catalog.to_regprocedure(
        'public.sync_backstage_project_prototype_material_version_1()'
    ) is null then
        raise exception 'Required reverse synchronization function is not available; no cron job was created.';
    end if;

    if exists (
        select 1
        from cron.job as job
        where job.jobname = 'sync-backstage-project-prototype-material-version-1'
    ) then
        raise exception 'Cron job sync-backstage-project-prototype-material-version-1 already exists; review it before changing its schedule.';
    end if;
end
$preflight$;

select cron.schedule(
    'sync-backstage-project-prototype-material-version-1',
    '10 seconds',
    $cron$select public.sync_backstage_project_prototype_material_version_1();$cron$
);
```

Do not update `cron.job` directly. Schedule and unschedule jobs only through `cron.schedule` and `cron.unschedule`. Leave the existing `sync-project-prototype-material-version-1` job untouched.

### Checked-in initial SQL integration

The create-on-empty files retain their existing transaction boundaries. Do not copy the hosted preflight blocks into the middle of those files. Instead, make these exact integrations:

Backstage initial SQL:

1. add `'project_prototypes_webpages'` once to the `existing_tables` array;
2. add the Backstage webpage table, index, and four triggers after the parent table and its existing triggers;
3. add `alter table public.project_prototypes_webpages enable row level security;` beside the other RLS statements;
4. add the two webpage policies beside the two `project_prototypes` policies;
5. add `public.project_prototypes_webpages` once to the existing centralized `REVOKE ALL PRIVILEGES ... FROM anon, authenticated, service_role` table list;
6. add it once to the existing centralized `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated, service_role` table list;
7. add the reverse function as a separate function without editing the forward function body;
8. revoke reverse-function execution from `public`, `anon`, `authenticated`, and `service_role`;
9. add the new reverse cron statement after the existing forward cron statement, without changing the existing statement.

Each prototype initial SQL:

1. add `'project_prototypes'` and `'project_prototypes_webpages'` once to the `existing_tables` array;
2. create the parent before the child;
3. create the child foreign-key index;
4. add both tables to the existing RLS section;
5. add all four policies;
6. add both tables once to the centralized revoke list;
7. add both tables once to the centralized grant list;
8. do not create table triggers and do not add either table to a material-sync query.

The final cron portion of Backstage initial SQL must contain both independent statements:

```sql
select cron.schedule(
    'sync-project-prototype-material-version-1',
    '10 seconds',
    $cron$select public.sync_project_prototype_material_version_1();$cron$
);

select cron.schedule(
    'sync-backstage-project-prototype-material-version-1',
    '10 seconds',
    $cron$select public.sync_backstage_project_prototype_material_version_1();$cron$
);
```

### Rollback SQL

Rollback is database-specific. First unschedule the reverse job in Backstage so it cannot run while destination objects are removed. Use this idempotent block and never delete from or update `cron.job` directly:

```sql
do $rollback$
declare
    reverse_job_id bigint;
begin
    for reverse_job_id in
        select job.jobid
        from cron.job as job
        where job.jobname = 'sync-backstage-project-prototype-material-version-1'
    loop
        perform cron.unschedule(reverse_job_id);
    end loop;
end
$rollback$;
```

Then remove the reverse function and Backstage webpage table:

```sql
begin;

drop function if exists
    public.sync_backstage_project_prototype_material_version_1();

drop table if exists public.project_prototypes_webpages;

commit;
```

Finally, run this separately in gPrototype4, gPrototype3, and gPrototype2, in that order:

```sql
begin;

drop table if exists public.project_prototypes_webpages;
drop table if exists public.project_prototypes;

commit;
```

Dropping the tables removes their policies, table grants, indexes, constraints, and table triggers. The reverse function is dropped explicitly before the Backstage table. Do not drop either existing Backstage `public.project_prototypes` or `public.sync_project_prototype_material_version_1()`. Do not unschedule the existing forward job. Rollback removes synchronized destination metadata, so capture any required evidence before applying it.

### Deployment preflight and baseline SQL

Run the following in Backstage before any deployment and save the result exactly:

```sql
select pg_catalog.pg_get_functiondef(
    'public.sync_project_prototype_material_version_1()'::regprocedure
) as forward_function_definition;

select
    job.jobid,
    job.jobname,
    job.schedule,
    job.command,
    job.nodename,
    job.nodeport,
    job.database,
    job.username,
    job.active
from cron.job as job
where job.jobname = 'sync-project-prototype-material-version-1';
```

The function query must return exactly one definition. The cron query must return exactly one active row with schedule `10 seconds` and command `select public.sync_project_prototype_material_version_1();`.

Before applying a prototype schema block, verify that the target is correct and empty of the two destination tables:

```sql
select
    pg_catalog.current_database() as current_database,
    current_user as current_user,
    pg_catalog.to_regclass('public.project_prototypes') as project_prototypes,
    pg_catalog.to_regclass('public.project_prototypes_webpages') as project_prototypes_webpages,
    pg_catalog.to_regtype('extensions.citext') as citext_type,
    pg_catalog.to_regprocedure('public.get_user_role()') as get_user_role_function;
```

Before applying the Backstage block, verify dependencies and the absence of the child table and reverse function:

```sql
select
    pg_catalog.current_database() as current_database,
    current_user as current_user,
    pg_catalog.to_regclass('public.project_prototypes') as project_prototypes,
    pg_catalog.to_regclass('public.project_prototypes_webpages') as project_prototypes_webpages,
    pg_catalog.to_regclass('vault.decrypted_secrets') as decrypted_secrets,
    pg_catalog.to_regprocedure('public.set_updated_at()') as set_updated_at_function,
    pg_catalog.to_regprocedure('public.record_audit_event()') as record_audit_event_function,
    pg_catalog.to_regprocedure('public.get_user_role()') as get_user_role_function,
    pg_catalog.to_regprocedure('extensions.dblink_exec(text,text)') as dblink_exec_function,
    pg_catalog.to_regprocedure(
        'public.sync_backstage_project_prototype_material_version_1()'
    ) as reverse_function;
```

Stop deployment if a target object already exists, a required dependency is null, the current database is not the intended hosted project, or a secret resolves to a different prototype than documented.

### Schema verification SQL

Run the following in each database, adjusting the table-name filter only when verifying Backstage.

Columns, defaults, and nullability:

```sql
select
    columns.table_schema,
    columns.table_name,
    columns.ordinal_position,
    columns.column_name,
    columns.data_type,
    columns.udt_schema,
    columns.udt_name,
    columns.is_nullable,
    columns.column_default
from information_schema.columns
where columns.table_schema = 'public'
  and columns.table_name in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
order by columns.table_name, columns.ordinal_position;
```

Primary keys, foreign keys, update behavior, and delete behavior:

```sql
select
    tables.relname as table_name,
    constraints.conname as constraint_name,
    constraints.contype as constraint_type,
    pg_catalog.pg_get_constraintdef(
        constraints.oid,
        true
    ) as constraint_definition
from pg_catalog.pg_constraint as constraints
join pg_catalog.pg_class as tables
  on tables.oid = constraints.conrelid
join pg_catalog.pg_namespace as schemas
  on schemas.oid = tables.relnamespace
where schemas.nspname = 'public'
  and tables.relname in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
order by tables.relname, constraints.conname;
```

Indexes:

```sql
select
    indexes.schemaname,
    indexes.tablename,
    indexes.indexname,
    indexes.indexdef
from pg_catalog.pg_indexes as indexes
where indexes.schemaname = 'public'
  and indexes.tablename in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
order by indexes.tablename, indexes.indexname;
```

RLS status and policy definitions:

```sql
select
    tables.relname as table_name,
    tables.relrowsecurity as rls_enabled,
    tables.relforcerowsecurity as rls_forced
from pg_catalog.pg_class as tables
join pg_catalog.pg_namespace as schemas
  on schemas.oid = tables.relnamespace
where schemas.nspname = 'public'
  and tables.relname in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
order by tables.relname;

select
    policies.schemaname,
    policies.tablename,
    policies.policyname,
    policies.permissive,
    policies.roles,
    policies.cmd,
    policies.qual,
    policies.with_check
from pg_catalog.pg_policies as policies
where policies.schemaname = 'public'
  and policies.tablename in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
order by policies.tablename, policies.policyname;
```

Explicit table grants:

```sql
select
    grants.table_schema,
    grants.table_name,
    grants.grantee,
    grants.privilege_type,
    grants.is_grantable
from information_schema.role_table_grants as grants
where grants.table_schema = 'public'
  and grants.table_name in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
  and grants.grantee in ('anon', 'authenticated', 'service_role')
order by grants.table_name, grants.grantee, grants.privilege_type;
```

Expect no `anon` row and exactly four privilege rows for each of `authenticated` and `service_role` per table.

Triggers:

```sql
select
    triggers.event_object_table as table_name,
    triggers.trigger_name,
    triggers.action_timing,
    triggers.event_manipulation,
    triggers.action_orientation,
    triggers.action_statement
from information_schema.triggers as triggers
where triggers.trigger_schema = 'public'
  and triggers.event_object_table in (
      'project_prototypes',
      'project_prototypes_webpages'
  )
order by triggers.event_object_table, triggers.trigger_name;
```

Backstage must show the existing parent triggers and the four new webpage triggers. Every prototype query must return no trigger for either destination table.

Backstage function definition, execution privileges, cron jobs, and recent runs:

```sql
select pg_catalog.pg_get_functiondef(
    'public.sync_backstage_project_prototype_material_version_1()'::regprocedure
) as reverse_function_definition;

select
    roles.rolname,
    pg_catalog.has_function_privilege(
        roles.rolname,
        'public.sync_backstage_project_prototype_material_version_1()',
        'EXECUTE'
    ) as can_execute
from pg_catalog.pg_roles as roles
where roles.rolname in (
    'anon',
    'authenticated',
    'service_role'
)
order by roles.rolname;

select
    job.jobid,
    job.jobname,
    job.schedule,
    job.command,
    job.username,
    job.active
from cron.job as job
where job.jobname in (
    'sync-project-prototype-material-version-1',
    'sync-backstage-project-prototype-material-version-1'
)
order by job.jobname;

select
    runs.jobid,
    jobs.jobname,
    runs.status,
    runs.return_message,
    runs.start_time,
    runs.end_time
from cron.job_run_details as runs
join cron.job as jobs
  on jobs.jobid = runs.jobid
where jobs.jobname in (
    'sync-project-prototype-material-version-1',
    'sync-backstage-project-prototype-material-version-1'
)
order by runs.start_time desc
limit 40;
```

The function-privilege query must return `false` for all three roles. The cron query must return exactly two active rows, each with its specified name, schedule, and command.

### Synchronization verification SQL

Use the exact path marker `/__gpronto_verification__/reverse-sync`. Before inserting anything, run this in Backstage and in all three prototypes; every result must be zero:

```sql
select pg_catalog.count(*) as existing_verification_rows
from public.project_prototypes_webpages
where path = '/__gpronto_verification__/reverse-sync';
```

Insert one source row for each configured Backstage prototype and retain the returned IDs:

```sql
insert into public.project_prototypes_webpages (
    prototype_id,
    path,
    name,
    description
)
select
    prototypes.id,
    '/__gpronto_verification__/reverse-sync',
    'Reverse synchronization verification',
    'Temporary verification row; remove after evidence is recorded.'
from public.project_prototypes as prototypes
where prototypes.material_sync_connection_secret_id is not null
order by prototypes.id
returning
    id,
    created_at,
    updated_at,
    is_deleted,
    prototype_id,
    path,
    name,
    description;
```

Expect one returned row for each configured prototype and currently three rows in total. Invoke the reverse function once as the trusted database owner:

```sql
select public.sync_backstage_project_prototype_material_version_1();
```

In each prototype, capture the received parent and webpage values and row versions:

```sql
select
    parents.id,
    parents.created_at,
    parents.updated_at,
    parents.is_deleted,
    parents.project_id,
    parents.name,
    parents.production_url,
    parents.staging_url,
    parents.development_url,
    parents.repository_url,
    parents.material_sync_connection_secret_id,
    parents.xmin::text as row_version
from public.project_prototypes as parents
where parents.id in (
    select webpages.prototype_id
    from public.project_prototypes_webpages as webpages
    where webpages.path = '/__gpronto_verification__/reverse-sync'
);

select
    webpages.id,
    webpages.created_at,
    webpages.updated_at,
    webpages.is_deleted,
    webpages.prototype_id,
    webpages.path,
    webpages.name,
    webpages.description,
    webpages.xmin::text as row_version
from public.project_prototypes_webpages as webpages
where webpages.path = '/__gpronto_verification__/reverse-sync'
order by webpages.id;
```

Each prototype must contain exactly one marker row, and it must be linked to that prototype's own parent. Every value, ID, and timestamp must equal Backstage. The parent `material_sync_connection_secret_id` must be null.

Run the reverse function again without changing Backstage. Rerun the preceding queries and confirm both `xmin` values are unchanged.

Update one source webpage by its recorded ID, then synchronize and verify that its ID is unchanged while its description and Backstage-generated `updated_at` are copied:

```sql
update public.project_prototypes_webpages
set description = 'Temporary verification row updated in Backstage.'
where id = '<recorded-webpage-id>'::uuid
returning id, updated_at, description;

select public.sync_backstage_project_prototype_material_version_1();
```

Soft-delete the same source webpage and verify that the same destination row becomes soft-deleted:

```sql
update public.project_prototypes_webpages
set is_deleted = true
where id = '<recorded-webpage-id>'::uuid
returning id, updated_at, is_deleted;

select public.sync_backstage_project_prototype_material_version_1();
```

For a parent update, use one SQL session so the temporary backup remains available. The test changes only `development_url`, restores it, and never changes the connection secret:

```sql
create temporary table reverse_sync_parent_verification_backup
on commit preserve rows
as
select
    prototypes.id,
    prototypes.development_url
from public.project_prototypes as prototypes
where prototypes.material_sync_connection_secret_id is not null
order by prototypes.id
limit 1;

update public.project_prototypes as prototypes
set development_url = 'https://reverse-sync-verification.invalid/'
from reverse_sync_parent_verification_backup as backup
where prototypes.id = backup.id
returning prototypes.id, prototypes.updated_at, prototypes.development_url;

select public.sync_backstage_project_prototype_material_version_1();
```

Verify the changed value in only that prototype. Restore the source value and synchronize the restoration before cleanup:

```sql
update public.project_prototypes as prototypes
set development_url = backup.development_url
from reverse_sync_parent_verification_backup as backup
where prototypes.id = backup.id
returning prototypes.id, prototypes.updated_at, prototypes.development_url;

select public.sync_backstage_project_prototype_material_version_1();

drop table reverse_sync_parent_verification_backup;
```

Verify the existing forward path independently by changing one ordinary prototype material row through the established application workflow, allowing the unchanged forward job to import and acknowledge it, and recording both the source acknowledgement and Backstage destination. Do not use either new destination table for that check.

### Verification cleanup SQL

After parent restoration has synchronized and all evidence is saved, hard-delete only marker webpage rows. Run this first in each prototype:

```sql
delete from public.project_prototypes_webpages
where path = '/__gpronto_verification__/reverse-sync'
returning id, prototype_id, path;
```

Then run the same statement in Backstage:

```sql
delete from public.project_prototypes_webpages
where path = '/__gpronto_verification__/reverse-sync'
returning id, prototype_id, path;
```

Finally run this in all four databases and require zero:

```sql
select pg_catalog.count(*) as remaining_verification_rows
from public.project_prototypes_webpages
where path = '/__gpronto_verification__/reverse-sync';
```

Do not delete a parent prototype. Backstage cleanup correctly produces an audit event because its webpage delete-audit trigger is active.

### Final implementation evidence

The final implementation report must identify:

1. the four checked-in initial SQL files changed;
2. the exact hosted project targeted by each SQL block;
3. the execution time and result of every preflight, forward deployment, cron registration, verification, cleanup, and rollback-preparation step;
4. the saved before-and-after forward-function definitions and forward cron rows;
5. the resulting reverse-function definition and reverse cron row;
6. all schema, RLS, policy, grant, trigger, advisor, access-matrix, synchronization, retry, `xmin`, forward-path, build, and cleanup results;
7. confirmation that no connection string or full synchronization payload was placed in logs or evidence.

Any failed statement stops that database's deployment. Do not continue to the next database until the current transaction has been rolled back or committed and its result recorded. Do not run cleanup until the evidence needed for acceptance has been captured.

## Hosted deployment

Do not run the complete initial SQL files against populated hosted databases.

Before changing hosted state:

1. capture the exact current forward synchronization function definition with `pg_get_functiondef` and the existing cron row as the no-change baseline;
2. prepare reviewed forward SQL for each database;
3. prepare rollback SQL that unschedules the new reverse cron job and drops the new reverse function before removing new objects;
4. build all four applications successfully;
5. confirm the three prototype connection secrets still resolve to gPrototype2, gPrototype3, and gPrototype4 respectively.

Deploy in this order:

1. gPrototype2 destination tables, constraints, index, RLS policies, and grants;
2. the same objects in gPrototype3;
3. the same objects in gPrototype4;
4. the Backstage webpage table, constraint, index, triggers, RLS policies, and grants;
5. the new standalone `public.sync_backstage_project_prototype_material_version_1()` function;
6. the new `sync-backstage-project-prototype-material-version-1` cron job, only after the function and all destination tables exist.

Each database's deployment SQL runs in its own transaction. Do not attempt one transaction across projects. Do not update or recreate the existing forward cron job.

After deployment, confirm exactly two active synchronization jobs exist: the unchanged `sync-project-prototype-material-version-1` job and the new `sync-backstage-project-prototype-material-version-1` job. Inspect `cron.job_run_details` for each job independently.

Preserve the exact applied SQL, rollback SQL, target project, execution result, and advisor result in the final implementation report.

## Verification

### Static verification

- Confirm all four initial SQL files contain the required tables and centralized security entries.
- Confirm all three prototype initial schemas match the documented destination schemas.
- Confirm the captured `public.sync_project_prototype_material_version_1()` definition and existing cron row are unchanged after deployment.
- Confirm `public.sync_backstage_project_prototype_material_version_1()` is defined exactly once and contains no forward material import or acknowledgement logic.
- Confirm the new reverse cron job calls only the standalone reverse function.
- Confirm every reverse payload omits `material_sync_connection_secret_id`.
- Confirm no prototype destination table has a local audit, update-touch, or mirrored-state trigger.

### Hosted schema verification

For all four projects, inspect columns, defaults, nullability, primary keys, foreign keys, indexes, RLS status, policies, and grants.

Confirm:

- `path`, `name`, and `description` are nullable;
- no `(prototype_id, path)` unique object exists;
- the foreign key uses `NO ACTION` for updates and deletes;
- `anon` has no table privileges;
- authenticated and `service_role` grants are explicit;
- applicable database advisors have no unresolved finding introduced by this change.

### Synchronization verification

1. Insert one clearly named Backstage verification webpage row for each prototype and record its ID.
2. Run `public.sync_backstage_project_prototype_material_version_1()` or wait for its scheduled run.
3. Confirm each prototype receives its own parent row and its own verification webpage row, and receives no verification row linked to another prototype.
4. Confirm destination IDs and timestamps equal Backstage values.
5. Confirm destination `material_sync_connection_secret_id` remains null.
6. Record the original values, update one parent field and one webpage field, synchronize again, and confirm the same destination IDs update.
7. Capture destination `xmin` values, run synchronization without source changes, and confirm unchanged rows retain their `xmin` values.
8. Set one verification webpage's Backstage `is_deleted` value to `true` and confirm the destination becomes soft-deleted.
9. Change one ordinary prototype material row and confirm the unchanged forward function still imports and acknowledges it independently.
10. Confirm both scheduled jobs complete independently on their next runs and that a failure recorded for one does not alter the other's definition or schedule.

### Access verification

Using existing authenticated standard and administrator accounts plus the trusted service role, verify:

- `anon` cannot access either resource;
- a standard authenticated user can select but cannot insert, update, or delete;
- an authenticated administrator can select, insert, update, and delete;
- `service_role` can perform the operations required for trusted maintenance;
- the direct connection used by `dblink` can execute both destination upserts.

### Build verification

Run this command in `gPronto.Application.Backstage:.`, `gPronto.Application.gPrototype2:.`, `gPronto.Application.gPrototype3:.`, and `gPronto.Application.gPrototype4:.`:

```bash
npm run build
```

### Verification cleanup

After recording the results, restore the changed parent field, synchronize the restored value, and use reviewed cleanup SQL to hard-delete only the clearly named verification webpage rows from each prototype and then from Backstage. Do not delete a parent prototype row. Confirm no verification webpage row remains.

## Acceptance criteria

Implementation is complete when:

- the new schema exists in every checked-in initial SQL file and every hosted database;
- each prototype receives only its own Backstage parent and webpage data;
- `material_sync_connection_secret_id` is never copied to a prototype;
- inserts, updates, and soft deletions propagate from Backstage;
- unchanged rows are not physically updated;
- a retry repairs a partial parent-before-webpage result;
- `public.sync_project_prototype_material_version_1()` and its cron row remain unchanged;
- the standalone reverse function and its cron job operate independently from the existing forward synchronization;
- the existing forward material import and acknowledgement continue to work;
- RLS, policies, and grants produce the specified access matrix;
- exactly two synchronization cron jobs remain healthy: one existing forward job and one new reverse job;
- all four builds pass;
- hosted verification succeeds and all verification rows are removed.

## References

- [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [PostgreSQL dblink_exec](https://www.postgresql.org/docs/current/contrib-dblink-exec.html)
- [PostgreSQL foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html)
