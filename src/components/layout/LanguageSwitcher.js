import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BookMeLogo from "../../images/BookMe.png";

const lngs = {
  en: { nativeName: "English" },
  he: { nativeName: "Hebrew" },
};

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-between mb-2 mt-1">
      <Link to="/">
        <div className="menuIcon">
          <img src={BookMeLogo} className="iconBook" alt="" />
        </div>
      </Link>
      <div>
        {Object.keys(lngs).map((lng) => (
          <p
            className="btn"
            key={lng}
            style={{
              fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
            }}
            type="submit"
            onClick={() => i18n.changeLanguage(lng)}
          >
            {t(lngs[lng].nativeName)}
          </p>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
