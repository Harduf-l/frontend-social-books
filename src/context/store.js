import React, { createContext, useReducer } from "react";
import { storeReducer } from "../reducer/storeReducer";

export const storeContext = createContext();

const StoreContextProvider = ({ children }) => {
  const initalState = {
    isAuth: false,
    userDetails: [],
    initialLogin: false,
    myConversations: [],
    onlineUsers: {},
    numberOfUnSeenMessages: 0,
    myPendingConnections: [],
    booksRecommendation: [],
    userSuggestedFriends: [],
  };

  const [store, dispatch] = useReducer(storeReducer, initalState);

  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreContextProvider;
