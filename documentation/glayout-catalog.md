# gLayout catalog

## Status

Draft

## Scope

gPronto.Framework:The complete public **gLayout** catalog and its registry.
gPronto.Framework:Props, open slots, and fixed slots of `GLayoutSingleColumn`.
gPronto.Framework:Props, open slots, and fixed slots of `GLayoutTwoColumnNavigation`.
gPronto.Framework:Props, open slots, and fixed slots of `GLayoutCardsModern`.
gPronto.Framework:Excludes the general source-structure requirements for creating a **gLayout**.

## Verification

Date: 2026-08-18

## Rules

<rule category="catalog">

This catalog **MUST** contain exactly `GLayoutSingleColumn`, `GLayoutTwoColumnNavigation`, and `GLayoutCardsModern`.

</rule>

<rule category="single-column">

<agent-error>`GLayoutSingleColumnProps` **MUST** declare exactly one property: required `openSlotContent: ReactNode`.</agent-error>
<agent-error-explanation>The current source declares exactly `children: ReactNode`.</agent-error-explanation>

</rule>

<rule category="single-column">

<agent-error>`GLayoutSingleColumn` **MUST** render exactly one **Open slot** and **MUST NOT** render a **Fixed slot**.</agent-error>
<agent-error-explanation>The current `children` property does not match the required **Open slot** naming pattern.</agent-error-explanation>

</rule>

<rule category="two-column-navigation">

<agent-error>`GLayoutTwoColumnNavigationProps` **MUST** declare exactly one property: required `openSlotContent: ReactNode`.</agent-error>
<agent-error-explanation>The current source declares exactly `content: ReactNode`.</agent-error-explanation>

</rule>

<rule category="cards-modern">

`GLayoutCardsModernProps` **MUST** declare exactly two properties: required `openSlotCardHeader: ReactNode` and required `openSlotCardBody: ReactNode`.

</rule>

<rule category="cards-modern">

`GLayoutCardsModern` **MUST** render fixed `GComponentHeader` and `GComponentFooter` **gComponents**, plus exactly two **Open slots** containing `openSlotCardHeader` and `openSlotCardBody`.

</rule>

<rule category="two-column-navigation">

<agent-error>`GLayoutTwoColumnNavigation` **MUST** render exactly one **Fixed slot** containing `GComponentNavigation` and exactly one **Open slot** containing `openSlotContent`.</agent-error>
<agent-error-explanation>The current source renders the webpage-supplied `content` property, which does not match the required **Open slot** naming pattern.</agent-error-explanation>

</rule>

<rule category="root">

Every public **gLayout** in this catalog **MUST** render a `main` root element.

Every public **gLayout** root **MUST** use `box-sizing: border-box`, a minimum height of `100dvh`, and exactly `30px` of top and bottom padding.

</rule>

## Instructions

<instructions category="validation" approval="silent" id="validate-glayout-catalog">

The **Agent** **MUST** validate every **Rule** and factual statement in this document against the current public **gLayout** exports, implementations, props, and slots. The **Agent** has approval to inspect those sources and to add, update, or remove only validation-error tags in this document.

When validation fails, the **Agent** **MUST** mark the erroneous text by applying `documentation.md: rule:[documentation-tag-requirements]`, and the `agent-error-explanation` **MUST** identify the affected **gLayout**, property, or slot. When every validation passes, the **Agent** **MUST** remove obsolete validation-error tags.

</instructions>

## GLayoutSingleColumn

`GLayoutSingleColumn` has one required prop:

| Prop              | Type        | Slot              |
| ----------------- | ----------- | ----------------- |
| `openSlotContent` | `ReactNode` | One **Open slot** |

The root is a `main` element. The **Open slot** is a child `div` with the class `gpronto-layout-single-column__content`.

```tsx
<GLayoutSingleColumn openSlotContent={content} />
```

## GLayoutTwoColumnNavigation

`GLayoutTwoColumnNavigation` has one required prop:

| Prop              | Type        | Slot              |
| ----------------- | ----------- | ----------------- |
| `openSlotContent` | `ReactNode` | One **Open slot** |

The root is a `main` element with two child `div` elements:

| Column     | Class                                              | Slot                                                 |
| ---------- | -------------------------------------------------- | ---------------------------------------------------- |
| Navigation | `gpronto-layout-two-column-navigation__navigation` | One **Fixed slot** containing `GComponentNavigation` |
| Content    | `gpronto-layout-two-column-navigation__content`    | One **Open slot** containing `openSlotContent`       |

```tsx
<GLayoutTwoColumnNavigation openSlotContent={content} />
```

## GLayoutCardsModern

`GLayoutCardsModern` has two required props:

| Prop                 | Type        | Slot              |
| -------------------- | ----------- | ----------------- |
| `openSlotCardHeader` | `ReactNode` | One **Open slot** |
| `openSlotCardBody`   | `ReactNode` | One **Open slot** |

Each **Open slot** receives exactly one **gComponent**. The `main` root uses a vertical flex layout and contains these centered primary sections in order:

| Section | Class                                  | Content                                          |
| ------- | -------------------------------------- | ------------------------------------------------ |
| Header  | `glayout-cards-modern__header-section` | One **Fixed slot** containing `GComponentHeader` |
| Body    | `glayout-cards-modern__body-section`   | A full-width card containing both **Open slots** |
| Footer  | `glayout-cards-modern__footer-section` | One **Fixed slot** containing `GComponentFooter` |

Each primary section uses `width: min(100%, 900px)`, adjacent sections are separated by `24px`, and the body grows to occupy the remaining height. The body card uses the registered elevated surface color, standard border, standard radius, and a secondary border between its header and body regions.

```tsx
<GLayoutCardsModern
  openSlotCardHeader={cardHeader}
  openSlotCardBody={cardBody}
/>
```

