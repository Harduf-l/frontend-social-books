import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultPicture from "../../images/plain.jpg";
import styles from "./chat.module.css";

function Conversation({
  conversation,
  currentUserId,
  chosen,
  usersOnlineArray,
}) {
  const [friend, setFriend] = useState(null);
  const [online, setOnline] = useState(false);
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

        if (usersOnlineArray.length > 0) {
          if (usersOnlineArray.some((el) => el.userId === partnerId)) {
            setOnline(true);
          } else {
            setOnline(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPartnerData();
  }, [conversation, currentUserId, usersOnlineArray]);

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
      <img
        className={
          online ? styles.profilePicInChatOn : styles.profilePicInChatOff
        }
        src={
          friend.picture
            ? `${process.env.REACT_APP_SERVER_URL}${friend.picture}`
            : defaultPicture
        }
        alt=""
      />
    </div>
  );
}

export default Conversation;