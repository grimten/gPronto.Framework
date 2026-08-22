export const gComponentSchema = {
  gSchemaVersion: 1,
  gSchemaName: "gComponentSchema",
  title: "gComponent",
  description:
    "Every gComponent, its required and optional props, its defaults, and the closed lists its props draw from.",
  implementation: {
    schemaLocation:
      "GProntoFrameworkApplicationRootComponent.gSchemas.gComponentSchema",
    runtimeLocation: "GProntoFrameworkApplicationRootComponent.gComponents",
    consumers: [
      "the gComponent registry factory",
      "the public gComponent prop-contract generator",
      "the gComponent conformance checker",
    ],
    adoption: {
      conformanceCheckRequired: true,
      invalidSchemaBlocksRegistryCreation: true,
      currentComponentsRemainAuthoritativeUntilAtomicAdoption: true,
      schemaWinsAfterAdoption: true,
      duplicatedPropDefaultsAndValueSetsAreRemovedAfterAdoption: true,
      unsupportedVersion: "fail before the gComponent registry is exposed",
    },
  },
  folder: {
    parent: "gPronto.Framework/gComponents",
    namePattern: "^gComponent\\.([A-Z][a-z0-9]+)+$",
    fileName: "gComponent.<Name>.tsx",
    fileCount: 1,
    forbiddenNameWords: ["gPronto", "Framework", "Component"],
  },
  exports: {
    runtimeValue: "GComponent<Name>",
    runtimeValueCount: 1,
    propsType: "GComponent<Name>Props",
    propsTypeRequiredWhen: "the component declares one parameter",
    propsTypeDeclaredWith: "Readonly",
    everyExportedTypeStartsWith: "GComponent<Name>",
    defaultExportAllowed: false,
    publicExportBarrel: "gPronto.Framework.PublicApi.gComponentExports.ts",
  },
  styling: {
    classPrefix: "the kebab-case form of the complete gComponent name",
    classOwnership: "one class has exactly one owner",
    classesDefinedIn: "the registered styling files",
    variantModifier: "<owner-root-class>--<variant-value>",
    forbiddenProps: ["style", "sx", "styles", "styleOverrides", "css"],
    forbiddenMechanisms: [
      "styled",
      "createStyles",
      "css tagged template",
      "theme override",
      "style element",
      "direct css import",
    ],
    allowedClassProps: ["className", "classes", "classNames"],
  },
  controlReplacements: {
    button: "GComponentButton",
    input: "GComponentInput",
    select: "GComponentInput",
    textarea: "GComponentInput",
  },
  registeredComponentCount: 28,
  catalogKey: {
    pattern: "^[a-z][A-Za-z0-9]*$",
    exportName: "GComponent followed by the PascalCase catalog key",
    sourceFolder: "gComponent followed by a dot and the PascalCase catalog key",
  },
  valueSets: {
    inputKind: [
      "text",
      "email",
      "password",
      "search",
      "telephone",
      "url",
      "color",
      "date",
      "date-time",
      "time",
      "number",
      "range",
      "file",
      "select",
      "textarea",
      "checkbox",
      "radio",
    ],
    buttonVariant: [
      "primary",
      "primary-disabled",
      "primary-loading",
      "secondary",
      "secondary-disabled",
      "secondary-loading",
      "danger",
      "danger-disabled",
      "danger-loading",
    ],
    alertVariant: ["filled", "light", "outline"],
    badgeVariant: ["filled", "light", "outline"],
    loaderSize: ["xs", "sm", "md", "lg", "xl"],
    navigationOrientation: ["vertical", "horizontal"],
    flowDirection: ["horizontal", "vertical"],
    flowGap: ["xs", "sm", "md", "lg", "xl"],
    flowJustify: ["start", "center", "end", "space-between"],
    semanticColor: ["red", "green", "blue", "yellow", "orange"],
    typographyVariant: [
      "normal",
      "small",
      "lead",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
  },
  gComponentsAreComplete: true,
  gComponents: {
    alert: {
      props: {
        message: { datatype: "string", required: true, nullable: false },
        title: { datatype: "string", required: false, nullable: false },
        color: { datatype: "string", required: false, nullable: false },
        variant: {
          datatype: "alertVariant",
          required: false,
          nullable: false,
          default: "light",
        },
      },
    },
    authenticationCallback: { props: {} },
    authenticationCard: {
      props: {
        title: { datatype: "string", required: true, nullable: false },
        children: { datatype: "ReactNode", required: true, nullable: false },
      },
    },
    authenticationEmailChange: { props: {} },
    authenticationEmailConfirmationResend: { props: {} },
    authenticationInvitationAcceptance: { props: {} },
    authenticationLoading: {
      props: {
        message: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "Authentication is loading.",
        },
      },
    },
    authenticationMagicLinkRequest: { props: {} },
    authenticationOperationError: {
      props: {
        title: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "Authentication failed",
        },
        message: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "The authentication operation could not be completed.",
        },
      },
    },
    authenticationPasswordChange: { props: {} },
    authenticationPasswordRecoveryRequest: { props: {} },
    authenticationPasswordReset: { props: {} },
    authenticationReauthentication: { props: {} },
    authenticationResultMessage: {
      props: {
        title: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "Authentication result",
        },
        message: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "The authentication operation has completed.",
        },
        type: {
          datatype: "string",
          required: false,
          nullable: false,
          allowedValues: ["success", "warning", "info"],
          default: "info",
        },
      },
    },
    authenticationSignIn: { props: {} },
    authenticationSignOut: { props: {} },
    authenticationSignUp: { props: {} },
    badge: {
      props: {
        text: { datatype: "string", required: true, nullable: false },
        color: { datatype: "string", required: false, nullable: false },
        variant: {
          datatype: "badgeVariant",
          required: false,
          nullable: false,
          default: "light",
        },
      },
    },
    button: {
      props: {
        variant: {
          datatype: "buttonVariant",
          required: true,
          nullable: false,
        },
        text: { datatype: "string", required: true, nullable: false },
        onClick: {
          datatype: "() => void",
          required: true,
          nullable: false,
        },
        icon: {
          datatype: "iconName",
          required: false,
          nullable: true,
          default: "the variant's default icon",
        },
        iconOnly: {
          datatype: "boolean",
          required: false,
          nullable: false,
          default: false,
        },
      },
      behaviour: {
        underlyingButtonType: "submit",
        preventsDefaultBeforeOnClick: true,
        disabledWhenVariantEndsWith: ["-disabled", "-loading"],
        rendersLoaderWhenVariantEndsWith: "-loading",
        iconOnlyKeepsTextAsAccessibleName: true,
      },
    },
    flow: {
      discriminant: "direction",
      props: {
        children: { datatype: "ReactNode", required: true, nullable: false },
        direction: {
          datatype: "flowDirection",
          required: true,
          nullable: false,
        },
        gap: {
          datatype: "flowGap",
          required: false,
          nullable: false,
          default: "md",
        },
        justify: {
          datatype: "flowJustify",
          required: false,
          nullable: false,
          default: "start",
          availableOnlyWhen: "direction === horizontal",
        },
      },
    },
    footer: { props: {} },
    header: { props: {} },
    input: {
      discriminant: "kind",
      commonProps: {
        label: { datatype: "string", required: true, nullable: false },
        name: { datatype: "string", required: false, nullable: false },
        required: {
          datatype: "boolean",
          required: false,
          nullable: false,
          default: false,
        },
        disabled: {
          datatype: "boolean",
          required: false,
          nullable: false,
          default: false,
        },
        error: { datatype: "string", required: false, nullable: false },
        helperText: { datatype: "string", required: false, nullable: false },
        onBlur: { datatype: "() => void", required: false, nullable: false },
      },
      optionShape: {
        exactOwnKeys: ["value", "label"],
        fields: {
          value: { datatype: "string", required: true, nullable: false },
          label: { datatype: "string", required: true, nullable: false },
        },
      },
      variants: {
        text: { profile: "string", placeholderAllowed: true },
        email: { profile: "string", placeholderAllowed: true },
        password: { profile: "string", placeholderAllowed: true },
        search: { profile: "string", placeholderAllowed: true },
        telephone: { profile: "string", placeholderAllowed: true },
        url: { profile: "string", placeholderAllowed: true },
        color: { profile: "string", placeholderAllowed: false },
        date: { profile: "string", placeholderAllowed: false },
        "date-time": { profile: "string", placeholderAllowed: false },
        time: { profile: "string", placeholderAllowed: false },
        number: {
          props: {
            value: {
              datatype: "number",
              required: true,
              nullable: true,
            },
            onChange: {
              datatype: "(value: number | null) => void",
              required: true,
              nullable: false,
            },
            min: { datatype: "number", required: false, nullable: false },
            max: { datatype: "number", required: false, nullable: false },
            step: {
              datatype: "number | 'any'",
              required: false,
              nullable: false,
            },
            controlRef: {
              datatype: "Ref<HTMLInputElement>",
              required: false,
              nullable: false,
            },
          },
        },
        range: {
          props: {
            value: { datatype: "number", required: true, nullable: false },
            onChange: {
              datatype: "(value: number) => void",
              required: true,
              nullable: false,
            },
            min: { datatype: "number", required: true, nullable: false },
            max: { datatype: "number", required: true, nullable: false },
            step: { datatype: "number", required: false, nullable: false },
            controlRef: {
              datatype: "Ref<HTMLInputElement>",
              required: false,
              nullable: false,
            },
          },
        },
        file: {
          props: {
            onChange: {
              datatype: "(files: readonly File[]) => void",
              required: true,
              nullable: false,
            },
            accept: { datatype: "string", required: false, nullable: false },
            multiple: {
              datatype: "boolean",
              required: false,
              nullable: false,
              default: false,
            },
            controlRef: {
              datatype: "Ref<HTMLInputElement>",
              required: false,
              nullable: false,
            },
          },
        },
        select: {
          props: {
            value: { datatype: "string", required: true, nullable: false },
            onChange: {
              datatype: "(value: string) => void",
              required: true,
              nullable: false,
            },
            options: {
              datatype: "readonly inputOption[]",
              required: true,
              nullable: false,
            },
            controlRef: {
              datatype: "Ref<HTMLSelectElement>",
              required: false,
              nullable: false,
            },
          },
        },
        textarea: {
          props: {
            value: { datatype: "string", required: true, nullable: false },
            onChange: {
              datatype: "(value: string) => void",
              required: true,
              nullable: false,
            },
            placeholder: {
              datatype: "string",
              required: false,
              nullable: false,
            },
            rows: {
              datatype: "positive integer",
              required: false,
              nullable: false,
              invalidValueThrows: "TypeError",
            },
            controlRef: {
              datatype: "Ref<HTMLTextAreaElement>",
              required: false,
              nullable: false,
            },
          },
        },
        checkbox: {
          props: {
            checked: { datatype: "boolean", required: true, nullable: false },
            onChange: {
              datatype: "(checked: boolean) => void",
              required: true,
              nullable: false,
            },
            controlRef: {
              datatype: "Ref<HTMLInputElement>",
              required: false,
              nullable: false,
            },
          },
        },
        radio: {
          props: {
            value: { datatype: "string", required: true, nullable: false },
            onChange: {
              datatype: "(value: string) => void",
              required: true,
              nullable: false,
            },
            options: {
              datatype: "readonly inputOption[]",
              required: true,
              nullable: false,
            },
          },
        },
      },
      profiles: {
        string: {
          props: {
            value: { datatype: "string", required: true, nullable: false },
            onChange: {
              datatype: "(value: string) => void",
              required: true,
              nullable: false,
            },
            placeholder: {
              datatype: "string",
              required: false,
              nullable: false,
            },
            controlRef: {
              datatype: "Ref<HTMLInputElement>",
              required: false,
              nullable: false,
            },
          },
        },
      },
      supportingTextPrecedence: ["error", "helperText"],
      behavior: {
        blankOrMissingNameUsesTheLabel: true,
        nonBlankErrorCreatesADeduplicatedErrorNotification: true,
        nonBlankHelperTextCreatesADeduplicatedInfoNotification: true,
        unknownKindThrows: "TypeError",
      },
    },
    loader: {
      props: {
        size: {
          datatype: "loaderSize",
          required: false,
          nullable: false,
          default: "md",
        },
        color: { datatype: "string", required: false, nullable: false },
        label: {
          datatype: "string",
          required: false,
          nullable: false,
          default: "Loading",
        },
      },
    },
    navigation: {
      props: {
        orientation: {
          datatype: "navigationOrientation",
          required: false,
          nullable: false,
          default: "vertical",
        },
      },
      behaviour: {
        rendersOneLinkPerRegisteredPathRoute: true,
        rendersNotFoundRoute: false,
        linkTextAndTarget: "the route path",
      },
    },
    nothing: { props: {} },
    postgresDataTable: {
      props: {
        resource: { datatype: "string", required: true, nullable: false },
        defaults: {
          datatype: "postgresDataTableDefaults",
          required: false,
          nullable: false,
        },
      },
      defaultsShape: {
        exactOwnKeys: ["visibleColumns", "sort"],
        fields: {
          visibleColumns: {
            datatype: "readonly string[]",
            required: false,
            nullable: false,
          },
          sort: {
            datatype: "sortDefinition",
            required: false,
            nullable: true,
          },
        },
      },
      sortShape: {
        exactOwnKeys: ["field", "order"],
        fields: {
          field: { datatype: "string", required: true, nullable: false },
          order: {
            datatype: "string",
            required: true,
            nullable: false,
            allowedValues: ["asc", "desc"],
          },
        },
      },
    },
    typography: {
      props: {
        text: { datatype: "string", required: true, nullable: false },
        variant: {
          datatype: "typographyVariant",
          required: false,
          nullable: false,
          default: "normal",
        },
      },
    },
  },
} as const;
