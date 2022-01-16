import { useTranslation } from "react-i18next";
import react from "react";
import styles from "./profilePage.module.css";
import { calculateAge } from "../utlis/utils";

export const UserCard = ({ currentUserPage, editOption }) => {
  const { t } = useTranslation();
  const [userAge, setuserAge] = react.useState(null);

  react.useEffect(() => {
    if (currentUserPage.birthday) {
      setuserAge(calculateAge(JSON.parse(currentUserPage.birthday)));
    }
  }, [currentUserPage]);

  return (
    <div style={{ backgroundColor: "#fff9f1", position: "relative" }}>
      <div className="text-center">
        <img
          style={{
            borderRadius: "30px",
            marginBottom: "15px",
            height: "170px",
            width: "170px",
            objectFit: "cover",
          }}
          src={`${process.env.REACT_APP_SERVER_URL}${currentUserPage.picture}`}
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
      {userAge && (
        <div>
          <span
            style={{
              marginInlineEnd: "5px",
              fontSize: "12px",
              fontStyle: "italic",
              color: "#920000",
            }}
          >
            {t("form.age")}
          </span>
          <p style={{ backgroundColor: "white" }}>{userAge}</p>
        </div>
      )}

      {currentUserPage.city && (
        <div>
          <span
            style={{
              marginInlineEnd: "5px",
              fontSize: "12px",
              fontStyle: "italic",
              color: "#920000",
            }}
          >
            {t("form.city")}
          </span>
          <p style={{ backgroundColor: "white" }}>{currentUserPage.city}</p>
        </div>
      )}

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
          <p style={{ backgroundColor: "white" }}>{currentUserPage.freeText}</p>
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
          <p style={{ backgroundColor: "white" }}>
            {currentUserPage.writingDescription}
          </p>
        </div>
      )}

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
