import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

function MessageIcon({ mobileView }) {
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
        <div className={styles.notificationNumberContainer}>
          <span className={styles.notificationNumber}>3</span>
        </div>
      </div>
    </NavLink>
  );
}

export default MessageIcon;
