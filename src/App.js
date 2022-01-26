import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import RegisterProcess from "./components/register/RegisterProcess";
import { Routes, Route } from "react-router-dom";
import HomePageUser from "./components/homePageUser/HomePageUser";
import FriendUserPage from "../src/components/profilePage/FriendUserPage";
import UserProfilePage from "../src/components/profilePage/UserPage";
import NavBar from "../src/components/layout/navbar/NavBar";
import Chat from "../src/components/chat/Chat";
import BookSearch from "../src/components/BookSearch/BookSearch";
import "./i18n/i18n";
import { storeContext } from "./context/store";
import RouteWrapper from "./components/utlis/RouteWrapper";
import Footer from "./components/layout/footer/Footer";
import { io } from "socket.io-client";
import axios from "axios";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const socket = useRef();

  const { store, dispatch } = useContext(storeContext);

  useEffect(() => {
    if (!store.userDetails._id) return;

    console.log("here at socket");
    socket.current = io(process.env.REACT_APP_SOCKET_URL);
    socket.current.emit("addUser", store.userDetails._id);

    socket.current.on("userDisconnected", (onlineUsersId) => {
      dispatch({ type: "onlineUsers", payload: { onlineUsersId } });
    });

    socket.current.on("onlineArray", (onlineUsersId) => {
      dispatch({ type: "onlineUsers", payload: { onlineUsersId } });
    });

    socket.current.on("newFriendRequest", (friendRequest) => {
      dispatch({
        type: "addToPendingFriendRequsts",
        payload: { friendRequest },
      });
    });

    let freezeOperation = {};

    socket.current.on("newTypingEvent", (convId) => {
      if (freezeOperation[convId]) return;

      let indexOfTypingConversation = store.myConversations.findIndex((el) => {
        console.log(el._id);
        return el._id === convId;
      });

      if (indexOfTypingConversation >= 0) {
        freezeOperation[convId] = true;
        dispatch({
          type: "friendTyping",
          payload: { indexOfTypingConversation },
        });

        setTimeout(() => {
          freezeOperation[convId] = false;
          dispatch({
            type: "friendStoppedTyping",
            payload: { indexOfTypingConversation },
          });
        }, 2000);
      }
    });

    socket.current.on("newMessage", (newMessage) => {
      let conversationIndex = store.myConversations.findIndex(
        (el) => el._id === newMessage.conversationId
      );

      if (conversationIndex === -1) {
        // it  means we need to get the new conversation from the server
        const asyncOperations = async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}messages/get-all-conversations/${store.userDetails._id}`
          );
          console.log(response.data.conversationsWithFriendData);
          dispatch({
            type: "updatedMessages",
            payload: {
              myConversations: response.data.conversationsWithFriendData,
              numberOfUnSeenMessages: response.data.numberOfUnseenMessages,
            },
          });
        };
        asyncOperations();
      } else {
        //// check if user is clicking on the conv where message was sent ///
        const urlArray = window.location.href.split("/");
        if (
          urlArray[urlArray.length - 1] === newMessage.conversationId &&
          urlArray[urlArray.length - 2] === "messages"
        ) {
          ///user is on the current conversation

          // update should see in the server ///
          axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}messages/update-should-see/${newMessage.conversationId}`
            )
            .then((res) => console.log(res));

          /// add message to current thread, without incrementing anything
          dispatch({
            type: "addMessage",
            payload: {
              newMessage,
              chosenConversationId: newMessage.conversationId,
            },
          });
        } else {
          if (
            store.myConversations[conversationIndex].shouldSee.personId !==
            store.userDetails._id
          ) {
            // it means we got a new conversation going on, needs to increment top bar with 1,
            // and also increment specific conversation count to 1
            // and put our id in the "shall see"
            dispatch({
              type: "addMessage",
              payload: {
                newMessage,
                chosenConversationId: newMessage.conversationId,
                instuctions: "increment both",
              },
            });
          } else {
            // it means we already have unseen messages from that user,
            // so we only need to increment the internal count by 1
            dispatch({
              type: "addMessage",
              payload: {
                newMessage,
                chosenConversationId: newMessage.conversationId,
                instuctions: "increment internal",
              },
            });
          }
        }
      }
    });

    return () => {
      socket.current.emit("userLogout", store.userDetails._id);
      socket.current = null;
    };
  }, [store.userDetails._id]);

  const sendMessageToSocket = (message) => {
    socket.current.emit("messageSend", message);
  };

  const sendConnectionToSocket = (friendRequest) => {
    socket.current.emit("friendRequestSend", friendRequest);
  };

  const sendTypingToSocket = (receiverId, convId) => {
    socket.current.emit("userIsTyping", { receiverId, convId });
  };

  return (
    <div id="page-container">
      {store.isAuth && <NavBar />}
      <div id="content-wrap">
        <Routes>
          <Route path="/" element={<RouteWrapper component={HomePageUser} />} />
          <Route path="/messages" element={<RouteWrapper component={Chat} />} />
          <Route
            path="/messages/:conversationId"
            element={
              <RouteWrapper
                component={Chat}
                sendMessageToSocket={sendMessageToSocket}
                sendTypingToSocket={sendTypingToSocket}
              />
            }
          />
          <Route
            path="/profile"
            element={<RouteWrapper component={UserProfilePage} />}
          />

          <Route
            path="/user/:id"
            element={
              <RouteWrapper
                component={FriendUserPage}
                sendConnectionToSocket={sendConnectionToSocket}
              />
            }
          />
          <Route path="/bookSearch" element={<BookSearch />} />
          <Route path="/register" element={<RegisterProcess />} />
        </Routes>
      </div>
      {store.isAuth && (
        <div id="footer">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
