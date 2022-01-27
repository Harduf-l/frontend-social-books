import React, { useRef, useEffect } from "react";
import styles from "./NavBar.module.css";
import defaultPicture from "../../../images/plain.jpg";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FriendRequestsBox({
  myPendingConnections,
  changePendingFriendRequests,
  closeFriendsModal,
}) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentDir = i18n.dir();

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClose);

    function handleClose(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        event.target.className !== "far fa-user-friends"
      ) {
        closeFriendsModal();
      }
    }

    return () => document.removeEventListener("click", handleClose);
  }, [closeFriendsModal]);

  const confirmFriendRequest = async (connection, index) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}connections/approve-connection-request`,
        { connectionId: connection.connectionId }
      );
      changePendingFriendRequests(index);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFriendRequest = async (connection, index) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}connections/delete-connection-request`,
        { data: { connectionId: connection.connectionId } }
      );

      changePendingFriendRequests(index);
    } catch (err) {
      console.log(err);
    }
  };

  const navigateAndCloseFriendModal = (el) => {
    closeFriendsModal();
    navigate(`/user/${el.idOfSender}`);
  };

  return (
    <div
      ref={wrapperRef}
      className={
        currentDir === "rtl" ? styles.friendBoxHeb : styles.friendBoxEng
      }
    >
      <div className={styles.arrowUp}></div>

      <div className={styles.contentItselfBox}>
        {myPendingConnections.length > 0 &&
          myPendingConnections.map((el, index) => {
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
                    role={"button"}
                    onClick={() => navigateAndCloseFriendModal(el)}
                  />

                  <span style={{ paddingInlineStart: 10 }}>
                    {el.nameOfSender}
                  </span>
                </div>
                <div className="align-self-center">
                  <button
                    onClick={() => confirmFriendRequest(el, index)}
                    className="btn btn-sm btn-light m-2"
                  >
                    אשר
                  </button>
                  <button
                    onClick={() => deleteFriendRequest(el, index)}
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
            <p style={{ textAlign: "center", fontSize: 12, paddingTop: 13 }}>
              אין הצעות חברות חדשות
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendRequestsBox;
