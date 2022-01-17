import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storeContext } from "../../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserCard } from "./UserCard";

function UserPage() {
  let navigate = useNavigate();
  const { t } = useTranslation();
  let params = useParams();
  const { store } = useContext(storeContext);
  const [currentUserPage, setCurrentUser] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}users/get-by-id/${params.id}`)
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {
        if (err.response.data.message === "user not found") {
          navigate(`/`);
        }
      });
  }, [store, params.id, navigate]);

  const createNewMessageAndNavigate = async () => {
    let newConversation = {
      senderId: store.userDetails._id,
      receiverId: params.id,
    };

    try {
      const newConversationCreated = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}messages/new-conversation`,
        newConversation
      );
      navigate(`/messages/${newConversationCreated.data._id}/${params.id}`);
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <div className="container pt-5">
      {currentUserPage && (
        <div className="row">
          <div className="col-lg-3 col-md-6 col-12">
            <UserCard
              currentUserPage={currentUserPage}
              isItMe={false}
              createNewMessageAndNavigate={createNewMessageAndNavigate}
            />
          </div>
          <div className="col-lg-9 col-md-6 col-12 pt-4 pt-md-0">
            <div
              style={{
                backgroundColor: "#eeedec",
                padding: "5px 10px 10px 10px",
              }}
            >
              {currentUserPage.freeText && (
                <div>
                  <span
                    style={{
                      marginInlineEnd: "5px",
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: "#920000",
                    }}
                  >
                    {t("form.freeText")}
                  </span>
                  <p>{currentUserPage.freeText}</p>
                </div>
              )}

              {currentUserPage.writingDescription && (
                <div>
                  <span
                    style={{
                      marginInlineEnd: "5px",
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: "#920000",
                    }}
                  >
                    {t("form.writingDescription")}
                  </span>
                  <p>{currentUserPage.writingDescription}</p>
                </div>
              )}
            </div>
            <div className="row pt-3" style={{ height: 275 }}>
              <div className="col-12 col-md-6">
                <h5>ברשימת הקריאה שלי</h5>
                {true &&
                  currentUserPage.username +
                    " " +
                    t("profile.didnt add books to list")}
              </div>
              <div className="col-12 col-md-6">
                <h5>תגובות אחרונות שלי בקבוצות דיון</h5>
                {true && t("profile.didnt write comments")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
