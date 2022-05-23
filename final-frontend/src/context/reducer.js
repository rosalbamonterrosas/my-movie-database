import { actions } from "./actions.js";

export const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.user};
    case actions.SET_ERROR:
      return { ...state, error: action.error};
    default:
      return state;
  }
};