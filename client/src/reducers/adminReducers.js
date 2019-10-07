import {
  ADD_EMPLOYEE,
  CLEAR_DATA,
  FETCH_EMPLOYEES,
  FETCH_SINGLE_ATTENDANCE,
  SEARCH_EMPLOYEE,
  ADDED_AS_ADMIN,
  SET_ADMIN_ERRORS
} from "../actions/types";

const initialState = {
  currentEmployeeCode: "",
  errors: {},
  searchedEmployee: null,
  employees: [],
  attendance: [],
  totalWorkingTime: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_EMPLOYEES:
      return {
        ...state,
        employees: action.payload
      };
    case ADD_EMPLOYEE:
      const { employees } = state;
      return {
        ...state,
        employees: employees.concat(action.payload)
      };
    case FETCH_SINGLE_ATTENDANCE:
      return {
        ...state,
        attendance: action.payload.attendance,
        totalWorkingTime: action.payload.totalWorkingTime
      };
    case SEARCH_EMPLOYEE:
      return {
        ...state,
        searchedEmployee: action.payload
      };

    case ADDED_AS_ADMIN:
      return {
        ...state,
        searchedEmployee: null
      };
    case SET_ADMIN_ERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
}
