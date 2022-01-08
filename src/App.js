import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RegisterProcess from "./components/RegisterProcess";
import { Routes, Route } from "react-router-dom";
import HomePageUser from "./components/HomePageUser";
import ResigterHomePage from "../src/components/ResigterHomePage";
import AnotherUserPage from "../src/components/AnotherUserPage";
import NavBar from "../src/components/NavBar";
import Messages from "../src/components/Messages";
import "./i18n/i18n";
import { storeContext } from "./context/store";
import axios from "axios";
import RouteWrapper from "./components/RouteWrapper";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [loading, setLoading] = useState(true);

  const { store, dispatch } = useContext(storeContext);
  useEffect(() => {
    axios
      .post(
        "http://localhost:5005/users/token-check",
        { token: localStorage.getItem("token") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status === "ok") {
          dispatch({
            type: "login",
            payload: {
              userDeatils: res.data.userDetails,
              friends: res.data.suggestedUsers,
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
        <Route
          path="/messages"
          element={<RouteWrapper component={Messages} />}
        />
        <Route
          path="/messages/:conversationId"
          element={<RouteWrapper component={Messages} />}
        />
        <Route path="/user/:id" element={<AnotherUserPage />} />
        <Route path="/register" element={<RegisterProcess />} />
      </Routes>
    </div>
  );
}

export default App;
