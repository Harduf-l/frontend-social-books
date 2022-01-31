import React, { useState, useRef, useContext, useEffect } from "react";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BookMeLogo from "../../../images/BookMe.png";
import { storeContext } from "../../../context/store";
import FriendRequestBox from "./FriendRequestsBox";
import FriendIcon from "./FriendIcon";
import MessageIcon from "./MessageIcon";
import NotificationsIcon from "./NotificationsIcon";

const lngs = {
  en: { nativeName: "English" },
  he: { nativeName: "Hebrew" },
};

function NavBar() {
  const { store, dispatch } = useContext(storeContext);

  const [inHomePage, setInHomePage] = useState(true);
  const [openFriendsRequestsModal, setOpenFriendsRequestsModal] =
    useState(false);

  let navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [showMobileLink, setShowMobileLinks] = useState(false);
  const searchWord = useRef();
  const searchWordMobile = useRef();

  const closeFriendsModal = (type) => {
    if (type === "opposite") {
      setOpenFriendsRequestsModal(!openFriendsRequestsModal);
    } else {
      setOpenFriendsRequestsModal(false);
    }
  };

  const changePendingFriendRequests = (index) => {
    let newMyPendingConnections = [...store.myPendingConnections];

    newMyPendingConnections.splice(index, 1);

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

  const changeLangCloseManu = (lng) => {
    i18n.changeLanguage(lng);
    setShowMobileLinks(false);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={!showMobileLink ? styles.NavTotalBar : styles.NavTotalBarPhone}
    >
      <div className={styles.manubarMobile}>
        <div
          onClick={() => {
            setShowMobileLinks(!showMobileLink);
          }}
          className={`mt-1`}
        >
          <i className="fas fa-bars"></i>
        </div>
        <div className="d-flex flex-row flex-wrap mb-2">
          <MessageIcon
            mobileView={true}
            numberOfUnViewdMessages={store.numberOfUnSeenMessages}
          />
          <NotificationsIcon mobileView={true} />
          <FriendIcon
            mobileView={true}
            closeFriendsModal={closeFriendsModal}
            myPendingConnections={store.myPendingConnections}
            styles={styles}
            openFriendsRequestsModal={openFriendsRequestsModal}
          />
          <div style={{ marginInlineStart: 20 }}>
            <NavLink
              to="/"
              style={({ isActive }) => setInHomePage(isActive)}
              className={styles.marginInlineStart}
            >
              <div className={styles.notificationSymbolPhone}>
                {inHomePage ? (
                  <i style={{ fontSize: 28 }} className="far fa-home-lg"></i>
                ) : (
                  <i style={{ fontSize: 28 }} className="fal fa-home-lg"></i>
                )}
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      <div
        className={
          showMobileLink ? styles.mobileView : styles.navBarFlexDirection
        }
      >
        <div className={styles.flexDirection}>
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
            style={({ isActive }) => ({ fontWeight: isActive ? 600 : 400 })}
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
            style={({ isActive }) => ({ fontWeight: isActive ? 600 : 400 })}
          >
            <div className={styles.divProfileNav}>
              <span style={{ marginInlineStart: 5 }}>{t("navbar.groups")}</span>
            </div>
          </NavLink>
          <NavLink
            onClick={() => {
              setShowMobileLinks(false);
            }}
            className={styles.navlink}
            to="/events"
            style={({ isActive }) => ({ fontWeight: isActive ? 600 : 400 })}
          >
            <div className={styles.divProfileNav}>
              <span style={{ marginInlineStart: 5 }}>{t("navbar.events")}</span>
            </div>
          </NavLink>

          <MessageIcon
            mobileView={false}
            numberOfUnViewdMessages={store.numberOfUnSeenMessages}
          />
          <NotificationsIcon mobileView={false} />
          <FriendIcon
            mobileView={false}
            openFriendsRequestsModal={openFriendsRequestsModal}
            closeFriendsModal={closeFriendsModal}
            myPendingConnections={store.myPendingConnections}
            styles={styles}
          />
        </div>

        <div className={styles.flexDirectionWithReverse}>
          <form
            onSubmit={(e) => moveToSearchPage(e)}
            className={styles.searchGroup}
          >
            <input
              className={styles.searchInput}
              ref={searchWord}
              type="text"
              placeholder={t("navbar.search")}
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
              onClick={() => changeLangCloseManu(lng)}
            >
              {t(lngs[lng].nativeName)}
            </span>
          ))}
        </div>
      </div>
      {openFriendsRequestsModal && (
        <FriendRequestBox
          myPendingConnections={store.myPendingConnections}
          changePendingFriendRequests={changePendingFriendRequests}
          closeFriendsModal={closeFriendsModal}
        />
      )}
    </div>
  );
}

export default NavBar;
