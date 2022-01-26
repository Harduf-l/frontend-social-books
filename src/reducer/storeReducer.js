import { store } from "emoji-mart";

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
      let { myConversations, numberOfUnSeenMessages } = { ...state };
      let newMyConversations = [...myConversations];
      let chosenConvIndex = newMyConversations.findIndex(
        (el) => el._id === convId
      );

      let elementDeleted = newMyConversations.splice(chosenConvIndex, 1);
      action.payload.newMessage._id = Math.random().toString();

      elementDeleted[0].messages.push(action.payload.newMessage);

      if (action.payload.instuctions === "increment both") {
        let { userDetails } = { ...state };
        elementDeleted[0].shouldSee.personId = userDetails._id;
        elementDeleted[0].shouldSee.count = 1;

        numberOfUnSeenMessages++;
      }
      if (action.payload.instuctions === "increment internal") {
        elementDeleted[0].shouldSee.count += 1;
      }
      newMyConversations.push(elementDeleted[0]);

      return {
        ...state,
        myConversations: newMyConversations,
        numberOfUnSeenMessages,
      };
    case "friendTyping":
      let newVersion = [...state.myConversations];
      newVersion[action.payload.indexOfTypingConversation]["typing"] = true;
      return {
        ...state,
        myConversations: newVersion,
      };
    case "friendStoppedTyping":
      let newVersion2 = [...state.myConversations];
      newVersion2[action.payload.indexOfTypingConversation]["typing"] = false;
      return {
        ...state,
        myConversations: newVersion2,
      };

    case "updateSeen":
      const convParamsId = action.payload.convId;
      let updateLastSeenInArray = [...state.myConversations];
      const indexToUpdate = updateLastSeenInArray.findIndex(
        (conv) => conv._id === convParamsId
      );
      updateLastSeenInArray[indexToUpdate].shouldSee.count = 0;
      updateLastSeenInArray[indexToUpdate].shouldSee.personId = "";

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
      let addToMyConversations = [];
      if (state.myConversations && state.myConversations.length > 0) {
        addToMyConversations = [...state.myConversations];
      }

      addToMyConversations.push(action.payload.newConversationCreated);
      return {
        ...state,
        myConversations: addToMyConversations,
      };
    case "replaceDemoConversationWithReal":
      let newUpdatedConversationsArray = [...state.myConversations];
      let index = newUpdatedConversationsArray.findIndex(
        (el) => el._id === action.payload.demoConversationId
      );
      newUpdatedConversationsArray[index] =
        action.payload.newConversationAfterCreation;
      return {
        ...state,
        myConversations: newUpdatedConversationsArray,
      };
    case "updatedMessages":
      return {
        ...state,
        myConversations: action.payload.myConversations,
        numberOfUnSeenMessages: action.payload.numberOfUnSeenMessages,
      };
    case "addToPendingFriendRequsts":
      let newPendingArray = [];
      if (state.myPendingConnections && state.myPendingConnections.length > 0) {
        newPendingArray = [...state.myPendingConnections];
      }

      newPendingArray.push(action.payload.friendRequest);
      return {
        ...state,
        myPendingConnections: newPendingArray,
      };
    case "onlineUsers":
      return {
        ...state,
        onlineUsers: action.payload.onlineUsersId,
      };
    case "logout":
      localStorage.removeItem("token");
      return { ...state, isAuth: false, userDetails: [] };
    default:
      return state;
  }
};
