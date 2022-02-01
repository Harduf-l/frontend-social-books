import React, { useContext, useEffect, useState, useRef } from "react";
import { storeContext } from "../../context/store";
import axios from "axios";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import defaultPicture from "../../images/plain.jpg";
import styles from "./chat.module.css";
import { useNavigate } from "react-router-dom";
import "emoji-mart/css/emoji-mart.css";

import EmojiPicker from "./EmojiPicker";

function Chat({ sendMessageToSocket, sendTypingToSocket }) {
  let navigate = useNavigate();
  const { store, dispatch } = useContext(storeContext);
  const [chosenConversation, setChosenConversation] = useState({});

  const [showEmoji, setShowEmoji] = useState(false);

  let inputText = useRef("");
  const { i18n, t } = useTranslation();
  const currentDir = i18n.dir();
  let params = useParams();

  const closeEmojiModal = () => {
    setShowEmoji(false);
  };

  const sendMessage = async () => {
    let textToSend = inputText.current.value;
    if (!textToSend.trim()) return;
    setShowEmoji(false);
    inputText.current.value = "";

    const newMessage = {
      conversationId: chosenConversation._id,
      senderId: store.userDetails._id,
      receiverId: chosenConversation.members[0]._id,
      text: textToSend,
      createdAt: Date.now(),
    };
    dispatch({
      type: "addMessage",
      payload: { newMessage, chosenConversationId: chosenConversation._id },
    });

    if (chosenConversation.messages.length === 1) {
      try {
        let newConversationAfterCreation = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}messages/add-message`,
          { ...newMessage, createNewConversation: true }
        );

        newConversationAfterCreation =
          newConversationAfterCreation.data.newConverationCreated;

        dispatch({
          type: "replaceDemoConversationWithReal",
          payload: {
            demoConversationId: chosenConversation._id,
            newConversationAfterCreation,
          },
        });
        navigate(`/messages/${newConversationAfterCreation._id}`);
        // sending to socket the message with the id of the newly created conversation
        // the demo id isn't useful to the receiver side
        sendMessageToSocket({
          ...newMessage,
          conversationId: newConversationAfterCreation._id,
        });
      } catch (err) {
        console.log(err.response);
      }
    } else {
      try {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}messages/add-message`,
          newMessage
        );
        sendMessageToSocket(newMessage);
      } catch (err) {
        console.log(err.response);
      }
    }
  };

  useEffect(() => {
    setChosenConversation("");
    if (
      params.conversationId &&
      store.myConversations &&
      store.myConversations.length > 0
    ) {
      const convFound = store.myConversations.find((el) => {
        return el._id === params.conversationId;
      });

      if (!convFound) return;
      setChosenConversation(convFound);

      if (convFound.shouldSee.personId === store.userDetails._id) {
        axios
          .get(
            `${process.env.REACT_APP_SERVER_URL}messages/update-should-see/${convFound._id}`
          )
          .then((res) => console.log(res));

        dispatch({
          type: "updateSeen",
          payload: { convId: convFound._id },
        });
      }
    }
  }, [
    params.conversationId,
    store.myConversations,
    store.userDetails._id,
    dispatch,
  ]);

  const removeCurrentConversation = () => {
    setChosenConversation("");
  };

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

  const checkIfEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    inputText.current.value = inputText.current.value + emojiObject.native;
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", paddingBottom: 10 }}>
      <div className="container p-3">
        <div className={`d-flex flex-wrap mt-3 pb-1 `}>
          <div
            className={`col-12 col-lg-3 pt-3 ${styles.contactsChatContainer}`}
          >
            <Conversation
              conversations={store.myConversations}
              chosen={chosenConversation._id}
              removeCurrentConversation={removeCurrentConversation}
              userId={store.userDetails._id}
              onlineUsersMap={store.onlineUsers}
            />
          </div>
          <div
            className="col-12 col-lg-9 pt-3 pb-4 d-flex flex-column justify-content-between"
            style={{
              backgroundColor: "white",
              height: "450px",
              position: "relative",
              border: "1px solid #e6e6e6",
            }}
          >
            <EmojiPicker
              showEmoji={showEmoji}
              onEmojiClick={onEmojiClick}
              closeEmojiModal={closeEmojiModal}
            />
            <div className="">
              {chosenConversation &&
                chosenConversation._id &&
                chosenConversation.messages.length === 0 &&
                chosenConversation.members[0].username && (
                  <p className="p-3">
                    {t("chat.starConversationWith")}{" "}
                    {chosenConversation.members[0].username}
                  </p>
                )}
              {!chosenConversation && (
                <p className="p-3">{t("chat.chooseConversation")}</p>
              )}
            </div>
            <div
              className="d-flex flex-column-reverse"
              style={{
                height: "390px",
                overflowY: "auto",
                position: "relative",
              }}
            >
              {chosenConversation &&
                chosenConversation.messages &&
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
                                el.senderId === store.userDetails._id
                                  ? "d-flex "
                                  : "d-flex justify-content-end"
                              }
                            >
                              {el.senderId === store.userDetails._id && (
                                <div
                                  className={
                                    currentDir === "rtl"
                                      ? styles.rightTriangle
                                      : styles.rightTriangleEng
                                  }
                                ></div>
                              )}

                              <div
                                className={
                                  el.senderId === store.userDetails._id
                                    ? currentDir === "rtl"
                                      ? styles.userMiniMessage
                                      : styles.userMiniMessageEng
                                    : currentDir === "rtl"
                                    ? styles.partnerMiniMessage
                                    : styles.partnerMiniMessageEng
                                }
                              >
                                <div> {el.text}</div>
                              </div>
                              {el.senderId !== store.userDetails._id && (
                                <div
                                  className={
                                    currentDir === "ltr"
                                      ? styles.leftTriangleEng
                                      : styles.leftTriangle
                                  }
                                ></div>
                              )}
                            </div>

                            <div
                              dir="ltr"
                              className={styles.timeAgo}
                              style={calculateStyle(
                                el.senderId,
                                store.userDetails._id
                              )}
                            >
                              {el.createdAt && format(el.createdAt)}
                            </div>
                          </div>

                          {el.senderId !== store.userDetails._id && (
                            <img
                              src={
                                chosenConversation.members[0].picture
                                  ? chosenConversation.members[0].picture
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

            <div style={{ height: "60px" }}>
              {chosenConversation && (
                <div className={styles.emojiRow}>
                  <i
                    onClick={() => setShowEmoji((prev) => !prev)}
                    role="button"
                    id="emojiButton"
                    className={`far fa-grin ${styles.emojiButton}`}
                  ></i>
                  {chosenConversation && chosenConversation.typing && (
                    <span style={{ fontSize: 12, marginInlineStart: 5 }}>
                      {chosenConversation.members[0].username}
                      {t("chat.typing")}
                    </span>
                  )}
                </div>
              )}
              {chosenConversation && (
                <div className="d-flex justify-content-between flex-row">
                  <textarea
                    ref={inputText}
                    type="text"
                    className={`flex-grow-1 ${styles.inputChat}`}
                    onKeyDown={() =>
                      sendTypingToSocket(
                        chosenConversation.members[0]._id,
                        chosenConversation._id
                      )
                    }
                    onKeyPress={checkIfEnter}
                  />

                  <button
                    className="flex-grow-2 btn btn-light"
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
    </div>
  );
}

export default Chat;
