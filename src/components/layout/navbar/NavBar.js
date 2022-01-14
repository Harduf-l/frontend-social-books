import React, { useState, useRef } from "react";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const lngs = {
  en: { nativeName: "English" },
  he: { nativeName: "Hebrew" },
};

function NavBar() {
  let navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [showMobileLink, setShowMobileLinks] = useState(false);
  const searchWord = useRef();

  const moveToSearchPage = () => {
    const searchForWord = searchWord.current.value;
    searchWord.current.value = "";
    navigate(`/bookSearch?search=${searchForWord}`);
  };

  return (
    <div className={styles.NavTotalBar}>
      <div className={styles.mobileSection}>
        <div
          onClick={() => {
            setShowMobileLinks(!showMobileLink);
          }}
          className={`${styles.manubarMobile} mt-1`}
        >
          <i className="fas fa-bars"></i>
        </div>
        <input
          className={styles.inputMobile}
          type="text"
          placeholder="אני מחפש..."
        />
        <span
          onClick={() => moveToSearchPage()}
          className={`${styles.searchButton} me-3 ms-3`}
        >
          <i className="fas fa-search"></i>
        </span>
      </div>
      <div className={styles.NavBar}>
        <div className={styles.RightSide}>
          <div
            className={styles.myRightLinks}
            id={showMobileLink ? styles.mobileView : ""}
          >
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              id="homeLogo"
              className={styles.navlinkStatic}
              style={{ marginInlineEnd: "20px" }}
              to="/"
            >
              <span className={styles.menuIcon}>
                <i className={`far fa-circle ${styles.menuIcon}`}></i>
                <i className="fas fa-circle"></i>
              </span>
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/profile"
            >
              {t("navbar.profile")}
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/messages"
            >
              {t("navbar.messages")}
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/events"
            >
              {t("navbar.events")}
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/books"
            >
              {t("navbar.books")}
            </NavLink>
          </div>
        </div>
        <div className={styles.LeftSide}>
          <input
            ref={searchWord}
            type="text"
            placeholder={t("navbar.search")}
          />
          <span
            onClick={() => moveToSearchPage()}
            className={`${styles.searchButton} me-3 ms-3`}
          >
            <i className="fas fa-search"></i>
          </span>
          {Object.keys(lngs).map((lng) => (
            <span
              className={styles.navlinkStatic}
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
