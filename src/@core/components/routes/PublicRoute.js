// ** React Imports

import { getHomeRouteForLoggedInUser, getUserData } from "@utils";

import { Navigate } from "react-router-dom";
import { Suspense } from "react";

// ** Utils

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = getUserData();

    const restrictedRoute = route.meta && route.meta.restricted;

    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PublicRoute;
