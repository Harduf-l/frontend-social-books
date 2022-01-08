import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
          `http://localhost:5005/users/get-by-id/${partnerId}`
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
      onClick={() => navigate(`/messages/${conversation._id}`)}
      className="d-flex justify-content-between p-3 borderBottomProfile"
      style={chosen ? { backgroundColor: "white" } : {}}
    >
      <p>{friend.username}</p>
      <img
        className="profilePicInChat"
        src={`http://localhost:5005/${friend.picture}`}
        alt=""
      />
    </div>
  );
}

export default Conversation;
