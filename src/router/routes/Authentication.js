// ** React Imports

import { lazy } from "react";

const Login = lazy(() => import("../../views/pages/authentication/Login"));

const ForgotPassword = lazy(() =>
  import("../../views/pages/authentication/ForgotPassword")
);

const ResetPasswordBasic = lazy(() =>
  import("../../views/pages/authentication/ResetPasswordBasic")
);

const AuthenticationRoutes = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/pages/reset-password-basic",
    element: <ResetPasswordBasic />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
];

export default AuthenticationRoutes;
