function getAge(birthObject) {
  let currentDate = new Date();
  const currentDateObject = {
    day: currentDate.getDate(),
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };
  let age = currentDateObject.year - birthObject.year;
  if (currentDateObject.month < birthObject.month) {
    age--;
  }
  if (currentDateObject.month === birthObject.month) {
    if (currentDateObject.day < birthObject.day) {
      age--;
    }
  }
  return age;
}

export const storeReducer = (state, action) => {
  switch (action.type) {
    case "login":
      let userAge = null;
      if (action.payload.userDeatils.birthday) {
        const birthObject = JSON.parse(action.payload.userDeatils.birthday);
        userAge = getAge(birthObject);
      }
      return {
        ...state,
        isAuth: true,
        userDetails: { ...action.payload.userDeatils, userAge },
        userSuggestedFriends: action.payload.friends,
      };
    case "logout":
      localStorage.removeItem("token");
      return { ...state, isAuth: false, userDetails: [] };
    default:
      return state;
  }
};
