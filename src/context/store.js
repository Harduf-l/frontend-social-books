import React, { createContext, useReducer } from "react";
import { storeReducer } from "../reducer/storeReducer";

export const storeContext = createContext();
// with useReducer

const StoreContextProvider = ({ children }) => {
  const initalState = { isAuth: false, data: [] };
  const [store, dispatch] = useReducer(storeReducer, initalState);

  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreContextProvider;
