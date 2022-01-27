import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import bookImage from "../../images/bookHome.jpg";
import { Link } from "react-router-dom";
import { checkIfInputIsHebrew } from "../utlis/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeContext } from "../../context/store";
import LanguageSwitcher from "../layout/LanguageSwitcher";

function ResigterHomePage() {
  const { t, i18n } = useTranslation();
  let navigate = useNavigate();

  const currentDir = i18n.dir();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const { dispatch } = useContext(storeContext);

  const passWordSetAndCheck = (event) => {
    setLoginError("");
    if (event.target.value[0]) {
      if (checkIfInputIsHebrew(event.target.value[0])) {
        setPasswordError(true);
      } else {
        setPasswordError(null);
      }
    }

    setPassword(event.target.value);
  };

  const wakeUpServer = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}users/wake-up`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}users/login`,
        { password, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "error") {
        console.log(response.data.error);
        setLoginError("login error");
      } else if (response.data.status === "ok") {
        localStorage.setItem("token", response.data.token);

        const messagesData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}messages/get-all-conversations/${response.data.userDetails._id}`
        );
        dispatch({
          type: "login",
          payload: {
            userDeatils: response.data.userDetails,
            friends: response.data.suggestedUsers,
            booksRecommendations: response.data.recommendationBookArray,
            myPendingConnections: response.data.myPendingConnections,
            myConversations: messagesData.data.conversationsWithFriendData,
            numberOfUnSeenMessages: messagesData.data.numberOfUnseenMessages,
          },
        });
        navigate(`/`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //// if user is not logged in, show this
  // if logged in, redirect to his personal page
  return (
    <div>
      <LanguageSwitcher />
      <div className="container">
        <div className="row" style={{ height: "450px" }}>
          <div className=" col-s-12 col-md-6 pb-3 align-self-center ">
            <p
              style={{
                fontSize: "50px",
                fontWeight: "lighter",
                paddingInlineStart: "20px",
              }}
            >
              {t("welcome")}
            </p>

            <div className="pt-4 text-center">
              <form>
                <input
                  dir="ltr"
                  style={{
                    textAlign: currentDir === "rtl" ? "end" : "start",
                    padding: "4px",
                  }}
                  className="m-1 col-11"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError("");
                  }}
                  placeholder={t("form.email")}
                  onFocus={wakeUpServer}
                ></input>
                <input
                  dir="ltr"
                  style={{
                    textAlign: currentDir === "rtl" ? "end" : "start",
                    padding: "4px",
                  }}
                  className="m-1 col-11"
                  type="password"
                  placeholder={t("form.password")}
                  onChange={passWordSetAndCheck}
                  value={password}
                  autoComplete="on"
                ></input>
                <small
                  style={{
                    height: "20px",
                    display: "block",
                    marginTop: "5px",
                    color: "red",
                    fontSize: "12px",
                    textAlign: "start",
                    paddingInlineStart: "24px",
                  }}
                >
                  {passwordError && t("form.password hebrew error")}
                  {loginError && t(`form.${loginError}`)}
                </small>
                <input
                  className="btn btn-light btn-sm mt-2 col-11 p-2"
                  type="submit"
                  onClick={handleLogin}
                  value={t("form.login")}
                />
              </form>
              <Link to="/register">
                <input
                  className="btn btn-dark btn-sm mt-2 col-11 p-2"
                  type="submit"
                  value={t("form.register")}
                />
              </Link>
            </div>
          </div>
          <div className="col-s-12 col-md-6 padding-top-homePage">
            <img className="responsive-image" src={bookImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResigterHomePage;
