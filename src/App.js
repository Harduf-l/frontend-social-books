import React, { useContext, useEffect, useState } from "react";
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
import axios from "axios";
import RouteWrapper from "./components/utlis/RouteWrapper";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const { store } = useContext(storeContext);

  return (
    <div>
      {store.isAuth && <NavBar />}
      <Routes>
        <Route path="/" element={<RouteWrapper component={HomePageUser} />} />
        <Route path="/messages" element={<RouteWrapper component={Chat} />} />
        <Route
          path="/messages/:conversationId/:friendId"
          element={<RouteWrapper component={Chat} />}
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
  );
}

export default App;
