import type { GProntoFrameworkRegisteredWebpageDefinition } from "@gpronto.framework";

export const webpage = {
  id: "home", 
  route: {
    kind: "path",
    path: "/",
  },
  title: "Home",
  navigation: {
    role: {
      guest: {
        settings: {
          visible: true,
          enabled: true,
          label: "Home",
          order: 1,
          parentId: null,
        },
        role_application: null,
      },
      standard: {
        settings: null,
        role_application: {
          blank: {
            visible: true,
            enabled: true,
            label: "Home",
            order: 1,
            parentId: null,
          },
          values: {},
          unmatched: {
            visible: true,
            enabled: true,
            label: "Home",
            order: 1,
            parentId: null,
          },
        },
      },
      admin: {
        settings: null,
        role_application: {
          blank: {
            visible: true,
            enabled: true,
            label: "Home",
            order: 1,
            parentId: null,
          },
          values: {},
          unmatched: {
            visible: true,
            enabled: true,
            label: "Home",
            order: 1,
            parentId: null,
          },
        },
      },
    },
  },
  access: {
    role: {
      guest: {
        settings: {
          access: "read-only",
          redirectPath: null,
        },
        role_application: null,
      },
      standard: {
        settings: null,
        role_application: {
          blank: {
            access: "read-only",
            redirectPath: null,
          },
          values: {},
          unmatched: {
            access: "read-only",
            redirectPath: null,
          },
        },
      },
      admin: {
        settings: null,
        role_application: {
          blank: {
            access: "read-write",
            redirectPath: null,
          },
          values: {},
          unmatched: {
            access: "read-write",
            redirectPath: null,
          },
        },
      },
    },
  },
  gLayout: {
    name: "GLayoutCardsModern",
    openSlots: {
      openSlotCardHeader: {
        gComponent: {
          name: "GComponentTypography",
          text: "Home",
          variant: "h1",
        },
      },
      openSlotCardBody: {
        gComponent: {
          name: "GComponentTypography",
          text: "Welcome to the home webpage.",
          variant: "normal",
        },
      },
    },
  },
} satisfies GProntoFrameworkRegisteredWebpageDefinition;
