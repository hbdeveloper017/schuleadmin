// ** Router imports

import { Navigate, useRoutes } from "react-router-dom";
import { getHomeRouteForLoggedInUser, getUserData } from "../utility/Utils";

import BlankLayout from "@layouts/BlankLayout";
import { getRoutes } from "./routes";
import { lazy } from "react";
import { useLayout } from "@hooks/useLayout";

const Error = lazy(() => import("../views/pages/misc/Error"));
const Login = lazy(() => import("../views/pages/authentication/Login"));
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"));

const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);

  const getHomeRoute = () => {
    const user = getUserData();
    if (user) {
      return getHomeRouteForLoggedInUser(user.role);
    } else {
      return "/login";
    }
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/login",
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      path: "/auth/not-auth",
      children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }],
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }],
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;
