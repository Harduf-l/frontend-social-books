import React, { useState } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  he: { nativeName: "Hebrew" },
};

function NavBar() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [showMobileLink, setShowMobileLinks] = useState(false);
  return (
    <div className="NavTotalBar">
      <div className="mobileSection">
        <div
          onClick={() => {
            setShowMobileLinks(!showMobileLink);
          }}
          className="manubarMobile mt-1"
        >
          <i className="fas fa-bars"></i>
        </div>
        <input className="inputMobile" type="text" placeholder="אני מחפש..." />
        <span className="searchButton me-3 ms-3">
          <i className="fas fa-search"></i>
        </span>
      </div>
      <div className="NavBar">
        <div className="RightSide">
          <div className="myRightLinks" id={showMobileLink ? "mobileView" : ""}>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              id="homeLogo"
              className="navlinkStatic"
              style={{ marginInlineEnd: "20px" }}
              to="/"
            >
              <span className="menuIcon">
                <i className="far fa-circle menuIcon"></i>
                <i className="fas fa-circle"></i>
              </span>
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className="navlink"
              to="/profile"
            >
              {t("navbar.profile")}
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className="navlink"
              to="/messages"
            >
              {t("navbar.messages")}
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className="navlink"
              to="/events"
            >
              {t("navbar.events")}
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className="navlink"
              to="/books"
            >
              {t("navbar.books")}
            </NavLink>
          </div>
        </div>
        <div className="LeftSide">
          <input type="text" placeholder={t("navbar.search")} />
          <span className="searchButton me-3 ms-3">
            <i className="fas fa-search"></i>
          </span>
          {Object.keys(lngs).map((lng) => (
            <span
              className="navlinkStatic"
              key={lng}
              style={{
                fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
              }}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {t(lngs[lng].nativeName)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
