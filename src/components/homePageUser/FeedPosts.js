import React, { useState } from "react";
import defaultPicture from "../../images/plain.jpg";
import styles from "./HomePageUser.module.css";
import { useTranslation } from "react-i18next";
import SingleComment from "./homePageUtils/SingleComment";

function FeedPosts({ postsToShow, userId }) {
  const { t, i18n } = useTranslation();
  const currentDir = i18n.dir();
  const [editMap, setEditMap] = React.useState({});
  const [showCommentsMap, setShowCommentsMap] = React.useState({});
  const [textAreaRows, setTextAreaRows] = useState({});
  const [userContent, setUserContent] = useState({});
  const minRows = 2;
  const maxRows = 6;

  const handleTextAreaChange = (event, postId) => {
    const textareaLineHeight = 20;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }
    let newUserContent = { ...userContent };
    newUserContent[postId] = event.target.value;
    setUserContent(newUserContent);
    let newTextAreaRows = { ...textAreaRows };
    newTextAreaRows[postId] = currentRows < maxRows ? currentRows : maxRows;
    setTextAreaRows(newTextAreaRows);
  };

  const setShowFullCommentsMap = (postId) => {
    let newShowCommentsMap = { ...showCommentsMap };

    if (newShowCommentsMap[postId]) {
      delete newShowCommentsMap[postId];
    } else {
      newShowCommentsMap[postId] = true;
    }

    setShowCommentsMap(newShowCommentsMap);
  };

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
      <span style={{ fontSize: 13, marginInlineStart: 20 }}>
        {dayInMonth} {t(`months.month${monthOfPost}`)}, {fullYear}
      </span>
    );
  };

  const showCommentsPreview = (commentsRaw) => {
    let commentsArray = [...commentsRaw];
    commentsArray = commentsArray.splice(0, 2);
    return (
      <div>
        {commentsArray.map((el, index) => {
          return (
            <SingleComment
              key={index}
              el={el}
              index={index}
              arrayLength={commentsArray.length}
            />
          );
        })}
      </div>
    );
  };
  return (
    <div className="mt-3">
      {postsToShow
        .slice(0)
        .reverse()
        .map((post, index) => {
          return (
            <div key={index} className={`mt-4 p-2 ${styles.post}`}>
              <div className="d-flex justify-content-between">
                <div>
                  <img
                    className={styles.postPic}
                    src={
                      post.writer.picture ? post.writer.picture : defaultPicture
                    }
                    alt=""
                  />
                  <div
                    style={{
                      marginInlineStart: 10,
                      fontSize: 13,
                      fontStyle: "italic",
                      fontWeight: 500,
                    }}
                  >
                    {post.writer.username}
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-end">
                  <div className={styles.tag}>{t(`profile.${post.tag}`)}</div>
                  <div> {getOrganizedDate(post.createdAt)}</div>
                </div>
              </div>

              <div
                style={{ fontSize: 13 }}
                className={`pt-3 pb-4 ${styles.bottomSeperator}`}
              >
                {post.content}
              </div>

              <div className="d-flex justify-content-between mt-3">
                <div>
                  <button
                    className="btn btn-sm btn-light"
                    style={{ backgroundColor: "#cccccc" }}
                  >
                    <i
                      style={{ color: "#c45252", marginInlineEnd: 7 }}
                      className="fas fa-heart"
                    ></i>
                    <span style={{ fontSize: 12 }}>{t("like")}</span>
                  </button>

                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => changeEditMap(post._id)}
                    style={{
                      marginInlineStart: 10,
                      backgroundColor: "#cccccc",
                    }}
                  >
                    <i
                      style={{ color: "#6f8ead", marginInlineEnd: 7 }}
                      className="fas fa-comment"
                    ></i>
                    <span style={{ fontSize: 12 }}>{t("comment")}</span>
                  </button>
                </div>

                {post.writer._id === userId && (
                  <div
                    className={
                      currentDir === "rtl"
                        ? " btn-sm dropend"
                        : " btn-sm dropstart"
                    }
                    style={{ padding: 0 }}
                  >
                    <button
                      type="button"
                      className="btn btn-light btn-sm dropdown-toggle"
                      style={{ backgroundColor: "#c4c4c4", color: "#636363" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></button>
                    <ul
                      className="dropdown-menu"
                      style={{ minWidth: "auto", fontSize: 13 }}
                    >
                      <li>
                        <div className="dropdown-item" href="#">
                          {t("homepage.edit")}
                        </div>
                      </li>
                      <li>
                        <div className="dropdown-item" href="#">
                          {t("homepage.delete")}
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {post.likes.length > 0 && (
                <div
                  role={"button"}
                  style={{ fontSize: 12, color: "#0d0052", paddingTop: 7 }}
                >
                  {post.likes.length}
                  {t("homepage.people liked this post")}
                </div>
              )}
              {editMap[post._id] && (
                <div className="mt-3">
                  <textarea
                    rows={textAreaRows[post._id] ? textAreaRows[post._id] : 3}
                    value={userContent[post._id] ? userContent[post._id] : ""}
                    onChange={(e) => handleTextAreaChange(e, post._id)}
                    className={styles.textareaAutoExpand}
                    id={styles.commentAreaFixes}
                  ></textarea>
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
              {!showCommentsMap[post._id] && showCommentsPreview(post.comments)}
              {!showCommentsMap[post._id] && post.comments.length > 2 && (
                <div
                  style={{
                    paddingTop: 5,
                    textAlign: "center",
                    fontSize: 12,
                  }}
                  role="button"
                  onClick={() => setShowFullCommentsMap(post._id)}
                >
                  {t("homepage.show")}
                  {post.comments.length - 2}
                  {t("homepage.more comments")}
                </div>
              )}
              {post.comments.length > 0 && showCommentsMap[post._id] && (
                <div>
                  {post.comments.map((el, index) => {
                    return (
                      <SingleComment
                        key={index}
                        el={el}
                        index={index}
                        arrayLength={post.comments.length}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default FeedPosts;
