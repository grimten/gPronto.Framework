export const gLayoutSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gLayoutSchema",
  title: "gLayout",
  description: "Every gLayout, its open slots, its fixed slots, and its defaults.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gLayoutSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.gLayouts",
    consumers: [
      "the gLayout registry factory",
      "the public gLayout prop-contract generator",
      "the gLayout conformance checker",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksRegistryCreation: true,
      currentLayoutsRemainAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedSlotAndDefaultDefinitionsAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the gLayout registry is exposed",
    },
  },
  folder: {
    parent: "gPronto.Framework/gLayouts",
    namePattern: "^gLayout\\.([A-Z][a-z0-9]+)+$",
    fileName: "gLayout.<Name>.tsx",
    fileCount: 1,
    forbiddenNameWords: ["gPronto", "Framework", "Layout", "Component"],
  },
  exports: {
    runtimeValue: "GLayout<Name>",
    propsType: "GLayout<Name>Props",
    propsTypeDeclaredWith: "Readonly",
    otherExportsAllowed: false,
    defaultExportAllowed: false,
    publicExportBarrel: "gPronto.Framework.PublicApi.gLayoutExports.ts",
  },
  slots: {
    openSlotPattern: "^openSlot([A-Z][a-z0-9]+)+$",
    openSlotValue: "exactly one gComponent",
    fixedSlotDefinition:
      "a JSX element written directly in the gLayout source whose identifier matches ^GComponent([A-Z][a-z0-9]+)+$",
    everySlotPresentInEveryResult: true,
  },
  sourceRestrictions: {
    importsAllowed: "only gComponents rendered through a fixed slot",
    hookCallsAllowed: false,
    runtimeValuesOutsideTheExportedFunctionAllowed: false,
    statementsInFunctionBody: 1,
    jsxExpressionsAllowed:
      "a direct reference to an open slot property, or a string, number, boolean, or null literal",
    eventHandlerPropsAllowed: false,
  },
  root: {
    element: "main",
    boxSizing: "border-box",
    minimumHeight: "100dvh",
    paddingTop: "30px",
    paddingBottom: "30px",
  },
  registeredLayoutCount: 3,
  catalogKey: {
    pattern: "^[a-z][A-Za-z0-9]*$",
    exportName: "GLayout followed by the PascalCase catalog key",
    sourceFolder: "gLayout followed by a dot and the PascalCase catalog key",
  },
  gLayouts: {
    singleColumn: {
      openSlots: {
        openSlotContent: {
          datatype: "ReactNode",
          required: true,
          nullable: false,
        },
      },
      fixedSlots: [],
      regions: {
        content: { className: "glayout-single-column__content" },
      },
    },
    twoColumnNavigation: {
      openSlots: {
        openSlotContent: {
          datatype: "ReactNode",
          required: true,
          nullable: false,
        },
      },
      fixedSlots: ["GComponentNavigation"],
      regions: {
        navigation: {
          className: "glayout-two-column-navigation__navigation",
          holds: "GComponentNavigation",
        },
        content: {
          className: "glayout-two-column-navigation__content",
          holds: "openSlotContent",
        },
      },
    },
    cardsModern: {
      openSlots: {
        openSlotCardHeader: {
          datatype: "ReactNode",
          required: true,
          nullable: false,
        },
        openSlotCardBody: {
          datatype: "ReactNode",
          required: true,
          nullable: false,
        },
      },
      fixedSlots: ["GComponentHeader", "GComponentFooter"],
      regions: {
        header: {
          className: "glayout-cards-modern__header-section",
          holds: "GComponentHeader",
        },
        body: {
          className: "glayout-cards-modern__body-section",
          holds: ["openSlotCardHeader", "openSlotCardBody"],
        },
        footer: {
          className: "glayout-cards-modern__footer-section",
          holds: "GComponentFooter",
        },
      },
      sectionWidth: "min(100%, 900px)",
      sectionSeparation: "24px",
    },
  },
} as const;
