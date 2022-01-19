import React, { useState, useRef, useContext } from "react";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BookMeLogo from "../../../images/BookMe.png";
import { storeContext } from "../../../context/store";
import defaultProfilePicture from "../../../images/plain.jpg";
import FriendRequestBox from "./FriendRequestsBox";

const lngs = {
  en: { nativeName: "English" },
  he: { nativeName: "Hebrew" },
};

function NavBar() {
  const { store, dispatch } = useContext(storeContext);
  const { username, picture } = store.userDetails;
  const [openFriendsRequestsModal, setOpenFriendsRequestsModal] =
    useState(false);
  const { myPendingConnections } = store;

  let navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [showMobileLink, setShowMobileLinks] = useState(false);
  const searchWord = useRef();
  const searchWordMobile = useRef();

  const changePendingFriendRequests = (connection) => {
    let newMyPendingConnections = [...myPendingConnections];

    let indexToDelete = newMyPendingConnections.indexOf(
      (el) => el.connectionId === connection.connectionId
    );
    newMyPendingConnections.splice(indexToDelete, 1);

    dispatch({
      type: "changePendingFriendRequests",
      payload: { newMyPendingConnections },
    });
  };

  const moveToSearchPage = (e, type) => {
    e.preventDefault();
    let searchForWord;
    if (searchWord.current.value) {
      searchForWord = searchWord.current.value;
      searchWord.current.value = "";
    } else if (searchWordMobile.current.value) {
      searchForWord = searchWordMobile.current.value;
      searchWordMobile.current.value = "";
    }

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
        <form onSubmit={moveToSearchPage} className="d-flex flex-wrap">
          <input
            ref={searchWordMobile}
            className={styles.inputMobile}
            type="text"
            placeholder="אני מחפש..."
          />
          <button type="submit" className={`${styles.searchButton} me-3 ms-3`}>
            <i className="fas fa-search"></i>
          </button>
        </form>
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
              to="/"
            >
              <span className={styles.menuIcon}>
                <img src={BookMeLogo} className="iconBook" alt="" />
              </span>
            </NavLink>
            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/profile"
            >
              <div className={styles.divProfileNav}>
                <span style={{ marginInlineStart: 5 }}>
                  {t("navbar.profile")}
                </span>
              </div>
            </NavLink>

            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/groups"
            >
              <div className={styles.divProfileNav}>
                <span style={{ marginInlineStart: 5 }}>
                  {t("navbar.groups")}
                </span>
              </div>
            </NavLink>

            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              className={styles.navlink}
              to="/events"
            >
              <div className={styles.divProfileNav}>
                <span style={{ marginInlineStart: 5 }}>
                  {t("navbar.events")}
                </span>
              </div>
            </NavLink>

            <NavLink
              onClick={() => {
                setShowMobileLinks(false);
              }}
              to="/messages"
              className={styles.marginInlineStart}
            >
              <div className={styles.notificationSymbol}>
                <i className="far fa-envelope"></i>
                <div className={styles.notificationNumberContainer}>
                  <span className={styles.notificationNumber}>3</span>
                </div>
              </div>
            </NavLink>
            <div className={styles.notificationSymbol}>
              <i className="far fa-bell"></i>
              <div className={styles.notificationNumberContainer}>
                <span className={styles.notificationNumber}>1</span>
              </div>
            </div>

            <div
              role={"button"}
              onClick={() =>
                setOpenFriendsRequestsModal(!openFriendsRequestsModal)
              }
              className={styles.notificationSymbol}
            >
              <i className="far fa-user-friends"></i>

              {store.myPendingConnections.length > 0 && (
                <div className={styles.notificationNumberContainer}>
                  <span className={styles.notificationNumber}>
                    {store.myPendingConnections.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.LeftSide}>
          <form onSubmit={(e) => moveToSearchPage(e)} className="d-flex">
            <input
              ref={searchWord}
              type="text"
              placeholder={t("navbar.search")}
              className="mt-2"
            />
            <button
              type="submit"
              className={`${styles.searchButton} me-3 ms-3`}
            >
              <i className="fas fa-search"></i>
            </button>
          </form>
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
      {openFriendsRequestsModal && (
        <FriendRequestBox
          myPendingConnections={myPendingConnections}
          changePendingFriendRequests={changePendingFriendRequests}
        />
      )}
    </div>
  );
}

export default NavBar;
