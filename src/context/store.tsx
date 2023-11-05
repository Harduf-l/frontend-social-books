import { createContext, useReducer } from "react";
import { storeReducer } from "../reducer/storeReducer";

export const storeContext = createContext(null);

export interface IUserDetails {
  username: string;
  password: string;
  email: string;
  favoriteWriter: string;
  picture: string;
  genres: string[];
  birthday: string;
  country: string;
  city: string;
  freeText: string;
  writingDescription: string;
}

type storeInterface = {
  isAuth: boolean;
  userDetails: IUserDetails;
  initialLogin: boolean;
  myConversations: [];
  onlineUsers: {};
  numberOfUnSeenMessages: number;
  myPendingConnections: [];
  booksRecommendation: [];
  userSuggestedFriends: [];
  lastTenUsersRegistered: [];
  feedPosts: [];
  approvedConnections: [];
  quotes: string;
};

export const initalState: storeInterface = {
  isAuth: false,
  userDetails: {
    username: "",
    password: "",
    email: "",
    favoriteWriter: "",
    picture: "",
    genres: [],
    birthday: undefined,
    country: "",
    city: "",
    freeText: "",
    writingDescription: "",
  },
  initialLogin: false,
  myConversations: [],
  onlineUsers: {},
  numberOfUnSeenMessages: 0,
  myPendingConnections: [],
  booksRecommendation: [],
  userSuggestedFriends: [],
  lastTenUsersRegistered: [],
  feedPosts: [],
  approvedConnections: [],
  quotes: "",
};

const StoreContextProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initalState);

  return (
    <storeContext.Provider value={{ store, dispatch }}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreContextProvider;
