import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultPicture from "../../images/plain.jpg";
import styles from "./chat.module.css";

function Conversation({ conversation, chosen }) {
  let navigate = useNavigate();

  return (
    <div
      role="button"
      key={conversation._id}
      onClick={() => navigate(`/messages/${conversation._id}`)}
      className={`d-flex justify-content-between p-3 ${styles.borderBottomProfile}`}
      style={chosen ? { backgroundColor: "white" } : {}}
    >
      <p>{conversation.nameOfFriend}</p>
      <div style={{ position: "relative" }}>
        <img
          className={styles.profilePicInChat}
          src={
            conversation.pictureOfFriend
              ? conversation.pictureOfFriend
              : defaultPicture
          }
          alt=""
        />
        <div className={styles.onlineSignOn}></div>
      </div>
    </div>
  );
}

export default Conversation;
