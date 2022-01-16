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
    setTimeout(() => {
      if (store.userSuggestedFriends) {
        const currentUserPage = store.userSuggestedFriends.find(
          (el) => el["_id"] === params.id
        );
        setCurrentUser(currentUserPage);
      } else {
        axios
          .get(
            `${process.env.REACT_APP_SERVER_URL}users/get-by-id/${params.id}`
          )
          .then((res) => {
            setCurrentUser(res.data.user);
          })
          .catch((err) => {
            if (err.response.data.message === "user not found") {
              navigate(`/`);
            }
          });
      }
    }, 500);
  }, [store, params.id]);

  return (
    <div className="container pt-5">
      {currentUserPage && (
        <div className="row">
          <div className="col-lg-3 col-12">
            <UserCard currentUserPage={currentUserPage} />
          </div>
          <div className="col-lg-9 col-12">
            <div style={{ backgroundColor: "#eeedec", height: "200px" }}>
              קצת עליי...
            </div>
            <div
              style={{
                backgroundColor: "#eeedec",
                height: "200px",
                marginTop: "25px",
              }}
            >
              ספרים שקראתי לאחרונה
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
