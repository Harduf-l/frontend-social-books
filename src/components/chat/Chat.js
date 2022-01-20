import React, { useContext, useEffect, useState, useRef } from "react";
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
  const [messagesThread, setMessagesThread] = useState([]);
  const [chosenConversationId, setChosenConversationId] = useState("");
  const [chosenPersonPicture, setChosenPersonPicture] = useState("");
  const [userConversation, setUserConversations] = useState([]);
  const [chosenPersonName, setChosenPersonName] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { i18n, t } = useTranslation();
  const currentDir = i18n.dir();
  let lastMessage = useRef();
  let params = useParams();

  useEffect(() => {
    setChosenConversationId("");
  }, []);

  const sendMessage = async () => {
    let textToSend = typedMessage;
    setShowEmoji(false);
    setTypedMessage("");
    const newMessage = {
      conversationId: chosenConversationId,
      sender: store.userDetails._id,
      text: textToSend,
    };

    setMessagesThread([
      ...messagesThread,
      {
        ...newMessage,
        _id: Math.random(),
      },
    ]);

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
    const asyncOperations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}messages/get-all-conversations/${store.userDetails._id}`
        );
        setUserConversations(response.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    asyncOperations();
  }, [store.userDetails._id]);

  useEffect(() => {
    if (!params.conversationId) {
      setMessagesThread([]);
      setChosenConversationId("");
      setChosenPersonName("");
    }

    if (params.conversationId) {
      setChosenConversationId(params.conversationId);

      const fetchMessages = async () => {
        setChosenConversationId(params.conversationId);

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}messages/get-messages/${params.conversationId}`
          );
          setMessagesThread(response.data);

          try {
            const friend = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}users/get-by-id/${params.friendId}`
            );
            setChosenPersonName(friend.data.username);
            if (friend.data.picture) {
              setChosenPersonPicture(friend.data.picture);
            } else {
              setChosenPersonPicture(null);
            }
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchMessages();
    }
  }, [params.conversationId, params.friendId]);

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

  // const hereAtLast = () => {
  //   lastMessage.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <div className="container mt-1 p-3">
      <div className="d-flex  flex-wrap" style={{ height: "500px" }}>
        <div className={`col-12 col-lg-3 pt-3 ${styles.contactsChatContainer}`}>
          <div className="d-flex justify-content-around pb-3">
            <label style={{ fontSize: "17px" }} htmlFor="startConv">
              {t("profile.search")}
            </label>
            <input type="text" id="startConv" />
          </div>
          <div className="d-flex flex-column-reverse">
            {userConversation.length > 0 &&
              userConversation.map((c) => {
                return (
                  <Conversation
                    key={c._id}
                    conversation={c}
                    currentUserId={store.userDetails._id}
                    chosen={chosenConversationId === c._id}
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
            {chosenConversationId &&
              messagesThread.length === 0 &&
              chosenPersonName && (
                <p className="p-3">
                  {t("chat.starConversationWith")} {chosenPersonName}
                </p>
              )}
            {!chosenConversationId && (
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
            {messagesThread.length > 0 &&
              messagesThread
                .slice(0)
                .reverse()
                .map((el, index) => {
                  return (
                    <div key={index}>
                      <div
                        ref={index === 0 ? lastMessage : null}
                        // onLoad={index === 0 ? hereAtLast : undefined}
                        className={
                          el.sender === store.userDetails._id
                            ? styles.userMessage
                            : styles.partnerMessage
                        }
                      >
                        {el.sender === store.userDetails._id && (
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

                        {el.sender !== store.userDetails._id && (
                          <img
                            src={
                              chosenPersonPicture
                                ? chosenPersonPicture
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
            {chosenConversationId && (
              <div className={styles.emojiRow}>
                <i
                  onClick={() => setShowEmoji((prev) => !prev)}
                  role="button"
                  className={`far fa-grin ${styles.emojiButton}`}
                ></i>
              </div>
            )}
            {chosenConversationId && (
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
