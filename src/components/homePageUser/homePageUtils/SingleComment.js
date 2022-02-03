import React from "react";
import defaultPicture from "../../../images/plain.jpg";
import styles from "../HomePageUser.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SingleComment = ({ el, index, arrayLength }) => {
  const { t } = useTranslation();
  return (
    <div className={`d-flex pt-3 pb-2 ${styles.comments}`}>
      <div>
        <Link to={`user/${el.commentResponder._id}`}>
          <img
            className={styles.postPic}
            src={
              el.commentResponder.picture
                ? el.commentResponder.picture
                : defaultPicture
            }
            alt=""
          />
        </Link>
      </div>

      <div style={{ marginInlineStart: 15 }}>
        <div className={styles.commentText}>
          <div style={{ fontWeight: 500 }}> {el.commentResponder.username}</div>
          <div> {el.commentContent}</div>
        </div>
        <div className="pt-2">
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
