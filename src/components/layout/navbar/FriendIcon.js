import React from "react";
import styles from "./NavBar.module.css";
function FriendIcon({
  closeFriendsModal,
  myPendingConnections,
  mobileView,
  openFriendsRequestsModal,
}) {
  return (
    <div className={styles.marginInlineStart}>
      <div
        role={"button"}
        onClick={() => closeFriendsModal("opposite")}
        className={
          !mobileView
            ? styles.notificationSymbol
            : styles.notificationSymbolPhone
        }
      >
        {openFriendsRequestsModal ? (
          <i className="fas fa-user-friends"></i>
        ) : (
          <i className="far fa-user-friends"></i>
        )}

        {myPendingConnections && myPendingConnections.length > 0 && (
          <div className={styles.notificationNumberContainer}>
            <span className={styles.notificationNumber}>
              {myPendingConnections.length}
            </span>
          </div>
        )}
      </div>
      {mobileView && openFriendsRequestsModal && (
        <div className={styles.arrowUpMobile}></div>
      )}
    </div>
  );
}

export default FriendIcon;
