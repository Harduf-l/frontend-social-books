import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultPicture from "../../images/plain.jpg";
import styles from "./chat.module.css";

function Conversation({ conversation, currentUserId, chosen }) {
  const [friend, setFriend] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPartnerData = async () => {
      let partnerId =
        conversation.members[0] === currentUserId
          ? conversation.members[1]
          : conversation.members[0];

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}users/get-by-id/${partnerId}`
        );
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPartnerData();
  }, [conversation, currentUserId]);

  if (!friend) {
    return <div></div>;
  }
  return (
    <div
      role="button"
      key={friend._id}
      onClick={() => navigate(`/messages/${conversation._id}/${friend._id}`)}
      className={`d-flex justify-content-between p-3 ${styles.borderBottomProfile}`}
      style={chosen ? { backgroundColor: "white" } : {}}
    >
      <p>{friend.username}</p>
      <div style={{ position: "relative" }}>
        <img
          className={styles.profilePicInChat}
          src={friend.picture ? friend.picture : defaultPicture}
          alt=""
        />
        <div className={styles.onlineSignOn}></div>
      </div>
    </div>
  );
}

export default Conversation;
