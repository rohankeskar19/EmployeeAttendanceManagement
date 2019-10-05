import { FETCH_ATTENDANCE } from "../actions/types";

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

      break;

    default:
      return state;
  }
}
