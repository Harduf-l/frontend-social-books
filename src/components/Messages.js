import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../context/store";

function Messages() {
  const { store, dispatch } = useContext(storeContext);
  const [messagesThread, setMessagesThread] = useState([]);
  console.log(store);

  return (
    <div className="container mt-4">
      <div className="row" style={{ height: "400px" }}>
        <div className="col-12 col-lg-3 contactsChatContainer">
          {store.userSuggestedFriends.map((friend) => {
            return (
              <div className="d-flex justify-content-between pb-2 pt-2 borderBottomProfile">
                <div className="align-self-center">{friend.username}</div>
                <img
                  className="profilePicInChat"
                  src={`http://localhost:5005/${friend.picture}`}
                  alt=""
                />
              </div>
            );
          })}
        </div>
        <div
          className="col-12 col-lg-9"
          style={{
            backgroundColor: "#b8c4cf",
            overflowY: "scroll",
            height: "400px",
          }}
        >
          {messagesThread.length > 0 ? (
            messagesThread.map((el) => {})
          ) : (
            <p>No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
