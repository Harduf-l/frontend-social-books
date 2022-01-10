import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../context/store";
import ResigterHomePage from "./ResigterHomePage";

const Blank = () => {
  return <div></div>;
};

function RouteWrapper({ component: Component }) {
  const [loading, setLoading] = useState(true);
  const { store, dispatch } = useContext(storeContext);

  useEffect(() => {
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
          dispatch({
            type: "login",
            payload: {
              userDeatils: res.data.userDetails,
              friends: res.data.suggestedUsers,
            },
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [dispatch]);

  if (loading) {
    return <Blank />;
  }
  if (!loading && store.isAuth) {
    return <Component />;
  }
  if (!loading && !store.isAuth) {
    return <ResigterHomePage />;
  }
}

export default RouteWrapper;
