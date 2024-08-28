// ** React Imports

import "./configs/i18n";
import "./@core/components/ripple-button";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss";
import "./@core/assets/fonts/feather/iconfont.css";
import "./@core/scss/core.scss";
import "./assets/scss/style.scss";

import * as serviceWorker from "./serviceWorker";

import { Suspense, lazy } from "react";

import { AbilityContext } from "./utility/context/Can";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Spinner from "./@core/components/spinner/Fallback-spinner";
import { ThemeContext } from "./utility/context/ThemeColors";
import { Toaster } from "react-hot-toast";
import ability from "./configs/acl/ability";
import { createRoot } from "react-dom/client";
import { store } from "./redux/store";
import themeConfig from "./configs/themeConfig";

const LazyApp = lazy(() => import("./App"));

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <HashRouter basename="/">
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <AbilityContext.Provider value={ability}>
          <ThemeContext>
            <LazyApp />
            <Toaster
              position={themeConfig.layout.toastPosition}
              toastOptions={{ className: "react-hot-toast" }}
            />
          </ThemeContext>
        </AbilityContext.Provider>
      </Suspense>
    </Provider>
  </HashRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
