import { lazy } from "react";

export type ExtraRoute = {
  key: string;
  path: string;
  page: ReturnType<typeof lazy>;
};

export const EXTRA_ROUTES: ExtraRoute[] = [
  {
    key: "orders",
    path: "/pathology/orders",
    page: lazy(() => import("../pages/OrdersPage")),
  },
  {
    key: "shipment",
    path: "/pathology/shipment",
    page: lazy(() => import("../pages/ShipmentPage")),
  },
  {
    key: "receive",
    path: "/pathology/receive",
    page: lazy(() => import("../pages/ReceivePage")),
  },
  {
    key: "result-entry",
    path: "/pathology/result-entry",
    page: lazy(() => import("../components/ResultEntry/ResultEntryView")),
  },
  {
    key: "authorization",
    path: "/pathology/authorization",
    page: lazy(() => import("../pages/AuthorizationPage")),
  },
  {
    key: "configuration",
    path: "/pathology/configuration",
    page: lazy(() => import("../pages/ConfigurationPage")),
  },
  {
  key: "parameter-create",
  path: "/pathology/configuration/test/parameter/create",
  page: lazy(() => import("../components/Configuration/Test/ParameterMaster/CreateParameterPage")),
},
{
    key: "test-create",
    path: "/pathology/configuration/Test/test/create",
    page: lazy(() =>
      import(
        "../components/Configuration/Test/TestMaster/CreateTestPage"
      )
    ),
  },
    // ── Template Master ───────────────────────────────────────────────────────
  {
    key: "template-create",
    path: "/pathology/configuration/test/template/create",
    page: lazy(() => import("../components/Configuration/Test/TemplateMaster/CreateTemplatePage")),
  },
  // {
  //   key: "template-edit",
  //   path: "/pathology/configuration/test/template/edit/:id",
  //   page: lazy(() => import("../components/Configuration/Test/TemplateMaster/EditTemplatePage")),
  // },
];
