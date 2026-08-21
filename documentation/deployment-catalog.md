# Deployment catalog

## Status

Draft

## Scope

gPronto.Application:The current local and hosted deployment catalog.
gPronto.Application:Excludes deployment procedures and implementation requirements.

## Verification

Date: 2026-08-19

## Rules

<rule category="catalog" id="deployment-catalog-current">

The catalog **MUST** contain every current **gPronto.Application** deployment and its current local ports, Cloudflare Pages projects, and primary domains. It **MUST NOT** contain a deployment that is not current.

</rule>

<rule category="catalog" id="deployment-catalog-overview">

This document **MUST** describe only the current deployment inventory. It **MUST NOT** define how a deployment is built, configured, or published.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-deployment-catalog">

The **Agent** **MUST** validate this catalog against every current application Vite configuration, the shared deployment settings, and current Cloudflare Pages configuration. The **Agent** has approval to update only this document when a catalog entry is missing, extra, or stale.

</instructions>

## Deployments

| Application | Development | Preview | Production project | Production domain    | Stage project       | Stage domain              |
| ----------- | ----------- | ------- | ------------------ | -------------------- | ------------------- | ------------------------- |
| gBackstage  | 5179        | 4179    | `grimten-com`      | `grimten.com`        | `stage-grimten-com` | `stage.grimten.com`       |
| gPrototype2 | 5176        | 4176    | `proto2`           | `proto2.grimten.com` | `stageproto2`       | `stageproto2.grimten.com` |
| gPrototype3 | 5177        | 4177    | `proto3`           | `proto3.grimten.com` | `stageproto3`       | `stageproto3.grimten.com` |
| gPrototype4 | 5178        | 4178    | `proto4`           | `proto4.grimten.com` | `stageproto4`       | `stageproto4.grimten.com` |

Each hosted deployment also has its Cloudflare-provided `pages.dev` domain.

