// ** Reducers Imports

import auth from "./authentication";
import layout from "./layout";
import navbar from "./navbar";

const rootReducer = {
  auth,
  navbar,
  layout,
};

export default rootReducer;
