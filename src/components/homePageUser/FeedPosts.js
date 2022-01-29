import React from "react";
import defaultPicture from "../../images/plain.jpg";
import styles from "./HomePageUser.module.css";
import { useTranslation } from "react-i18next";

function FeedPosts({ postsToShow }) {
  const { t } = useTranslation();
  const [editMap, setEditMap] = React.useState({});

  const changeEditMap = (postId) => {
    let newEditMap = { ...editMap };

    if (newEditMap[postId]) {
      delete newEditMap[postId];
    } else {
      newEditMap[postId] = true;
    }

    setEditMap(newEditMap);
  };
  const getOrganizedDate = (dateString) => {
    let DateCreated = new Date(dateString);

    let fullYear = DateCreated.getFullYear();
    let monthOfPost = DateCreated.getMonth() + 1;
    let dayInMonth = DateCreated.getDate();

    return (
      <p style={{ fontSize: 13 }}>
        {dayInMonth} {t(`months.month${monthOfPost}`)}, {fullYear}
      </p>
    );
  };
  return (
    <div className="mt-3">
      {postsToShow
        .slice(0)
        .reverse()
        .map((post, index) => {
          return (
            <div
              key={index}
              className="mt-4 p-2"
              style={{ backgroundColor: "#f8f8f8", borderRadius: 10 }}
            >
              {console.log(post)}
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <img
                    className={styles.postPic}
                    src={
                      post.writer.picture ? post.writer.picture : defaultPicture
                    }
                    alt=""
                  />
                  <div style={{ marginInlineStart: 10 }}>
                    {post.writer.username}
                  </div>
                </div>
                <div className="d-flex">
                  <p
                    style={{
                      marginInlineEnd: 20,
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    {t(`profile.${post.tag}`)}
                  </p>
                  {getOrganizedDate(post.createdAt)}
                </div>
              </div>
              <div className="pt-3 pb-2">{post.content}</div>
              <div
                className="d-flex pt-2"
                style={{ borderTop: "1px #c9c9c9 solid" }}
              >
                <button
                  className="btn btn-sm btn-light"
                  style={{ backgroundColor: "#cccccc" }}
                >
                  <i
                    style={{ color: "#c45252", marginInlineEnd: 7 }}
                    className="fas fa-heart"
                  ></i>
                  {t("like")}
                </button>

                <button
                  className="btn btn-sm btn-light"
                  onClick={() => changeEditMap(post._id)}
                  style={{ marginInlineStart: 10, backgroundColor: "#cccccc" }}
                >
                  <i
                    style={{ color: "#6f8ead", marginInlineEnd: 7 }}
                    className="fas fa-comment"
                  ></i>
                  {t("comment")}
                </button>
              </div>
              {editMap[post._id] && (
                <div className="mt-3">
                  <textarea className={styles.textAreaStyle2}></textarea>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-light"
                      style={{ backgroundColor: "#cccccc" }}
                    >
                      {t("form.send")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default FeedPosts;
