import React, { useContext, useEffect, useState, useRef } from "react";
import { storeContext } from "../../context/store";
import axios from "axios";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";
import defaultPicture from "../../images/plain.jpg";
import { io } from "socket.io-client";
import styles from "./chat.module.css";

function Chat() {
  const { store } = useContext(storeContext);
  const [messagesThread, setMessagesThread] = useState([]);
  const [chosenConversationId, setChosenConversationId] = useState("");
  const [chosenPersonPicture, setChosenPersonPicture] = useState([]);
  const [userConversation, setUserConversations] = useState([]);
  const [usersOnlineArray, setUsersOnlineArray] = useState([]);
  const [arrivedMessages, setArrivedMessages] = useState([]);

  const socket = useRef();
  const { i18n, t } = useTranslation();
  const currentDir = i18n.dir();
  let typedMessage = useRef();
  let lastMessage = useRef();
  let params = useParams();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL);

    socket.current.on("getMessage", (data) => {
      setArrivedMessages({
        sender: data.sender,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    socket.current.on("getUsers", (usersOnline) => {
      console.log("user online array ", usersOnline);
      setUsersOnlineArray(usersOnline);
    });

    return () => {
      socket.current = null;
    };
  }, []);

  useEffect(() => {
    arrivedMessages &&
      params.friendId === arrivedMessages.sender &&
      setMessagesThread((prev) => [...prev, arrivedMessages]);
  }, [arrivedMessages, params.friendId]);

  useEffect(() => {
    socket.current.emit("addUser", store.userDetails._id);
  }, [store.userDetails._id]);

  const sendMessage = async () => {
    let textToSend = typedMessage.current.value;
    typedMessage.current.value = "";
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

    socket.current.emit("sendMessage", {
      senderId: store.userDetails._id,
      receiverId: params.friendId,
      text: textToSend,
    });

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
            if (friend.data.picture) {
              setChosenPersonPicture(friend.data.picture);
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

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesThread]);

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

  return (
    <div className="container mt-4 p-3">
      <div className="d-flex  flex-wrap" style={{ height: "400px" }}>
        <div className={`col-12 col-lg-3 pt-3 ${styles.contactsChatContainer}`}>
          {userConversation.length > 0 &&
            userConversation.map((c) => {
              return (
                <Conversation
                  key={c._id}
                  conversation={c}
                  currentUserId={store.userDetails._id}
                  chosen={chosenConversationId === c._id}
                  usersOnlineArray={usersOnlineArray}
                />
              );
            })}
        </div>
        <div
          className="col-12 col-lg-9 pt-3 pb-2 d-flex flex-column justify-content-between"
          style={{ backgroundColor: "#b8c4cf", height: "400px" }}
        >
          <div
            style={{
              height: "350px",
              overflowY: "scroll",
            }}
          >
            {messagesThread.length > 0 ? (
              messagesThread
                .filter((el) => el.text)
                .map((el, index) => {
                  return (
                    <div key={index}>
                      <div
                        ref={
                          index === messagesThread.length - 1
                            ? lastMessage
                            : null
                        }
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
                                ? `${process.env.REACT_APP_SERVER_URL}${store.userDetails.picture}`
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
                                ? `${process.env.REACT_APP_SERVER_URL}${chosenPersonPicture}`
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
                })
            ) : (
              <p className="p-3">התחל שיחה...</p>
            )}
            {!chosenConversationId && <p className="p-3">בחר שיחה...</p>}
          </div>
          <div style={{ height: "50px", paddingTop: "10px" }}>
            {chosenConversationId && (
              <div className="d-flex justify-content-between flex-row">
                <input
                  type="text"
                  className="flex-grow-1 inputChat"
                  ref={typedMessage}
                />
                <button className="btn btn-secondary" onClick={sendMessage}>
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
