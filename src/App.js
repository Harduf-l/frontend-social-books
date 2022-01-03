import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RegisterProcess from "./components/RegisterProcess";
import { Routes, Route } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";
import HomePageUser from "./components/HomePageUser";
import ResigterHomePage from "../src/components/ResigterHomePage";
import AnotherUserPage from "../src/components/AnotherUserPage";
import "./i18n/i18n";
import { storeContext } from "./context/store";
import axios from "axios";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const [loading, setLoading] = useState(true);

  const { store, dispatch } = useContext(storeContext);
  useEffect(() => {
    axios
      .post(
        "http://localhost:5005/tokenCheck",
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

  const Blank = () => {
    return <div></div>;
  };
  return (
    <div>
      <LanguageSwitcher />
      <Routes>
        {!loading ? (
          <Route
            path="/"
            element={store.isAuth ? <HomePageUser /> : <ResigterHomePage />}
          />
        ) : (
          <Route path="/" element={<Blank />} />
        )}

        <Route path="/user/:id" element={<AnotherUserPage />} />
        <Route path="/register" element={<RegisterProcess />} />
      </Routes>
    </div>
  );
}

export default App;
