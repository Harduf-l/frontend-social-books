import React, { useState, useContext } from "react";
import defaultPicture from "../../../images/plain.jpg";
import styles from "../HomePageUser.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { storeContext } from "../../../context/store";

const SingleComment = ({ el, index, arrayLength, post, stopReucurstion }) => {
  const [loadingAddComment, setLoadingAddComment] = useState(false);
  const [textAreaRows, setTextAreaRows] = useState(2);
  const [userContent, setUserContent] = useState("");
  const [editMode, setEditMode] = React.useState(false);
  const { t, i18n } = useTranslation();
  const { dispatch, store } = useContext(storeContext);
  const [showMiniComments, setShowMiniComments] = useState(false);

  const currentDir = i18n.dir();
  const minRows = 2;
  const maxRows = 6;

  const handleTextAreaChange = (event) => {
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

    setUserContent(event.target.value);

    let newTextAreaRows = currentRows < maxRows ? currentRows : maxRows;
    setTextAreaRows(newTextAreaRows);
  };

  const sendMiniPostComment = async () => {
    if (!userContent.trim()) {
      return;
    }
    setLoadingAddComment(true);

    console.log("post is", post);
    let newMiniComment = {
      content: userContent,
      responderId: store.userDetails._id,
      postId: post._id,
      commentId: el._id,
    };
    try {
      const refreshedPostWithMiniComment = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}posts/add-post-comment`,
        newMiniComment
      );
      setLoadingAddComment(false);
      setEditMode(false);
      setUserContent("");
      setTextAreaRows(2);
      console.log(refreshedPostWithMiniComment);

      dispatch({
        type: "replacePost",
        payload: {
          postId: post._id,
          refreshedPost: refreshedPostWithMiniComment.data,
        },
      });
      setShowMiniComments(true);
    } catch (err) {
      setLoadingAddComment(false);
      setEditMode(false);
      setUserContent("");
      setTextAreaRows(2);
      console.log(err);
    }
  };

  const calculateStyle = () => {
    if (!stopReucurstion) {
      // it means we are on the big comments section

      if (index === arrayLength - 1) {
        return { paddingTop: 10, paddingBottom: 5 };
      } else {
        if (showMiniComments) {
          return { paddingTop: 10, paddingBottom: 6 };
        } else {
          return { paddingTop: 10, paddingBottom: 0 };
        }
      }
    } else {
      if (index !== 0) {
        return { paddingTop: 15, marginInlineStart: 5 };
      } else {
        return { marginInlineStart: 5 };
      }
    }
  };

  return (
    <div style={calculateStyle()}>
      <div className={`d-flex ${styles.comments}`}>
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
            <div className="d-flex justify-content-between">
              <div style={{ fontWeight: 500 }}>
                {" "}
                {el.commentResponder.username}
              </div>
              <div
                className={styles.timeAgoComment}
                style={
                  currentDir === "ltr"
                    ? { marginInlineStart: 15 }
                    : { marginInlineEnd: 15 }
                }
              >
                {el.createdAt && format(el.createdAt)}
              </div>
            </div>

            <div> {el.commentContent}</div>
          </div>
          {!stopReucurstion && (
            <div
              className="pt-2 d-flex align-items-center"
              style={showMiniComments && !editMode ? { paddingBottom: 15 } : {}}
            >
              <div
                role="button"
                className={styles.miniBtnMiniComment}
                style={{
                  marginInlineStart: 7,
                }}
                onClick={() => setEditMode((prev) => !prev)}
              >
                <i
                  style={{ color: "#6f8ead", marginInlineEnd: 2 }}
                  className="fas fa-comment"
                ></i>
                {t("comment")}
              </div>
              {el.miniComments.length > 0 && (
                <div
                  role={"button"}
                  onClick={() => setShowMiniComments((prev) => !prev)}
                  className={styles.showMiniComments}
                >
                  {" "}
                  {showMiniComments ? t("homepage.hide") : t("homepage.show")}
                  {el.miniComments.length}
                  {t("homepage.comments")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginInlineStart: "65px" }}>
        {editMode && (
          <div
            className="mt-2 pb-2 pb-sm-0"
            style={{ width: "90%", marginInlineStart: 5 }}
          >
            <textarea
              rows={textAreaRows ? textAreaRows : 2}
              value={userContent ? userContent : ""}
              onChange={(e) => handleTextAreaChange(e)}
              className={styles.textareaAutoExpand}
              id={styles.commentAreaFixes}
            ></textarea>
            <div className="d-flex justify-content-end">
              <button
                className={
                  loadingAddComment
                    ? "btn btn-sm btn-light disabled"
                    : "btn btn-sm btn-light "
                }
                style={{ backgroundColor: "#cccccc" }}
                onClick={sendMiniPostComment}
              >
                {loadingAddComment && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginInlineEnd: 10 }}
                  ></span>
                )}
                {t("form.send")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.marginStart}>
        {el.miniComments &&
          !stopReucurstion &&
          showMiniComments &&
          el.miniComments.length > 0 &&
          el.miniComments.map((el, index) => {
            return (
              <SingleComment
                key={index}
                post={post}
                el={el}
                arrayLength={el.miniComments ? el.miniComments.length : 0}
                index={index}
                stopReucurstion={true}
              />
            );
          })}
      </div>
    </div>
  );
};

export default SingleComment;
