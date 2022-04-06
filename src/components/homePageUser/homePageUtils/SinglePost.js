import React, { useState, useContext } from "react";
import styles from "../HomePageUser.module.css";
import { useTranslation } from "react-i18next";
import SingleComment from "./SingleComment";
import defaultPicture from "../../../images/plain.jpg";
import axios from "axios";
import { storeContext } from "../../../context/store";
import { Link } from "react-router-dom";
import LikesModal from "./likesModal";
import reactStringReplace from "react-string-replace";
import EditPostModal from "../../modals/EditPostModal";
import RemovePostModal from "../../modals/RemovePostModal";
import { textAreaChange } from "../../utlis/utils";

function SinglePost({ post, index, userId, searchedWord }) {
  const { dispatch, store } = useContext(storeContext);
  const { t, i18n } = useTranslation();
  const currentDir = i18n.dir();
  const [commentMode, setCommentMode] = React.useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showCommentsMode, setShowCommentsMode] = React.useState(false);
  const [textAreaRows, setTextAreaRows] = useState(2);
  const [userContent, setUserContent] = useState("");
  const [loadingAddComment, setLoadingAddComment] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const [currentPostValue, setPostValue] = useState(post.postContent);

  const setShowComments = () => {
    setShowCommentsMode(true);
  };

  const hideLikesModal = () => {
    setShowLikesModal(false);
  };

  const GetMarkeredContent = ({ postContent }) => {
    let newString = reactStringReplace(
      postContent,
      searchedWord,
      (match, i) => (
        <span key={i} style={{ backgroundColor: "yellow" }}>
          {match}
        </span>
      )
    );

    return newString;
  };

  const likePost = async () => {
    dispatch({
      type: "addLikeToPost",
      payload: {
        postId: post._id,
        likeObject: {
          _id: store.userDetails._id,
          username: store.userDetails.username,
          picture: store.userDetails.picture,
        },
      },
    });
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}posts/add-post-like`,
        { userId, postId: post._id }
      );
    } catch (err) {
      console.log(err.response);
    }
  };

  const sendPostComment = async () => {
    if (!userContent.trim()) {
      return;
    }
    setLoadingAddComment(true);

    let newComment = {
      content: userContent,
      responderId: userId,
      postId: post._id,
    };
    try {
      const refreshedPost = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}posts/add-post-comment`,
        newComment
      );
      setLoadingAddComment(false);
      setCommentMode(false);
      setUserContent("");
      setTextAreaRows(2);

      dispatch({
        type: "replacePost",
        payload: { refreshedPost: refreshedPost.data, postId: post._id },
      });
    } catch (err) {
      setLoadingAddComment(false);
      setCommentMode(false);
      setUserContent("");
      setTextAreaRows(2);
      console.log(err);
    }
  };

  function setUserContentFunction(newContent) {
    setUserContent(newContent);
  }

  function setTextAreaRowsFunction(newRows) {
    setTextAreaRows(newRows);
  }

  const handleTextAreaChange = (event, postId) => {
    textAreaChange(
      event.target,
      2,
      6,
      setUserContentFunction,
      setTextAreaRowsFunction
    );
  };

  const oppositeCommentMode = () => {
    setCommentMode((prev) => !prev);
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

  const removelikePost = async () => {
    dispatch({
      type: "removeLikeFromPost",
      payload: { postId: post._id, userId: userId },
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}posts/remove-post-like`,
        { userId, postId: post._id }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfLikeExistReturnButtonAccordingly = () => {
    let option1 = (
      <button
        className="btn btn-sm btn-light"
        style={{ backgroundColor: "#cccccc" }}
        onClick={likePost}
      >
        <i
          style={{ color: "#c45252", marginInlineEnd: 7 }}
          className="far fa-heart"
        ></i>
        <span style={{ fontSize: 12 }}>{t("like")}</span>
      </button>
    );

    if (post.likes.length === 0) {
      return option1;
    }

    let result = post.likes.some((like) => {
      return like._id === userId;
    });

    if (result) {
      return (
        <button
          className="btn btn-sm btn-light"
          style={{ backgroundColor: "#cccccc" }}
          onClick={removelikePost}
        >
          <i
            style={{ color: "#c45252", marginInlineEnd: 7 }}
            className="fas fa-heart"
          ></i>
          <span style={{ fontSize: 12 }}>{t("alreadeLiked")}</span>
        </button>
      );
    } else {
      return option1;
    }
  };

  return (
    <div key={index} className={`mt-4 p-2 ${styles.post}`}>
      <LikesModal
        open={showLikesModal}
        handleClose={hideLikesModal}
        likesArray={post ? post.likes : []}
      />

      {showEditModal && (
        <EditPostModal
          open={showEditModal}
          handleClose={() => setShowEditModal(false)}
          postData={post}
        />
      )}

      <RemovePostModal
        open={showRemoveModal}
        handleClose={() => setShowRemoveModal(false)}
        postData={post}
      />
      <div className="d-flex justify-content-between">
        <div>
          <Link to={`/user/${post.postWriter._id}`}>
            <img
              className={styles.postPic}
              src={
                post.postWriter.picture
                  ? post.postWriter.picture
                  : defaultPicture
              }
              alt=""
            />
          </Link>
          <div
            style={{
              marginInlineStart: 10,
              fontSize: 13,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            {post.postWriter.username}
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
        dir="auto"
      >
        {searchedWord ? (
          <span>
            <GetMarkeredContent postContent={post.postContent} />
          </span>
        ) : (
          post.postContent
        )}
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div>
          {checkIfLikeExistReturnButtonAccordingly()}

          <button
            className="btn btn-sm btn-light"
            onClick={oppositeCommentMode}
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

        {post.postWriter._id === userId && (
          <div
            className={
              currentDir === "rtl" ? " btn-sm dropend" : " btn-sm dropstart"
            }
            style={{ padding: 0 }}
          >
            <button
              type="button"
              className="btn btn-light btn-sm"
              style={{
                backgroundColor: "#c4c4c4",
                color: "#636363",
              }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ...
            </button>
            <ul
              className="dropdown-menu"
              style={{ minWidth: "auto", fontSize: 13 }}
            >
              <li>
                <div
                  onClick={() => setShowEditModal(true)}
                  className="dropdown-item"
                  role={"button"}
                >
                  {t("homepage.edit")}
                </div>
              </li>
              <li>
                <div
                  className="dropdown-item"
                  role={"button"}
                  onClick={() => setShowRemoveModal(true)}
                >
                  {t("homepage.delete")}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
      {post.likes.length === 0 && <div className="pt-1 pb-1"></div>}
      {post.likes.length > 0 && (
        <div
          style={
            commentMode
              ? {
                  fontSize: 12,
                  color: "#0d0052",
                  paddingTop: 12,
                  paddingBottom: 5,
                }
              : {
                  fontSize: 12,
                  color: "#0d0052",
                  paddingTop: 12,
                  paddingBottom: 10,
                }
          }
        >
          <span role={"button"} onClick={() => setShowLikesModal(true)}>
            {post.likes.length}
            {t("homepage.people liked this post")}
          </span>
        </div>
      )}
      {commentMode && (
        <div className="mt-2">
          <textarea
            dir="auto"
            rows={textAreaRows ? textAreaRows : 2}
            value={userContent ? userContent : ""}
            onChange={(e) => handleTextAreaChange(e, post._id)}
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
              onClick={sendPostComment}
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
      {/* {!showCommentsMode && showCommentsPreview(post.comments)} */}

      {post.comments.length > 0 && (
        <div>
          {post.comments
            .slice(0)
            .reverse()
            .map((el, index) => {
              if (index <= 1 && !showCommentsMode) {
                return (
                  <SingleComment
                    key={el.createdAt}
                    el={el}
                    post={post}
                    index={index}
                    arrayLength={post.comments.length}
                  />
                );
              }
              if (showCommentsMode) {
                return (
                  <SingleComment
                    key={index}
                    el={el}
                    post={post}
                    index={index}
                    arrayLength={post.comments.length}
                  />
                );
              }
            })}
        </div>
      )}
      {!showCommentsMode && post.comments.length > 2 && (
        <div
          style={{
            marginTop: 20,

            paddingTop: 5,
            textAlign: "center",
            color: "#555555",
            fontSize: 12,
            borderTop: "1px #d8d8d8 solid",
          }}
          role="button"
          onClick={setShowComments}
        >
          {t("homepage.show")}
          {post.comments.length - 2}
          {t("homepage.more comments")}
        </div>
      )}
    </div>
  );
}

export default SinglePost;
