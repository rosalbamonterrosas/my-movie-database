import * as React from "react";
import { reducer } from "./reducer.js";
import { actions } from "./actions.js";

export const initialState = {
  user: null,
  error: '',
};

export const AppContext = React.createContext();

export const Provider = (props) => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = {
    user: state.user,
    error: state.error,
    setUser: React.useCallback(
      (val) => dispatch({ type: actions.SET_USER, user: val }),
      []
    ),
    setError: React.useCallback(
      (val) => dispatch({ type: actions.SET_ERROR, error: val }),
      []
    )
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};