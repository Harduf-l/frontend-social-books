import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

function MessageIcon({ mobileView, numberOfUnViewdMessages }) {
  const [inHere, setInHere] = React.useState(false);

  useEffect(() => {
    if (window.location.pathname.includes("messages")) {
      setInHere(true);
    } else {
      setInHere(false);
    }
  }, [window.location.pathname]);

  return (
    <div className={styles.marginInlineStart}>
      <NavLink to="/messages">
        <div
          className={
            !mobileView
              ? styles.notificationSymbol
              : styles.notificationSymbolPhone
          }
        >
          {inHere ? (
            <i className="fas fa-envelope-open"></i>
          ) : (
            <i className="far fa-envelope"></i>
          )}

          {numberOfUnViewdMessages > 0 && (
            <div className={styles.notificationNumberContainer}>
              <span className={styles.notificationNumber}>
                {numberOfUnViewdMessages}
              </span>
            </div>
          )}
        </div>
      </NavLink>
    </div>
  );
}

export default MessageIcon;
