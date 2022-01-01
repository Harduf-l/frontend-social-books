import React from "react";
import { useTranslation } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  he: { nativeName: "Hebrew" },
};

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  return (
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
  );
}

export default LanguageSwitcher;
