import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storeContext } from "../../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserCard } from "./UserCard";
import defaultProfilePicture from "../../images/plain.jpg";
import { Link } from "react-router-dom";
import styles from "./profilePage.module.css";
import ContentProfilePage from "./ContentProfilePage";

function UserPage({ sendConnectionToSocket }) {
  let navigate = useNavigate();
  const { t } = useTranslation();
  let params = useParams();
  const { store, dispatch } = useContext(storeContext);
  const [currentUserPage, setCurrentUser] = useState("");
  const [friendshipStatus, setFriendshipStatus] = useState("");
  const [approvedFriends, setApprovedFriends] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}users/get-by-id/${params.id}`)
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {
        if (
          err.response.data.message &&
          err.response.data.message === "user not found"
        ) {
          navigate(`/`);
        }
      });

    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}connections/all-approved-connections/${params.id}`
      )
      .then((res) => {
        setApprovedFriends(res.data.approvedConnections);
      })
      .catch((err) => {
        console.log(err.response);
      });

    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}connections/connection-status`,
        { userId: store.userDetails._id, friendId: params.id }
      )
      .then((res) => {
        setFriendshipStatus(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [store, params.id, navigate]);

  const sendFriendRequest = async () => {
    setFriendshipStatus("friend request was sent");
    try {
      const friendRequest = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}connections/send-connection-request`,
        { senderId: store.userDetails._id, receiverId: params.id }
      );
      let newConnection = {
        connectionId: friendRequest.data._id,
        pictureOfSender: store.userDetails.picture,
        nameOfSender: store.userDetails.username,
        idOfSender: store.userDetails._id,
        idOfReceiver: params.id,
      };
      sendConnectionToSocket(newConnection);
    } catch (err) {
      console.log(err.response);
    }
  };

  const confirmFriendRequest = async () => {
    const connectionFound = store.myPendingConnections.find(
      (connection) => connection.idOfSender === params.id
    );

    ////
    let newMyPendingConnections = [...store.myPendingConnections];
    let indexToDelete = newMyPendingConnections.indexOf(
      (el) => el.connectionId === connectionFound.connectionId
    );
    newMyPendingConnections.splice(indexToDelete, 1);

    dispatch({
      type: "changePendingFriendRequests",
      payload: { newMyPendingConnections },
    });

    setFriendshipStatus("friendhip");

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}connections/approve-connection-request`,
        { connectionId: connectionFound.connectionId }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const createNewMessageAndNavigate = async () => {
    let indexResult = -1;
    if (store.myConversations && store.myConversations.length > 0) {
      indexResult = store.myConversations.findIndex(
        (el) => el.members[0]._id === params.id
      );
    }
    if (indexResult === -1) {
      let newConversationDemo = {
        members: [
          {
            username: currentUserPage.username,
            _id: currentUserPage._id,
            picture: currentUserPage.picture,
          },
        ],
        messages: [],
        shouldSee: { personId: "", count: 0 },
        _id: Math.random().toString(),
      };

      dispatch({
        type: "addConversation",
        payload: { newConversationCreated: newConversationDemo },
      });
      navigate(`/messages/${newConversationDemo._id}`);
    } else {
      navigate(`/messages/${store.myConversations[indexResult]._id}`);
    }
  };

  return (
    <div className="container pt-5 mb-5">
      {currentUserPage && (
        <div className="row">
          <div className="col-lg-3 col-md-6 col-12">
            <UserCard
              currentUserPage={currentUserPage}
              isItMe={false}
              createNewMessageAndNavigate={createNewMessageAndNavigate}
              sendFriendRequest={sendFriendRequest}
              confirmFriendRequest={confirmFriendRequest}
              friendshipStatus={friendshipStatus}
            />
          </div>

          <div className="col-lg-9 col-md-6 col-12 pt-4 pt-md-0">
            <ContentProfilePage
              currentUserPage={currentUserPage}
              approvedFriends={approvedFriends}
              userId={store.userDetails._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
