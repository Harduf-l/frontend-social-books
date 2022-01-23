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
import { useParams } from "react-router-dom";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const socket = useRef();
  let params = useParams();
  const { store, dispatch } = useContext(storeContext);

  useEffect(() => {
    if (!store.userDetails._id) return;

    console.log("here at socket");
    socket.current = io(process.env.REACT_APP_SOCKET_URL);
    socket.current.emit("addUser", store.userDetails._id);

    socket.current.on("userDisconnected", (onlineUsersId) => {
      console.log("get refreshed object", onlineUsersId);
    });

    socket.current.on("onlineArray", (onlineUsersId) => {
      console.log("get online object of id when logging in", onlineUsersId);
    });

    socket.current.on("newMessage", (newMessage) => {
      //// check if user is clicking on the conv ///
      const urlArray = window.location.href.split("/");
      if (
        urlArray[urlArray.length - 1] === newMessage.conversationId &&
        urlArray[urlArray.length - 2] === "messages"
      ) {
        console.log("user is on the current conversation");
      } else {
        console.log("user is not on the current conversation");
      }
      ///////////////

      console.log("got new message! ", newMessage);
      let result = store.myConversations.some(
        (el) => el._id === newMessage.conversationId
      );

      if (!result) {
        const asyncOperations = async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}messages/get-all-conversations/${store.userDetails._id}`
          );
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
        dispatch({
          type: "addMessage",
          payload: {
            newMessage,
            chosenConversationId: newMessage.conversationId,
          },
        });
      }
    });

    return () => {
      socket.current = null;
    };
  }, [store.userDetails._id, dispatch, store.myConversations]);

  const sendMessageToSocket = (message) => {
    socket.current.emit("messageSend", message);
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
              />
            }
          />
          <Route
            path="/profile"
            element={<RouteWrapper component={UserProfilePage} />}
          />

          <Route
            path="/user/:id"
            element={<RouteWrapper component={FriendUserPage} />}
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
