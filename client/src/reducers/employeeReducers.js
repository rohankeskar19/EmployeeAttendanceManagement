import { FETCH_ATTENDANCE, CLEAR_DATA } from "../actions/types";

const initialState = {
  attendance: []
};

export default function(state = initialState, aciton) {
  switch (aciton.type) {
    case FETCH_ATTENDANCE:
      return {
        ...state,
        attendance: aciton.payload
      };

    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
}
