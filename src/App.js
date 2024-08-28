import React, { Suspense, useState } from "react";

import LoadingContext from "./utility/context/LoadingContext";
import Router from "./router/Router";

const App = () => {
  const [isLoading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      <Suspense fallback={null}>
        {isLoading && (
          <div className="loader">
            <div className="loaderContent">
              <div className="bar"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
              {/* <div className="bar4"></div> */}
            </div>
            <p>Loading please wait...</p>
          </div>
        )}

        <Router />
      </Suspense>
    </LoadingContext.Provider>
  );
};

export default App;
