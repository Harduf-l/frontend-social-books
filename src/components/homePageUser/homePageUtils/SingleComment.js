import React from "react";
import defaultPicture from "../../../images/plain.jpg";
import styles from "../HomePageUser.module.css";
import { useTranslation } from "react-i18next";

const SingleComment = ({ el, index, arrayLength }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`d-flex pt-3 pb-2 ${styles.comments}`}
      style={
        index !== arrayLength - 1 ? { borderBottom: "1px solid #cecece" } : {}
      }
    >
      <div>
        <img
          className={styles.postPic}
          src={el.user.picture ? el.user.picture : defaultPicture}
          alt=""
        />
      </div>

      <div style={{ paddingInlineStart: 15 }}>
        <div style={{ fontWeight: 500 }}> {el.user.name}</div>
        <div> {el.content}</div>
        <div className="pt-3">
          <span role="button" className={styles.miniBtnMiniComment}>
            <i
              style={{ color: "#c45252", marginInlineEnd: 4 }}
              className="fas fa-heart"
            ></i>
            {t("like")}
          </span>
          <span
            role="button"
            className={styles.miniBtnMiniComment}
            style={{
              marginInlineStart: 7,
            }}
          >
            <i
              style={{ color: "#6f8ead", marginInlineEnd: 2 }}
              className="fas fa-comment"
            ></i>
            {t("comment")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SingleComment;
