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
      let updateNumberOfUnSeenMessages = state.numberOfUnSeenMessages;
      let newMyConversations = [...state.myConversations];
      let chosenConvIndex = newMyConversations.findIndex(
        (el) => el._id === convId
      );

      if (chosenConvIndex === -1) return;
      let elementDeleted = newMyConversations.splice(chosenConvIndex, 1);
      elementDeleted[0].messages.push(action.payload.newMessage);

      // these cases are relevant for receicing messages, not sending them
      if (action.payload.instuctions === "increment both") {
        let { userDetails } = { ...state };
        elementDeleted[0].shouldSee.personId = userDetails._id;
        elementDeleted[0].shouldSee.count = 1;

        updateNumberOfUnSeenMessages++;
      }
      if (action.payload.instuctions === "increment internal") {
        elementDeleted[0].shouldSee.count += 1;
      }

      newMyConversations.push(elementDeleted[0]);

      return {
        ...state,
        myConversations: newMyConversations,
        numberOfUnSeenMessages: updateNumberOfUnSeenMessages,
      };
    case "friendTyping":
      let newVersion = [...state.myConversations];

      let indexOfTypingConversation = newVersion.findIndex((el) => {
        return el._id === action.payload.convId;
      });

      newVersion[indexOfTypingConversation]["typing"] = true;
      return {
        ...state,
        myConversations: newVersion,
      };
    case "friendStoppedTyping":
      let newVersion2 = [...state.myConversations];
      let indexOfTypingConversation2 = newVersion2.findIndex((el) => {
        return el._id === action.payload.convId;
      });
      newVersion2[indexOfTypingConversation2]["typing"] = false;
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
    case "addNewConversationToThread":
      // needs to check if new conversation is already exist. the useEffect doesn't
      // have information about things happening in the conversation store.

      // if conversation already exist, we need to swap it with the new fetched one,
      // and put it in the top of the list.

      let conversationIndex = -1;

      if (state.myConversations && state.myConversations.length > 0) {
        conversationIndex = state.myConversations.findIndex((el) => {
          return (
            el.members[0]._id ===
            action.payload.foundConversation.members[0]._id
          );
        });
      }
      if (conversationIndex >= 0) {
        let newConversationsArray = [...state.myConversations];
        newConversationsArray.splice(conversationIndex, 1);
        newConversationsArray.push(action.payload.foundConversation);

        if (
          action.payload.foundConversation.shouldSee.count === 1 &&
          action.payload.foundConversation.shouldSee.personId ===
            state.userDetails._id
        ) {
          let unSeenMessages = state.numberOfUnSeenMessages + 1;
          return {
            ...state,
            myConversations: newConversationsArray,
            numberOfUnSeenMessages: unSeenMessages,
          };
        } else {
          return {
            ...state,
            myConversations: newConversationsArray,
          };
        }
      }
      // in case the conversation is completely new and the store haven't heard of it
      else {
        let newUpdatedConversationsArray2 = [
          ...state.myConversations,
          action.payload.foundConversation,
        ];
        let unSeenMessages = state.numberOfUnSeenMessages + 1;
        return {
          ...state,
          myConversations: newUpdatedConversationsArray2,
          numberOfUnSeenMessages: unSeenMessages,
        };
      }

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
