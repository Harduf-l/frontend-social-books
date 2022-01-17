export const storeReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuth: true,
        userDetails: { ...action.payload.userDeatils },
        userSuggestedFriends: action.payload.friends,
        booksRecommendation: action.payload.booksRecommendations,
        initialLogin: true,
      };
    case "registration": {
      return {
        ...state,
        registeredNow: true,
      };
    }
    case "logout":
      localStorage.removeItem("token");
      return { ...state, isAuth: false, userDetails: [] };
    default:
      return state;
  }
};
