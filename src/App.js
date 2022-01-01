import ResigterHomePage from "./components/ResigterHomePage";
import { useTranslation } from "react-i18next";
import RegisterProcess from "./components/RegisterProcess";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";

import "./i18n/i18n";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  return (
    <div>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<ResigterHomePage />} />
        <Route path="/register" element={<RegisterProcess />} />
      </Routes>
    </div>
  );
}

export default App;
