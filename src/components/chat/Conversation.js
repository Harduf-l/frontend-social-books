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
  onlineUsersMap,
}) {
  const { dispatch } = useContext(storeContext);
  let navigate = useNavigate();
  const { t } = useTranslation();

  const [filteredSearch, setFilteredSearch] = useState(conversations);
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    if (!searchWord) {
      setFilteredSearch(conversations);
      return;
    }
    let newFilteredArray = conversations.filter((el) =>
      el.members[0].username.startsWith(searchWord)
    );
    setFilteredSearch(newFilteredArray);
  }, [searchWord, conversations]);

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
    <div>
      <div className="d-flex justify-content-between align-items-center p-3 pt-0">
        <input
          onChange={(e) => setSearchWord(e.target.value)}
          style={{ width: "84%" }}
          type="text"
          id="startConv"
        />
        <i style={{ fontSize: 23 }} className="far fa-search"></i>
      </div>

      <div className="d-flex flex-column-reverse">
        {filteredSearch.length === 0 && (
          <p
            style={{
              marginInlineStart: 10,
              paddingTop: 10,
              width: "80%",
              margin: "0 auto",
            }}
          >
            {t("chat.empty chat box")}
          </p>
        )}
        {filteredSearch &&
          filteredSearch.length > 0 &&
          filteredSearch.map((c, index) => {
            return (
              <div
                role="button"
                key={c._id}
                onClick={() => removeCurrentAndNavigate(c)}
                className={`d-flex justify-content-around pt-2 pb-2 ${styles.borderBottomProfile}`}
                style={chosen === c._id ? { backgroundColor: "#e6e6e6" } : {}}
              >
                <div style={{ width: 133 }}>
                  <div style={{ height: 50 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {c.members[0].username}
                    </div>
                    <div className="mt-1 d-flex align-items-center">
                      <div
                        className={
                          onlineUsersMap[c.members[0]._id]
                            ? `${styles.onlineSignOn} ${styles.onlineSign}`
                            : `${styles.onlineSignOff} ${styles.onlineSign}`
                        }
                      ></div>
                      {onlineUsersMap[c.members[0]._id] ? (
                        <div style={{ fontSize: 12, marginInlineStart: 5 }}>
                          {t("chat.online")}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, marginInlineStart: 5 }}>
                          {t("chat.offline")}
                        </div>
                      )}
                    </div>
                  </div>
                  {c.shouldSee.personId === userId && (
                    <p
                      style={{
                        fontSize: 11,
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
                      c.members[0].picture
                        ? c.members[0].picture
                        : defaultPicture
                    }
                    alt=""
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Conversation;
