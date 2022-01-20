export const storeReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuth: true,
        userDetails: { ...action.payload.userDeatils },
        userSuggestedFriends: action.payload.friends,
        booksRecommendation: action.payload.booksRecommendations,
        myPendingConnections: action.payload.myPendingConnections,
        initialLogin: true,
      };
    case "changePendingFriendRequests":
      return {
        ...state,
        myPendingConnections: action.payload.newMyPendingConnections,
      };
    case "registration": {
      return {
        ...state,
        registeredNow: true,
      };
    }
    case "logout":
      localStorage.removeItem("token");
      return { ...state, isAuth: false, userDetails: [], registeredNow: false };
    default:
      return state;
  }
};
