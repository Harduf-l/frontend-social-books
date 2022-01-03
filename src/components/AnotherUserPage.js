import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storeContext } from "../context/store";
import { useTranslation } from "react-i18next";

const UserCard = ({ currentUserPage }) => {
  const { t } = useTranslation();

  return (
    <div className="col-3 p-3" style={{ backgroundColor: "#fff9f1" }}>
      <div className="text-center">
        <img
          style={{
            borderRadius: "30px",
            marginBottom: "15px",
            height: "170px",
            width: "170px",
            objectFit: "cover",
          }}
          src={`http://localhost:5005/${currentUserPage.picture}`}
          alt=""
        />
      </div>
      <div>
        <span
          style={{
            marginInlineEnd: "5px",
            fontSize: "12px",
            fontStyle: "italic",
            color: "#920000",
          }}
        >
          {t("form.name")}
        </span>
        <p style={{ backgroundColor: "white" }}>{currentUserPage.username}</p>
      </div>
      <div>
        <span
          style={{
            marginInlineEnd: "5px",
            fontSize: "12px",
            fontStyle: "italic",
            color: "#920000",
          }}
        >
          {t("form.favorite writer")}
        </span>
        <p style={{ backgroundColor: "white" }}>
          {currentUserPage.favoriteWriter}
        </p>
      </div>
      <div>
        <span
          style={{
            marginInlineEnd: "5px",
            fontSize: "12px",
            fontStyle: "italic",
            color: "#920000",
          }}
        >
          {t("genres.favorite")}
        </span>
        <br />
        <p style={{ backgroundColor: "white" }}>
          {currentUserPage.genres.map((el, index) => {
            if (index === currentUserPage.genres.length - 1) {
              return <span key={el}> {t(`genres.${el}`)}. </span>;
            } else {
              return <span key={el}> {t(`genres.${el}`)}, </span>;
            }
          })}
        </p>
      </div>
    </div>
  );
};

function UserPage() {
  const { t } = useTranslation();
  let params = useParams();
  const { store } = useContext(storeContext);
  const [currentUserPage, setCurrentUser] = useState("");

  useEffect(() => {
    if (store.userSuggestedFriends) {
      const currentUserPage = store.userSuggestedFriends.find(
        (el) => el["_id"] === params.id
      );
      setCurrentUser(currentUserPage);
    }
  }, [store, params.id, currentUserPage]);

  return (
    <div className="container">
      {currentUserPage && (
        <div className="row">
          <UserCard currentUserPage={currentUserPage} />
          <div className="col-9">
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
