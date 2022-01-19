import React from "react";
import styles from "./NavBar.module.css";
import defaultPicture from "../../../images/plain.jpg";
import { useTranslation } from "react-i18next";
import axios from "axios";

function FriendRequestsBox({ myPendingConnections }) {
  const { i18n } = useTranslation();
  const currentDir = i18n.dir();

  const confirmFriendRequest = async (connection) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}connections/approve-connection-request`,
        { connectionId: connection.connectionId }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFriendRequest = async (connection) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}connections/delete-connection-request`,
        { data: { connectionId: connection.connectionId } }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={
        currentDir === "rtl" ? styles.friendBoxHeb : styles.friendBoxEng
      }
    >
      <div className={styles.arrowUp}></div>
      <div className={styles.contentItselfBox}>
        {myPendingConnections.length > 0 &&
          myPendingConnections.map((el) => {
            return (
              <div
                key={el.connectionId}
                className="d-flex justify-content-between pt-2 pb-1"
              >
                <div>
                  <img
                    className={styles.userPicRequestFriend}
                    src={
                      el.pictureOfSender ? el.pictureOfSender : defaultPicture
                    }
                    alt=""
                  />
                  <span style={{ paddingInlineStart: 10 }}>
                    {el.nameOfSender}
                  </span>
                </div>
                <div className="align-self-center">
                  <button
                    onClick={() => confirmFriendRequest(el)}
                    className="btn btn-sm btn-light m-2"
                  >
                    אשר
                  </button>
                  <button
                    onClick={() => deleteFriendRequest(el)}
                    className="btn btn-sm btn-light"
                  >
                    בטל
                  </button>
                </div>
              </div>
            );
          })}
        {(myPendingConnections.length === 0 || !myPendingConnections) && (
          <div>
            <p style={{ textAlign: "center", fontSize: 12, paddingTop: 5 }}>
              אין הצעות חברות חדשות
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendRequestsBox;
