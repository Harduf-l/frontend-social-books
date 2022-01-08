import React, { useContext, useEffect, useState, useRef } from "react";
import { storeContext } from "../context/store";
import axios from "axios";
import Conversation from "./Conversation";
import { useParams } from "react-router-dom";

function Messages() {
  const { store, dispatch } = useContext(storeContext);
  const [messagesThread, setMessagesThread] = useState([]);
  const [chosenConversationId, setChosenConversationId] = useState("");
  const [userConversation, setUserConversations] = useState([]);
  let typedMessage = useRef();
  let chatDiv = useRef();
  let lastMessage = useRef();
  let params = useParams();

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
    try {
      const response = await axios.post(
        "http://localhost:5005/messages/add-message",
        newMessage
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const asyncOperations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/messages/get-all-conversations/${store.userDetails._id}`
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
            `http://localhost:5005/messages/get-messages/${params.conversationId}`
          );
          setMessagesThread(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchMessages();
    }
  }, [params.conversationId]);

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesThread]);

  return (
    <div className="container mt-4 p-3">
      <div className="row" style={{ height: "400px" }}>
        <div className="col-12 col-lg-3 pt-3 contactsChatContainer">
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
        <div
          className="col-12 col-lg-9 pt-3 pb-2 d-flex flex-column justify-content-between"
          style={{ backgroundColor: "#b8c4cf", height: "400px" }}
        >
          <div
            ref={chatDiv}
            style={{
              height: "350px",
              overflowY: "scroll",
            }}
          >
            {messagesThread.length > 0 ? (
              messagesThread.map((el, index) => {
                return (
                  <div
                    ref={
                      index === messagesThread.length - 1 ? lastMessage : null
                    }
                    key={el._id}
                    className={
                      el.sender === store.userDetails._id
                        ? "userMessage"
                        : "partnerMessage"
                    }
                  >
                    <span
                      className={
                        el.sender === store.userDetails._id
                          ? "userMiniMessage"
                          : "partnerMiniMessage"
                      }
                    >
                      {el.text}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="p-3">התחל שיחה...</p>
            )}
          </div>
          <div style={{ height: "50px", paddingTop: "10px" }}>
            {chosenConversationId && (
              <div className="d-flex justify-content-between flex-row">
                <input type="text" className="flex-grow-1" ref={typedMessage} />
                <button className="btn btn-secondary" onClick={sendMessage}>
                  שלח
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
