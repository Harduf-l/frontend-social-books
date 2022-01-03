export const storeReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, isAuth: true };
    case "logout":
      return { ...state, isAuth: false };
    default:
      return state;
  }
};
