import React from "react";
import styles from "./NavBar.module.css";
function FriendIcon({ closeFriendsModal, myPendingConnections, mobileView }) {
  return (
    <div className={styles.marginTopDesktop}>
      <div
        role={"button"}
        onClick={() => closeFriendsModal("opposite")}
        className={
          !mobileView
            ? styles.notificationSymbol
            : styles.notificationSymbolPhone
        }
      >
        <i className="far fa-user-friends"></i>

        {myPendingConnections && myPendingConnections.length > 0 && (
          <div className={styles.notificationNumberContainer}>
            <span className={styles.notificationNumber}>
              {myPendingConnections.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendIcon;