import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

function MessageIcon({ mobileView, numberOfUnViewdMessages }) {
  return (
    <NavLink to="/messages" className={styles.marginInlineStart}>
      <div
        className={
          !mobileView
            ? styles.notificationSymbol
            : styles.notificationSymbolPhone
        }
      >
        <i className="far fa-envelope"></i>
        {numberOfUnViewdMessages > 0 && (
          <div className={styles.notificationNumberContainer}>
            <span className={styles.notificationNumber}>
              {numberOfUnViewdMessages}
            </span>
          </div>
        )}
      </div>
    </NavLink>
  );
}

export default MessageIcon;
