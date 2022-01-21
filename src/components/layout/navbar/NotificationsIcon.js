import React from "react";
import styles from "./NavBar.module.css";
function NotificationsIcon({ mobileView }) {
  return (
    <div className={styles.marginTopDesktop}>
      <div
        className={
          !mobileView
            ? styles.notificationSymbol
            : styles.notificationSymbolPhone
        }
      >
        <i className="far fa-bell"></i>
        <div className={styles.notificationNumberContainer}>
          <span className={styles.notificationNumber}>1</span>
        </div>
      </div>
    </div>
  );
}

export default NotificationsIcon;
