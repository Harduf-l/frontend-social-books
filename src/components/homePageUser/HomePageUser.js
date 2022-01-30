import React, { useContext, useState } from "react";
import { storeContext } from "../../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import FeedPosts from "./FeedPosts";
import styles from "./HomePageUser.module.css";
import BookModal from "./bookModal";

import FriendsList from "./FriendsList";

function HomePageUser() {
  const { t } = useTranslation();
  const { dispatch, store } = useContext(storeContext);
  const [userContent, setUserContent] = useState("");
  const [userContentTag, setUserContentTag] = useState("");
  const [singleBookData, setSingleBookData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postError, setPostError] = useState(false);
  const { username } = store.userDetails;
  const { booksRecommendation } = store;

  const handleClose = () => {
    setOpen(false);
  };

  const chooseTextTag = (e) => {
    setUserContentTag(e.target.value);
    if (!e.target.value) {
      setPostError(true);
    } else {
      setPostError(false);
    }
  };

  const getSingleBookData = async (book) => {
    setSingleBookData([]);
    setLoading(true);
    setOpen(true);

    const bookData = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}books/get-single-book-data?bookId=${book.bookId}`
    );
    setSingleBookData({ ...book, ...bookData.data });
    setLoading(false);
  };

  const logOutFunction = () => {
    console.log("here at logout");
    dispatch({ type: "logout" });
  };

  const addPersonalPost = () => {
    if (userContent.trim() && userContentTag) {
      setPostError(false);
      console.log(userContent);

      const newPost = {
        _id: Math.random(),
        writer: {
          id: store.userDetails._id,
          picture: store.userDetails.picture,
          username: store.userDetails.username,
        },
        likes: [1, 2, 3, 4],
        comments: [
          {
            user: { name: "jed", picture: "", _id: "" },
            content: "התגובה שלי!",
          },
          {
            user: { name: "beni", picture: "", _id: "" },
            content: "תגובה שניה",
          },
          {
            user: { name: "noa levi", picture: "", _id: "" },
            content: "הכל בסדר אחי?",
          },
          {
            user: { name: "חמוטל", picture: "", _id: "" },
            content: "התגובה המגניבה שלי!",
          },
          {
            user: { name: "jed", picture: "", _id: "" },
            content: "תגובה אחרונה ח!",
          },
        ],
        tag: userContentTag,
        content: userContent,
        createdAt: Date.now(),
      };

      setUserContent("");
      setUserContentTag("");

      dispatch({ type: "addPostToFeed", payload: { newPost } });
    } else {
      // not throwing error for empty input. user should understand that alone.
      if (!userContentTag) {
        setPostError(true);
      }
    }
  };

  return (
    <div className="d-flex flex-wrap  ">
      <BookModal
        open={open}
        handleClose={handleClose}
        chosenBookData={singleBookData}
        loading={loading}
      />
      <div
        className={`col-12 col-lg-2 align-self-stretch ${styles.sideBarHeight}`}
      >
        <p className={styles.welcomeMessage}>
          {t("profile.welcome")}
          {username}
        </p>

        <button onClick={logOutFunction} className="btn btn-light m-4">
          {t("form.logout")}
        </button>
      </div>

      <div
        className={`col-12 col-lg-7 mt-4 mb-4 ${styles.paddingEndMobile}`}
        style={{ paddingInlineStart: 20 }}
      >
        <div className="col-lg-11 col-12" style={{ margin: "0 auto" }}>
          <textarea
            maxLength="5000"
            placeholder={t("profile.share thought")}
            className={
              userContent ? styles.textAreaWithContent : styles.textAreaStyle
            }
            value={userContent}
            onChange={(e) => setUserContent(e.target.value)}
          ></textarea>
          <div
            className={
              userContent ? styles.editDiv : `${styles.editDiv} d-none`
            }
          >
            <div className="d-flex">
              <div>
                <select
                  className="form-select"
                  onChange={chooseTextTag}
                  value={userContentTag}
                  aria-label="Choose post category"
                >
                  <option value="">{t("profile.chooseTag")}</option>
                  <option value="thought after reading">
                    {t("profile.thought after reading")}
                  </option>
                  <option value="general thought">
                    {t("profile.general thought")}
                  </option>
                  <option value="recommendation">
                    {t("profile.recommendation")}
                  </option>
                  <option value="looking for a book">
                    {t("profile.looking for a book")}
                  </option>
                  <option value="selling a book">
                    {t("profile.selling a book")}
                  </option>
                  <option value="other">{t("profile.other")}</option>
                </select>
              </div>
              {postError && (
                <div className="m-2" style={{ fontSize: 12, color: "brown" }}>
                  יש לבחור תגית
                </div>
              )}
            </div>

            <div>
              <button onClick={addPersonalPost} className="btn btn-light">
                {t("form.send")}
              </button>
            </div>
          </div>
          {store.feedPosts.length > 0 && (
            <FeedPosts postsToShow={store.feedPosts} />
          )}
        </div>
      </div>
      <div
        className="col-12 col-lg-3 pt-3 pb-3"
        style={{ paddingInlineStart: 30, paddingInlineEnd: 30 }}
      >
        <div className={styles.miniHeadingItalic}>
          {t("profile.books you may like")}...
          <div style={{ height: 10 }}></div>
          {booksRecommendation &&
            booksRecommendation.map((book, index) => {
              return (
                <div
                  onClick={() => getSingleBookData(book)}
                  role={"button"}
                  className={styles.bookItemRecommendation}
                  key={index}
                >
                  {book.title}/{book.author}
                </div>
              );
            })}
        </div>
        <div className="pt-3">
          <p className={styles.miniHeadingItalic}>
            {t("profile.book lovers")}...
          </p>
          <FriendsList
            userFriends={store.userSuggestedFriends}
            userId={store.userDetails._id}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePageUser;
