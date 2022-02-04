import React, { useState, useContext } from "react";
import defaultPicture from "../../../images/plain.jpg";
import styles from "../HomePageUser.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { storeContext } from "../../../context/store";

const SingleComment = ({
  el,
  index,
  arrayLength,
  post,
  userId,
  stopReucurstion,
}) => {
  const [loadingAddComment, setLoadingAddComment] = useState(false);
  const [textAreaRows, setTextAreaRows] = useState(2);
  const [userContent, setUserContent] = useState("");
  const [editMode, setEditMode] = React.useState(false);
  const { t } = useTranslation();
  const { dispatch, store } = useContext(storeContext);
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

    let newMiniComment = {
      content: userContent,
      responderId: userId,
      postId: post._id,
      commentId: el._id,
    };
    try {
      const refreshedPostWithMiniComment = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}posts/add-mini-post-comment`,
        newMiniComment
      );
      setLoadingAddComment(false);
      setEditMode(false);
      setUserContent("");
      setTextAreaRows(2);

      dispatch({
        type: "replacePostWithNewMiniComment",
        payload: {
          refreshedPostWithMiniComment: refreshedPostWithMiniComment.data,
          postId: post._id,
        },
      });
    } catch (err) {
      setLoadingAddComment(false);
      setEditMode(false);
      setUserContent("");
      setTextAreaRows(2);
      console.log(err);
    }
  };

  return (
    <div>
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
            <div className="d-flex justify-content-between">
              <div style={{ fontWeight: 500 }}>
                {" "}
                {el.commentResponder.username}
              </div>
              <div className={styles.timeAgoComment}>
                {el.createdAt && format(el.createdAt)}
              </div>
            </div>

            <div> {el.commentContent}</div>
          </div>
          {!stopReucurstion && (
            <div className="pt-2">
              <span role="button" className={styles.miniBtnMiniComment}>
                <i
                  style={{ color: "#c45252", marginInlineEnd: 4 }}
                  className="far fa-heart"
                ></i>
                {t("like")}
              </span>

              <span
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
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginInlineStart: "65px" }}>
        {editMode && (
          <div className="mt-3">
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

      <div style={{ marginInlineStart: "65px" }}>
        {el.miniComments &&
          !stopReucurstion &&
          el.miniComments.length > 0 &&
          el.miniComments.map((el) => {
            return (
              <SingleComment
                key={index}
                el={el}
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
