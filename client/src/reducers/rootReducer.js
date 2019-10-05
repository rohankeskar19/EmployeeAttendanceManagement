import { combineReducers } from "redux";

import authReducers from "./authReducers";
import employeeReducers from "./employeeReducers";
import adminReducers from "./adminReducers";

const rootReducer = combineReducers({
  auth: authReducers,
  employee: employeeReducers,
  admin: adminReducers
});

export default rootReducer;
