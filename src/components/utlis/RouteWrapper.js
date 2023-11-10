import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../../context/store";
import ResigterHomePage from "../register/ResigterHomePage";

const Blank = ({ type }) => {
  if (type === "homePage") {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  return <div></div>;
};

function RouteWrapper({
  component: Component,
  type,
  sendMessageToSocket,
  sendConnectionToSocket,
  sendTypingToSocket,
}) {
  const [loading, setLoading] = useState(true);
  const { store, dispatch } = useContext(storeContext);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }

    if (store.initialLogin) {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}users/token-check-no-data`,
          { token: localStorage.getItem("token") },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            setLoading(false);
          }
        })
        .catch((err) => {
          dispatch({ type: "logout" });
          setLoading(false);
          console.log(err);
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}users/token-check`,
          { token: localStorage.getItem("token") },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (res) => {
          if (res.data.status === "ok") {
            async function getFriends() {
              const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}messages/get-all-conversations/${res.data.userDetails._id}`
              );
              return response;
            }

            let messagesData = await getFriends();
            dispatch({
              type: "login",
              payload: {
                userDeatils: res.data.userDetails,
                friends: res.data.suggestedUsers,
                booksRecommendations: res.data.booksRecommendation,
                myPendingConnections: res.data.myPendingConnections,
                lastTenUsersRegistered: res.data.lastTenUsersRegistered,
                myConversations: messagesData.data.conversationsWithFriendData,
                numberOfUnSeenMessages:
                  messagesData.data.numberOfUnseenMessages,
              },
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          dispatch({ type: "logout" });
          setLoading(false);
          console.log(err.response);
        });
    }
  }, [dispatch, store.initialLogin]);

  if (loading) {
    return <Blank type={type} />;
  } else {
    if (!loading && store.isAuth) {
      if (sendMessageToSocket) {
        return (
          <Component
            sendMessageToSocket={sendMessageToSocket}
            sendTypingToSocket={sendTypingToSocket}
          />
        );
      } else if (sendConnectionToSocket) {
        return <Component sendConnectionToSocket={sendConnectionToSocket} />;
      } else {
        return <Component />;
      }
    }
    if (!loading && !store.isAuth) {
      return <ResigterHomePage />;
    }
  }
}

export default RouteWrapper;
