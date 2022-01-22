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
        myConversations: action.payload.myConversations,
        numberOfUnSeenMessages: action.payload.numberOfUnSeenMessages,
        initialLogin: true,
      };
    case "changePendingFriendRequests":
      return {
        ...state,
        myPendingConnections: action.payload.newMyPendingConnections,
      };
    case "addMessage":
      const convId = action.payload.chosenConversationId;
      let { myConversations } = { ...state };
      let chosenConvIndex = myConversations.findIndex(
        (el) => el._id === convId
      );
      let elementDeleted = myConversations.splice(chosenConvIndex, 1);
      elementDeleted[0].messages.push(action.payload.newMessage);
      myConversations.push(elementDeleted[0]);

      return {
        ...state,
        myConversations,
      };
    case "updateSeen":
      const convParamsId = action.payload.convId;
      let updateLastSeenInArray = [...state.myConversations];
      const indexToUpdate = updateLastSeenInArray.findIndex(
        (conv) => conv._id === convParamsId
      );
      updateLastSeenInArray[indexToUpdate].shouldSee.count = 0;
      updateLastSeenInArray[indexToUpdate].shouldSee.personId = "";

      console.log("here in store", updateLastSeenInArray);
      let newUnSeen = state.numberOfUnSeenMessages;
      if (newUnSeen > 0) {
        newUnSeen = state.numberOfUnSeenMessages - 1;
      }
      return {
        ...state,
        myConversations: updateLastSeenInArray,
        numberOfUnSeenMessages: newUnSeen,
      };

    case "addConversation":
      console.log(action.payload.newConversationCreated);
      let addToMyConversations = [...state.myConversations];
      addToMyConversations.push(action.payload.newConversationCreated);
      return {
        ...state,
        myConversations: addToMyConversations,
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
