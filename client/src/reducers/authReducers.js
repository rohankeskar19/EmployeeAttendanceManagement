import {
  SET_CURRENT_USER,
  LOGINGIN_USER,
  LOGIN_USER,
  LOGOUT_USER,
  SET_ERRORS
} from "../actions/types";

const initialState = {
  user: {},
  isAuthenticated: false,
  isAdmin: false,
  errors: {
    error: ""
  },
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGINGIN_USER:
      return {
        ...state,
        loading: true
      };
    case LOGIN_USER:
      return action.payload;

    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: (action.payload.Access = "admin" ? true : false),
        user: action.payload,
        loading: false
      };

    case LOGOUT_USER:
      return initialState;

    case SET_ERRORS:
      return { ...state, errors: action.payload, loading: false };
    default:
      return state;
  }
}
