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
  const [loading, setLoading] = useState(true);

  const { store, dispatch } = useContext(storeContext);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}users/token-check`,
        { token: localStorage.getItem("token") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status === "ok") {
          console.log("here in app", res.data);
          dispatch({
            type: "login",
            payload: {
              userDeatils: res.data.userDetails,
              friends: res.data.suggestedUsers,
              booksRecommendations: res.data.recommendationBookArray,
            },
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [dispatch]);

  return (
    <div>
      {!loading && store.isAuth && <NavBar />}
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
        <Route path="/user/:id" element={<FriendUserPage />} />
        <Route path="/bookSearch" element={<BookSearch />} />
        <Route path="/register" element={<RegisterProcess />} />
      </Routes>
    </div>
  );
}

export default App;
