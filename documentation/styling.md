# Styling

## Status

Draft

## Scope

gPronto.Framework:Styling-option source structure, registration, runtime identifiers, and application selection.
gPronto.Framework:CSS class naming, ownership, and source-backed usage.
gPronto.Framework:Variant class names and cross-option selector parity.
gPronto.Framework:Selector, pseudo-selector, and styling-file restrictions.
gPronto.Framework:The global reset and root custom properties.
gPronto.Framework:Framework icon ownership and presentation conventions.
gPronto.Framework:Excludes application-owned style overrides and styling-driven behavior changes.

## Verification

Date: 2026-08-18

## Rules

<rule category="styling-source-structure" id="styling-root-folder">

The framework styling folder **MUST** be:

`gPronto.Framework:gPronto.Framework/gStylings`

</rule>

<rule category="styling-source-structure" id="styling-option-folder-name">

Every direct-child folder of `gPronto.Framework:gPronto.Framework/gStylings` **MUST** match:

```text
^gStyling-[a-z0-9]+(?:-[a-z0-9]+)*$
```

`gPronto.Framework:gPronto.Framework/gStylings` **MUST NOT** contain a direct-child file.

</rule>

<rule category="styling-source-structure" id="styling-option-file">

Every direct-child folder of `gPronto.Framework:gPronto.Framework/gStylings` **MUST** contain exactly one file.

The filename **MUST** equal the folder name followed by `.css`.

A styling-option folder **MUST NOT** contain another folder.

</rule>

<rule category="styling-source-structure" id="runtime-identifier">

The runtime identifier of a styling option **MUST** equal its folder name.

</rule>

<rule category="css-class-naming" id="glayout-class-prefix">

Every CSS class token that code in a `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.<Name>/gLayout.<Name>.tsx` file assigns to rendered HTML **MUST** begin with the kebab-case form of the complete **gLayout** name.

The kebab-case form converts the `gLayout.` prefix to `glayout-`, inserts a hyphen before each word in `<Name>`, and converts every letter to lowercase.

For example, every CSS class assigned by `gPronto.Framework:gPronto.Framework/gLayouts/gLayout.SingleColumn/gLayout.SingleColumn.tsx` **MUST** begin with `glayout-single-column`.

</rule>

<rule category="css-class-naming" id="gcomponent-class-prefix">

Every CSS class token that code in a `gPronto.Framework:gPronto.Framework/gComponents/gComponent.<Name>/gComponent.<Name>.tsx` file assigns to rendered HTML **MUST** begin with the kebab-case form of the complete **gComponent** name.

The requirement applies whether the class token is written directly in that file or obtained from another module.

The kebab-case form converts the `gComponent.` prefix to `gcomponent-`, inserts a hyphen before each word in `<Name>`, and converts every letter to lowercase.

For example, every CSS class assigned by `gPronto.Framework:gPronto.Framework/gComponents/gComponent.AuthenticationCallback/gComponent.AuthenticationCallback.tsx` **MUST** begin with `gcomponent-authentication-callback`.

</rule>

<rule category="css-class-ownership" id="single-owner">

Every CSS class token assigned by **gPronto.Framework** source **MUST** have exactly one owner: one **gComponent** or one **gLayout**.

Source for another **gComponent** or **gLayout** **MUST NOT** assign that class token.

Rendering a child **gComponent** does not transfer ownership of the child’s CSS classes to the parent.

Every class selector within one CSS selector **MUST** belong to the same **gComponent** or **gLayout**.

A CSS selector **MUST NOT** combine classes owned by different **gComponents** or **gLayouts**.

</rule>

<rule category="css-class-naming" id="selector-class-prefix">

Every class name used by a CSS class selector in a registered styling option **MUST** begin with `gcomponent-` or `glayout-`.

</rule>

<rule category="css-selectors" id="selector-scope">

A CSS selector without a class selector **MUST** be exactly one selector defined by `styling.md: variable:[global-reset-selector-sequence]`.

Every other CSS selector **MUST** contain at least one class selector.

A CSS selector **MUST NOT** contain a type selector or universal selector unless the complete CSS selector is defined by `styling.md: variable:[global-reset-selector-sequence]`.

A CSS selector **MUST NOT** contain an ID selector or an attribute selector.

</rule>

<rule category="css-selectors" id="pseudo-selector-scope">

Except for `:root`, `*::before`, and `*::after`, every pseudo-class or pseudo-element **MUST** be attached to a class owned by the selector’s **gComponent** or **gLayout**.

A pseudo-class or pseudo-element **MUST NOT** exist as an unscoped selector unless it is exactly `:root`, `*::before`, or `*::after`.

</rule>

<rule category="css-selectors" id="single-selector-per-rule">

Every CSS style rule **MUST** contain exactly one selector.

A comma-separated selector list **MUST NOT** exist.

When two selectors need identical declarations, each selector **MUST** have its own complete style rule, regardless of duplication.

</rule>

<rule category="unused-css-classes" id="source-backed-class">

Every CSS class selector defined by a registered styling option **MUST** match a class token that the current **gPronto.Framework** source can assign to rendered HTML.

A CSS class selector that cannot match a currently rendered class token **MUST NOT** exist.

</rule>

<rule category="variant-class-naming" id="variant-value-format">

Every value of a **gComponent** or **gLayout** prop named `variant` **MUST** match:

```text
^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$
```

Every **gComponent** or **gLayout** with a prop named `variant` **MUST** assign exactly one variant modifier class whenever it renders.

The requirement applies when the `variant` prop is supplied and when the default variant is used.

The variant modifier class **MUST** be:

```text
<owner-root-class>--<variant-value>
```

One variant modifier class **MUST** identify exactly one variant value of exactly one **gComponent** or **gLayout**.

A variant modifier class **MUST NOT** be reused by another variant, **gComponent**, or **gLayout**.

</rule>

<rule category="styling-file-structure" id="matching-selector-structure">

Every registered styling CSS file **MUST** contain:

1. the same number of CSS style rules;
2. the same selector at each position;
3. the selectors in the same order.

Every registered styling CSS file **MUST** begin with exactly one style rule for each selector defined by `styling.md: variable:[global-reset-selector-sequence]`, in the defined order.

Every registered styling CSS file **MUST** define the same selected `:root` custom-property names in the same order.

The value of a corresponding custom property **MAY** differ between styling options.

Declarations inside corresponding non-`:root` style rules **MAY** differ in property names, property values, and declaration count.

A registered styling CSS file **MUST** retain every required selector block, including when the styling option needs no declaration inside that block.

</rule>

<rule category="root-custom-properties" id="root-content">

The `:root` selector **MUST** define only CSS custom properties.

</rule>

<rule category="root-custom-properties" id="root-allow-list">

A CSS custom property defined under `:root` **MUST** be exactly one of:

```text
--gpronto-color-brand-primary
--gpronto-color-brand-primary-hover
--gpronto-color-brand-primary-active
--gpronto-color-state-success
--gpronto-color-state-info
--gpronto-color-state-error
--gpronto-color-state-warning
--gpronto-color-state-hover
--gpronto-color-state-selected
--gpronto-color-surface-standard
--gpronto-color-surface-subtle
--gpronto-color-surface-elevated
--gpronto-color-surface-disabled
--gpronto-color-border-standard
--gpronto-color-border-secondary
--gpronto-color-border-control-hover
--gpronto-color-text-primary
--gpronto-color-text-secondary
--gpronto-color-text-disabled
--gpronto-font-family-standard
--gpronto-font-size-base
--gpronto-line-height-standard
--gpronto-height-control-standard
--gpronto-radius-compact
--gpronto-radius-standard
```

An allow-listed custom property **MAY** be omitted.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-styling">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current style registry, public style options, CSS sources, icon conventions, and application selections. The **Agent** has approval to inspect and build those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the style, selector, class, variable, or application that fails. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## Styling source structure

The framework stores every styling option under:

`gPronto.Framework:gPronto.Framework/gStylings`

The folder, file, and runtime identifier use the same name.

The current registered options are listed in [Styling catalog](styling-catalog.md).

## CSS class ownership

A CSS class belongs to the **gComponent** or **gLayout** named by its prefix.

For example, `.gcomponent-typography` belongs only to `GComponentTypography`. Another **gComponent**, **gLayout**, or variant cannot assign that class.

A parent may render a child **gComponent**, but the child retains ownership of its own classes.

A selector may combine multiple classes belonging to the same owner:

```css
.gcomponent-alert--success: not(.gcomponent-alert--filled);
```

A selector cannot combine classes belonging to different owners:

```css
.gcomponent-data-table__write-header .gcomponent-typography
```

## Variant class names

A variant modifier class consists of the owner’s root class, two hyphens, and the exact variant value.

```text
<owner-root-class>--<variant-value>
```

Examples:

```text
gcomponent-typography--h1
gcomponent-alert--filled
gcomponent-badge--outline
```

The default variant receives its modifier class in the same way as an explicitly supplied variant.

## Global reset

The selected registered styling CSS file owns the global reset.

Every styling option begins with the ordered global selector sequence defined by `styling.md: variable:[global-reset-selector-sequence]`.

`:root` defines the approved global custom properties. The remaining selectors in that sequence reset document-wide box sizing, font smoothing, text-size adjustment, body spacing, typography, text color, and background color.

## Selector restrictions

Type selectors target HTML element names such as `body`, `html`, `div`, `button`, and `input`. Universal selectors target `*`. ID selectors begin with `#`. Attribute selectors use brackets, such as `[disabled]`.

The type selectors and universal selectors defined by `styling.md: variable:[global-reset-selector-sequence]` are permitted only as the required global reset. Every other type selector or universal selector is prohibited because it can style HTML outside the owning **gComponent** or **gLayout**.

Pseudo-classes describe a state, such as `:hover`, `:focus-visible`, or `:disabled`. Pseudo-elements describe a rendered part, such as `::placeholder` or `::before`.

A pseudo-class or pseudo-element is permitted when an owning class scopes it:

```css
.gcomponent-button:hover
.gcomponent-input__control::placeholder
```

These selectors are prohibited because they are not scoped to an owning class:

```css
:hover
button:hover
::placeholder
#root
[disabled]
```

The only selectors permitted without an owning **gComponent** or **gLayout** class are those defined by `styling.md: variable:[global-reset-selector-sequence]`. `:root` is a pseudo-class, not a CSS class.

## Styling-file structure

Every styling CSS file has the same ordered selector skeleton. Only declarations inside corresponding selector blocks may differ.

Comma-separated selectors are not used. Duplicate declarations are written in separate rule blocks:

```css
.gcomponent-typography--normal {
  line-height: var(--gpronto-line-height-standard);
}

.gcomponent-typography--small {
  line-height: var(--gpronto-line-height-standard);
}
```

A styling option keeps an empty selector block when that selector needs no declarations in that styling option. This preserves the shared selector structure.

## Global custom properties

A CSS custom property can hold a color, font family, size, spacing value, shadow, timing value, or another CSS value. The substituted value must be valid for the CSS property where `var(...)` uses it.

Only the custom properties in the `:root` allow-list are global framework styling values.

A table-, header-, placeholder-, form-width-, action-width-, or other owner-specific value is declared directly in its owning selector instead of under `:root`.

## Variables

<variable id="global-reset-selector-sequence">

```text
:root
html
*
*::before
*::after
body
```

</variable>

