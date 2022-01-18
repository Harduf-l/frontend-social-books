import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../../context/store";
import ResigterHomePage from "../register/ResigterHomePage";

const Blank = () => {
  return <div></div>;
};

function RouteWrapper({ component: Component, type }) {
  const [loading, setLoading] = useState(true);
  const { store, dispatch } = useContext(storeContext);

  useEffect(() => {
    if (store.registeredNow) return;

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
        .then((res) => {
          if (res.data.status === "ok") {
            console.log("here in app", res.data);
            dispatch({
              type: "login",
              payload: {
                userDeatils: res.data.userDetails,
                friends: res.data.suggestedUsers,
                booksRecommendations: res.data.recommendationBookArray,
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
  }, [dispatch, store.registeredNow, store.initialLogin]);

  if (store.registeredNow) {
    return <Component />;
  }

  if (loading) {
    return <Blank />;
  } else {
    if (!loading && store.isAuth) {
      return <Component />;
    }
    if (!loading && !store.isAuth) {
      return <ResigterHomePage />;
    }
  }
}

export default RouteWrapper;
