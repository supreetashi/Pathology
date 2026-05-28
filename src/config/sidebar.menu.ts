import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type MenuItem = {
  key: string;
  label: string;
  path: string;
  page: LazyExoticComponent<ComponentType<object>>;
  subMenu?: MenuItem[];
};

export const APP_CONDITION: "demo" | "full" = "demo";

export const PATHOLOGY_MENU: MenuItem[] = [
  {
    key: "orders",
    label: "Orders",
    path: "/pathology/orders",
    page: lazy(() => import("../pages/OrdersPage")),
  },
  {
    key: "shipment",
    label: "Shipment",
    path: "/pathology/shipment",
    page: lazy(() => import("../pages/ShipmentPage")),
  },
  {
    key: "receive",
    label: "Receive",
    path: "/pathology/receive",
    page: lazy(() => import("../pages/ReceivePage")),
  },
  {
    key: "result-entry",
    label: "Result Entry",
    path: "/pathology/result-entry",
    page: lazy(() => import("../pages/ResultEntryPage")),
  },
  {
    key: "authorization",
    label: "Authorization",
    path: "/pathology/authorization",
    page: lazy(() => import("../pages/AuthorizationPage")),
  },
  {
    key: "configuration",
    label: "Configuration",
    path: "/pathology/configuration",
    page: lazy(() => import("../pages/ConfigurationPage")),
    subMenu: [
      {
        key: "sample-and-tube",
        label: "Sample & Tube",
        path: "/pathology/configuration/sample-and-tube",
        page: lazy(
          () =>
            import("../components/Configuration/SampleAndTube/SampleAndTube"),
        ),
      },
      {
        key: "test",
        label: "Test",
        path: "/pathology/configuration/test",
        page: lazy(() => import("../components/Configuration/Test/Test")),
      },
      {
        key: "machine",
        label: "Machine",
        path: "/pathology/configuration/machine",
        page: lazy(() => import("../components/Configuration/Machine/MachineDashboard")),
      },
      {
        key: "agency",
        label: "Agency",
        path: "/pathology/configuration/agency",
        page: lazy(() => import("../components/Configuration/Agency/Agency")),
      },
      {
        key: "pathology-profile",
        label: "Pathology Profile",
        path: "/pathology/configuration/pathology-profile",
        page: lazy(
          () =>
            import("../components/Configuration/PathologyProfile/PathologyProfile"),
        ),
      },
    ],
  },
];

export const DEMO_ALLOWED_KEYS = PATHOLOGY_MENU.map((item) => item.key);

// Sidebar compatibility aliases to preserve old-project sidebar behavior.
export const LEADS_MENU = PATHOLOGY_MENU;
export const DOCUMENTS_MENU: MenuItem[] = [];
export const RISK_MENU: MenuItem[] = [];
export const COMPLIANCE_MENU: MenuItem[] = [];
