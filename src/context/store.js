import React, { createContext, useReducer } from "react";
import { storeReducer } from "../reducer/storeReducer";

export const storeContext = createContext();

const StoreContextProvider = ({ children }) => {
  const initalState = {
    isAuth: false,
    registeredNow: false,
    userDetails: [],
    initialLogin: false,
  };

  const [store, dispatch] = useReducer(storeReducer, initalState);

  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreContextProvider;
