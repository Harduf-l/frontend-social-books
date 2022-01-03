import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import RegisterProcess from "./components/RegisterProcess";
import { Routes, Route } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";
import HomePageUser from "./components/HomePageUser";
import ResigterHomePage from "../src/components/ResigterHomePage";
import "./i18n/i18n";
import { storeContext } from "./context/store";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const { store } = useContext(storeContext);
  console.log(store);
  return (
    <div>
      <LanguageSwitcher />
      <Routes>
        <Route
          path="/"
          element={store.isAuth ? <HomePageUser /> : <ResigterHomePage />}
        />
        <Route path="/register" element={<RegisterProcess />} />
      </Routes>
    </div>
  );
}

export default App;
