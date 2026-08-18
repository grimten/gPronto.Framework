# gLayouts

## Status

Draft

## Scope

gPronto.Framework:The definition and purpose of a **gLayout**.
gPronto.Framework:Composition of fixed and open slots.
gPronto.Framework:Source-folder, source-file, component, props-type, and CSS naming.
gPronto.Framework:Public export and application-use requirements.
gPronto.Framework:Excludes the props and slots of individual **gLayouts**.

## Verification

Date: 2026-08-18

## Rules

<rule category="slots">

Every **gLayout** property whose name matches `^openSlot([A-Z][a-z0-9]+)+$` is an **Open slot**. Every **Open slot** **MUST** contain exactly one **gComponent**.

<agent-error>A **gLayout** **MUST NOT** accept a webpage-supplied **gComponent** through any other property.</agent-error>
<agent-error-explanation>`GLayoutSingleColumn` currently accepts webpage content through `children`, and `GLayoutTwoColumnNavigation` currently accepts it through `content`.</agent-error-explanation>

Every JSX element written directly in a **gLayout** source file whose identifier matches `^GComponent([A-Z][a-z0-9]+)+$` defines exactly one **Fixed slot** containing that JSX element. A **Fixed slot** **MUST NOT** be defined in any other way.

Every JSX element written directly in a **gLayout** source file **MUST** be a lowercase HTML element, a React fragment, or have an identifier matching `^GComponent([A-Z][a-z0-9]+)+$`.

<agent-error>Every **gComponent** rendered by a **gLayout** **MUST** be either the **gComponent** assigned to a **Fixed slot** or a **gComponent** received through an **Open slot** prop.</agent-error>
<agent-error-explanation>`GLayoutSingleColumn` and `GLayoutTwoColumnNavigation` currently receive webpage content through properties that are not **Open slot** properties.</agent-error-explanation>

Every **Fixed slot** and **Open slot** **MUST** be present in every JSX result returned by the **gLayout**.

A **gLayout** source file **MUST NOT** import a runtime value unless that value is a **gComponent** rendered through a **Fixed slot**.

A **gLayout** source file **MUST NOT** call a function named `use` or whose name matches `^use[A-Z]`.

A **gLayout** source file **MUST NOT** declare a runtime value outside the exported `GLayout<Name>` function.

The exported `GLayout<Name>` function body **MUST** contain exactly one statement, and that statement **MUST** be its return statement.

Every JSX expression written directly in a **gLayout** source file **MUST** be either a direct reference to an **Open slot** property or a string, number, boolean, or `null` literal.

JSX written directly in a **gLayout** source file **MUST NOT** contain a prop whose name matches `^on[A-Z]`.

</rule>

<rule category="none">

Every **gLayout** **MUST** live in its own direct-child folder under `gPronto.Framework:gPronto.Framework/gLayouts`.

Every **gLayout** folder name **MUST** match `^gLayout\.([A-Z][a-z0-9]+)+$`.

Every **gLayout** folder **MUST** contain exactly one file, named `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.<Name>/gLayout.<Name>.tsx`. That file **MUST** export exactly one runtime value, named `GLayout<Name>`. That file **MUST** export exactly one props type, named `GLayout<Name>Props`, declared with `Readonly`. A **gLayout** **MUST NOT** export any other value or type.

A **gLayout** **MUST NOT** use a default export.

`<Name>` **MUST NOT** contain `gPronto`, `Framework`, `Layout`, or `Component`.

Every **gLayout** **MUST** be exposed through exactly one export line in `gPronto.Framework:gPronto.Framework/gPronto.Framework.PublicApi.gLayoutExports.ts`.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-glayouts">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current **gLayout** source structure, composition, naming, exports, and application use. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify every affected **gLayout** and file. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## What is a gLayout

A **gLayout** is a React component created in **gPronto.Framework** that arranges the content of one webpage in a **gPronto.Application**.

A **gLayout** has one or more slots. Each slot is either an **Open slot** or a **Fixed slot**, and a **gLayout** can combine both kinds.

An **Open slot** allows the webpage that uses the **gLayout** to supply exactly one **gComponent**.

A **Fixed slot** contains one **gComponent** supplied by the **gLayout**.

The purpose of a **gLayout** is to arrange the content on the webpage.

A **gLayout** is designed for a **gPronto.Application** opened in a web browser on a desktop or laptop computer. A **gLayout** is not designed for mobile phones or tablets.

## Why have gLayouts

We have **gLayouts** so that we can limit the number of options the **gPronto.Applications** have.

Limiting the number of options enables rapid development of **gPronto.Application**.

`<Name>` is the **gLayout** folder name with the leading `gLayout.` removed.

