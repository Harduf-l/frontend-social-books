import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../../context/store";
import axios from "axios";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import defaultPicture from "../../images/plain.jpg";
import styles from "./chat.module.css";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat() {
  const { store } = useContext(storeContext);

  const [chosenConversation, setChosenConversation] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { i18n, t } = useTranslation();
  const currentDir = i18n.dir();
  let params = useParams();

  const sendMessage = async () => {
    let textToSend = typedMessage;
    setShowEmoji(false);
    setTypedMessage("");
    const newMessage = {
      conversationId: chosenConversation._id,
      senderId: store.userDetails._id,
      receiverId: params.friendId,
      text: textToSend,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}messages/add-message`,
        newMessage
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!params.conversationId) {
      setChosenConversation("");
    }

    if (params.conversationId) {
      const convFound = store.myConversations.find(
        (el) => el._id === params.conversationId
      );
      setChosenConversation(convFound);
    }
  }, [params.conversationId, store.myConversations]);

  const calculateStyle = (senderId, userId) => {
    if (currentDir === "rtl") {
      if (senderId === userId) {
        return { textAlign: "end" };
      }
      return { textAlign: "start" };
    } else {
      if (senderId === userId) {
        return { textAlign: "start" };
      }
      return { textAlign: "end" };
    }
  };

  const onEmojiClick = (emojiObject) => {
    setTypedMessage((prev) => prev + emojiObject.native);
  };

  return (
    <div className="container mt-1 p-3">
      <div className="d-flex  flex-wrap" style={{ height: "500px" }}>
        <div
          className={`col-12 col-lg-3 pt-3 ${styles.contactsChatContainer}`}
          style={{ border: "1px black solid" }}
        >
          <div className="d-flex justify-content-around pb-3">
            <label style={{ fontSize: "17px" }} htmlFor="startConv">
              {t("profile.search")}
            </label>
            <input type="text" id="startConv" />
          </div>
          <div className="d-flex flex-column-reverse">
            {store.myConversations.length > 0 &&
              store.myConversations.map((c) => {
                return (
                  <Conversation
                    key={c._id}
                    conversation={c}
                    chosen={chosenConversation._id === c._id}
                  />
                );
              })}
          </div>
        </div>
        <div
          className="col-12 col-lg-9 pt-3 pb-4 d-flex flex-column justify-content-between"
          style={{
            backgroundColor: "#f3f3f3",
            height: "480px",
            position: "relative",
          }}
        >
          <Picker
            style={{
              position: "absolute",
              bottom: "120px",
              marginInlineStart: "5px",
              zIndex: "999",
              width: "75%",
              display: showEmoji ? "block" : "none",
            }}
            showSkinTones={false}
            showPreview={false}
            onClick={onEmojiClick}
            exclude={["flags"]}
            native={true}
          />
          <div className="">
            {chosenConversation._id &&
              chosenConversation.messages === 0 &&
              chosenConversation.nameOfFriend && (
                <p className="p-3">
                  {t("chat.starConversationWith")}{" "}
                  {chosenConversation.nameOfFriend}
                </p>
              )}
            {!chosenConversation && (
              <p className="p-3">{t("chat.chooseConversation")}</p>
            )}
          </div>
          <div
            className="d-flex flex-column-reverse"
            style={{
              height: "480px",
              overflowY: "scroll",
              position: "relative",
            }}
          >
            {chosenConversation.messages &&
              chosenConversation.messages.length > 0 &&
              chosenConversation.messages
                .slice(0)
                .reverse()
                .map((el, index) => {
                  return (
                    <div key={index}>
                      <div
                        className={
                          el.senderId === store.userDetails._id
                            ? styles.userMessage
                            : styles.partnerMessage
                        }
                      >
                        {el.senderId === store.userDetails._id && (
                          <img
                            src={
                              store.userDetails.picture
                                ? store.userDetails.picture
                                : defaultPicture
                            }
                            style={{ marginInlineEnd: "10px" }}
                            className={styles.profileChatPic}
                            alt=""
                          />
                        )}
                        <div className={styles.chatContentNoPic}>
                          <div
                            className={
                              el.sender === store.userDetails._id
                                ? styles.userMiniMessage
                                : styles.partnerMiniMessage
                            }
                          >
                            <div> {el.text}</div>
                          </div>
                          <div
                            dir="ltr"
                            className={styles.timeAgo}
                            style={calculateStyle(
                              el.sender,
                              store.userDetails._id
                            )}
                          >
                            {el.createdAt ? format(el.createdAt) : "just now"}
                          </div>
                        </div>

                        {el.senderId !== store.userDetails._id && (
                          <img
                            src={
                              chosenConversation.pictureOfFriend
                                ? chosenConversation.pictureOfFriend
                                : defaultPicture
                            }
                            style={{ marginInlineStart: "10px" }}
                            className={styles.profileChatPic}
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>

          <div style={{ height: "100px", paddingTop: "10px" }}>
            {chosenConversation && (
              <div className={styles.emojiRow}>
                <i
                  onClick={() => setShowEmoji((prev) => !prev)}
                  role="button"
                  className={`far fa-grin ${styles.emojiButton}`}
                ></i>
              </div>
            )}
            {chosenConversation && (
              <div className="d-flex justify-content-between flex-row">
                <textarea
                  type="text"
                  className={`flex-grow-1 ${styles.inputChat}`}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />

                <button
                  className="flex-grow-2 btn btn-secondary"
                  onClick={sendMessage}
                >
                  {t("form.send")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
