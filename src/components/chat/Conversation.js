import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { storeContext } from "../../context/store";
import { useNavigate } from "react-router-dom";
import defaultPicture from "../../images/plain.jpg";
import styles from "./chat.module.css";
import { useTranslation } from "react-i18next";

function Conversation({
  conversations,
  chosen,
  removeCurrentConversation,
  userId,
}) {
  const { dispatch } = useContext(storeContext);
  let navigate = useNavigate();
  const { t } = useTranslation();

  const removeCurrentAndNavigate = (conversation) => {
    if (conversation._id === chosen) {
      return;
    }

    removeCurrentConversation();

    if (conversation.shouldSee.personId === userId) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}messages/update-should-see/${conversation._id}`
        )
        .then((res) => console.log(res));

      dispatch({
        type: "updateSeen",
        payload: { convId: conversation._id },
      });
    }

    navigate(`/messages/${conversation._id}`);
  };

  return (
    <div className="d-flex flex-column-reverse">
      {conversations &&
        conversations.length > 0 &&
        conversations.map((c, index) => {
          return (
            <div
              role="button"
              key={c._id}
              onClick={() => removeCurrentAndNavigate(c)}
              className={`d-flex justify-content-between p-3 ${styles.borderBottomProfile}`}
              style={chosen === c._id ? { backgroundColor: "white" } : {}}
            >
              <div>
                <p>{c.members[0].username}</p>
                {c.shouldSee.personId === userId && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#6d6d6d",
                      fontStyle: "italic",
                    }}
                  >
                    {c.shouldSee.count} {t("chat.messages not read")}
                  </p>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <img
                  className={styles.profilePicInChat}
                  src={
                    c.members[0].picture ? c.members[0].picture : defaultPicture
                  }
                  alt=""
                />
                <div className={styles.onlineSignOn}></div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Conversation;
