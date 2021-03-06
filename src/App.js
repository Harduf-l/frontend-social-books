import React, { useContext, useEffect, useRef, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import RegisterProcess from "./components/register/RegisterProcess";
import { Routes, Route } from "react-router-dom";
import HomePageUser from "./components/homePageUser/HomePageUser";
import FriendUserPage from "../src/components/profilePage/FriendUserPage";
import UserProfilePage from "../src/components/profilePage/UserPage";
import NavBar from "../src/components/layout/navbar/NavBar";
import Chat from "../src/components/chat/Chat";
import Groups from "../src/components/groups/Groups";
import SingleGroup from "../src/components/groups/SingleGroup";
import Events from "../src/components/events/Events";

import BookSearch from "../src/components/BookSearch/BookSearch";
import "./i18n/i18n";
import { storeContext } from "./context/store";
import RouteWrapper from "./components/utlis/RouteWrapper";
import Footer from "./components/layout/footer/Footer";
import axios from "axios";
import { io } from "socket.io-client";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const { store, dispatch } = useContext(storeContext);
  let socket = useRef("");

  useEffect(() => {
    if (!store.userDetails._id) return;

    socket.current = io(process.env.REACT_APP_SERVER_URL);
    socket.current.on("connect", () => {
      socket.current.emit("addUser", store.userDetails._id);
    });

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

    const freezerObj = {};
    socket.current.on("newTypingEvent", (convId) => {
      console.log(freezerObj);
      if (freezerObj[convId]) return;
      freezerObj[convId] = true;
      dispatch({
        type: "friendTyping",
        payload: { convId },
      });

      setTimeout(() => {
        delete freezerObj[convId];
        dispatch({
          type: "friendStoppedTyping",
          payload: { convId },
        });
      }, 2000);
    });

    socket.current.on("newMessage", (newMessage) => {
      let conversationIndex = store.myConversations.findIndex(
        (el) => el._id === newMessage.conversationId
      );

      if (conversationIndex === -1) {
        // it  means we need to get the new conversation from the server
        // remember, the store might already have this converstation, but the useEffect
        // might not be aware of it

        const asyncOperations = async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}messages/get-single-conversation/${newMessage.conversationId}/${store.userDetails._id}`
          );

          dispatch({
            type: "addNewConversationToThread",
            payload: {
              foundConversation: response.data.foundConversation,
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
            .then((res) => console.log("message is seen"));

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
  }, [store.userDetails._id, dispatch]);

  const sendMessageToSocket = (message) => {
    socket.current.emit("messageSend", message);
  };

  const sendConnectionToSocket = (friendRequest) => {
    socket.current.emit("friendRequestSend", friendRequest);
  };

  const sendTypingToSocket = (receiverId, convId) => {
    // if it's demo conversation. the friend doesn't have it
    if (convId < 1.1) return;
    socket.current.emit("userIsTyping", { receiverId, convId });
  };

  return (
    <div id="page-container">
      {store.isAuth && <NavBar />}
      <div id="content-wrap" className="borderTopAllContent">
        <Routes>
          <Route
            path="/"
            element={
              <RouteWrapper component={HomePageUser} type={"homePage"} />
            }
          />
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
          <Route path="/groups" element={<RouteWrapper component={Groups} />} />
          <Route
            path="/bookSearch"
            element={<RouteWrapper component={BookSearch} />}
          />
          <Route
            path="/groups/:id"
            element={<RouteWrapper component={SingleGroup} />}
          />
          <Route path="/events" element={<RouteWrapper component={Events} />} />

          <Route
            path="/user/:id"
            element={
              <RouteWrapper
                component={FriendUserPage}
                sendConnectionToSocket={sendConnectionToSocket}
              />
            }
          />

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
