export const gWebpageSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gWebpageSchema",
  title: "Webpage",
  description:
    "The complete application webpage module, definition, registry, composition, navigation, visibility, and default contract.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gWebpageSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.Webpages",
    consumers: [
      "the webpage-module registry factory",
      "the registered-webpage validator",
      "the route composition",
      "the document-title synchronizer",
      "the navigation and visibility runtimes",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidWebpageBlocksRegistryCreation: true,
      currentDefinitionsRemainAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedDefinitionValidationAndDefaultsAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the webpage registry is exposed",
    },
  },
  source: {
    parentFolder: "src/webpages",
    folderNamePattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\\.webpage$",
    fileName: "webpage.tsx",
    filesPerFolder: 1,
    subfoldersAllowed: false,
    forbiddenNameWords: [
      "gpronto",
      "framework",
      "webpage",
      "gcomponent",
      "glayout",
    ],
    export: {
      exactCount: 1,
      name: "webpage",
      declaration: "const",
      satisfies: "GProntoFrameworkRegisteredWebpageDefinition",
      defaultExportAllowed: false,
    },
  },
  definition: {
    exactOwnKeys: ["id", "route", "component", "metadata"],
    fields: {
      id: {
        datatype: "string",
        required: true,
        nullable: false,
        unique: true,
        derivedFrom: "the folder name without the trailing .webpage",
      },
      route: {
        datatype: "routeDefinition",
        required: true,
        nullable: false,
      },
      component: {
        datatype: "React component function",
        required: true,
        nullable: false,
        declaredIn: "the same webpage.tsx file",
      },
      metadata: {
        datatype: "webpageMetadata",
        required: true,
        nullable: false,
      },
    },
  },
  route: {
    discriminator: "kind",
    variants: {
      path: {
        exactOwnKeys: ["kind", "path"],
        fields: {
          kind: {
            datatype: "string",
            required: true,
            nullable: false,
            allowedValues: ["path"],
          },
          path: {
            datatype: "string",
            required: true,
            nullable: false,
            startsWith: "/",
            unique: true,
          },
        },
      },
      notFound: {
        exactOwnKeys: ["kind"],
        fields: {
          kind: {
            datatype: "string",
            required: true,
            nullable: false,
            allowedValues: ["not-found"],
          },
        },
        countPerApplication: 1,
        requiredId: "not-found",
        renderedAs: "the catch-all route",
      },
    },
  },
  metadata: {
    exactOwnKeys: ["title", "navigation", "visibility"],
    fields: {
      title: {
        datatype: "string",
        required: true,
        nullable: false,
        minimumNonWhitespaceCharacters: 1,
      },
      navigation: {
        datatype: "navigationMetadata",
        required: true,
        nullable: false,
      },
      visibility: {
        datatype: "visibilityMetadata",
        required: true,
        nullable: false,
      },
    },
    navigation: {
      exactOwnKeys: ["visible", "label", "order", "parentId"],
      fields: {
        visible: {
          datatype: "boolean",
          required: false,
          nullable: false,
          default: false,
        },
        label: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "",
          minimumNonWhitespaceCharactersWhen: "visible is true",
        },
        order: {
          datatype: "number",
          required: false,
          nullable: true,
          default: null,
          uniqueWithinParent: true,
        },
        parentId: {
          datatype: "string",
          required: false,
          nullable: true,
          default: null,
          mustEqualWhenNonNull: "another webpage id in the same registry",
        },
      },
      parentRelationshipsMayContainCycles: false,
    },
    visibility: {
      discriminator: "mode",
      defaultMode: "public",
      variants: {
        public: {
          exactOwnKeys: ["mode", "redirectPath"],
          fields: {
            mode: {
              datatype: "string",
              required: true,
              nullable: false,
              allowedValues: ["public"],
            },
            redirectPath: {
              datatype: "string",
              required: false,
              nullable: true,
              default: null,
              allowedValues: [null],
            },
          },
        },
        authenticated: {
          exactOwnKeys: ["mode", "redirectPath"],
          fields: {
            mode: {
              datatype: "string",
              required: true,
              nullable: false,
              allowedValues: ["authenticated"],
            },
            redirectPath: {
              datatype: "string",
              required: true,
              nullable: false,
              mustEqual: "the path of a public webpage in the same registry",
            },
          },
        },
      },
    },
  },
  normalization: {
    appliesBeforeValidation: true,
    suppliesOnlyDeclaredDefaults: true,
    doesNotMutateTheApplicationExport: true,
    resultIsDeeplyImmutable: true,
  },
  composition: {
    rootElement: "exactly one registered gLayout",
    openSlotPattern: "^openSlot([A-Z][a-z0-9]+)+$",
    openSlotValue: "exactly one registered gComponent element",
    allowedJsxIdentifierPatterns: [
      "^GLayout([A-Z][a-z0-9]+)+$",
      "^GComponent([A-Z][a-z0-9]+)+$",
    ],
    renderingOutsideTheLayoutAllowed: false,
    applicationOwnedStyleAttributesAllowed: false,
    applicationOwnedStylesheetImportsAllowed: false,
  },
  imports: {
    moduleSpecifier: "@gpronto.framework",
    runtimeImportsMayOnlyBeRegisteredGLayoutsOrGComponents: true,
    runtimeImportRenamingAllowed: false,
    everyOtherImportUsesTheTypeModifier: true,
  },
  registry: {
    source: "eagerly discovered webpage modules sorted by module path",
    exactModuleExportName: "webpage",
    duplicateIdsAllowed: false,
    duplicatePathsAllowed: false,
    immutable: true,
    exposedByIdAndAsAnOrderedIterable: true,
  },
} as const;
