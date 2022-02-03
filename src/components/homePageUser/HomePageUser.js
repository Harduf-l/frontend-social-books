import React, { useContext, useState, useEffect } from "react";
import { storeContext } from "../../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import FeedPosts from "./FeedPosts";
import styles from "./HomePageUser.module.css";
import BookModal from "./bookModal";
import defaultPicture from "../../images/plain.jpg";
import FeedPostsSkeleton from "./FeedPostsSkeleton";
import FriendsList from "./FriendsList";

function HomePageUser() {
  const { t, i18n } = useTranslation();
  const currentDir = i18n.dir();
  const { dispatch, store } = useContext(storeContext);
  const [userContent, setUserContent] = useState("");
  const [userContentTag, setUserContentTag] = useState("");
  const [singleBookData, setSingleBookData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postError, setPostError] = useState(false);
  const [textAreaRows, setTextAreaRows] = useState(2);
  const [loadingFeedPost, setLoadingFeedPost] = useState(true);

  const { username } = store.userDetails;
  const { booksRecommendation } = store;
  const minRows = 2;
  const maxRows = 18;

  useEffect(() => {
    if (!store.quotes) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}general/daily-quote`)
        .then((res) => {
          dispatch({ type: "setDailyQuote", payload: res.data });
        });
    }
    if (store.feedPosts.length === 0) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}posts/get-all-posts`)
        .then((res) => {
          dispatch({ type: "setEntryPosts", payload: res.data });
          setLoadingFeedPost(false);
        })
        .catch((err) => {
          setLoadingFeedPost(false);
        });
    } else {
      setLoadingFeedPost(false);
    }
  }, [store.quotes, store.feedPosts.length, dispatch]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTextAreaChange = (event) => {
    const textareaLineHeight = 24;

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
    setTextAreaRows(() => (currentRows < maxRows ? currentRows : maxRows));
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
    dispatch({ type: "logout" });
  };

  const addPersonalPost = async () => {
    if (userContent.trim() && userContentTag) {
      setPostError(false);

      const newPost = {
        postWriter: store.userDetails._id,
        tag: userContentTag,
        postContent: userContent.trim(),
      };

      try {
        const newPostCreated = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}posts/add-post`,
          newPost
        );

        dispatch({
          type: "addPostToFeed",
          payload: { newPostCreated: newPostCreated.data },
        });
      } catch (err) {
        console.log(err);
      }
      setUserContent("");
      setUserContentTag("");
      setTextAreaRows(2);
    } else {
      // not throwing error for empty input. user should understand that alone.
      if (!userContentTag) {
        setPostError(true);
      }
    }
  };

  return (
    <div className="d-flex flex-wrap ">
      <BookModal
        open={open}
        handleClose={handleClose}
        chosenBookData={singleBookData}
        loading={loading}
      />
      <div
        className={`col-12 col-lg-2 align-self-stretch ${styles.sideBarHeight}`}
      >
        <div className="pt-3 pb-3 mt-3">
          <img
            src={
              store.userDetails.picture
                ? store.userDetails.picture
                : defaultPicture
            }
            alt=""
            className={styles.pictureHomePage}
          />
          <p className={styles.welcomeMessage}>
            {t("profile.welcome")}
            {username}
          </p>
        </div>

        <div className="mt-3" style={{ paddingInlineStart: 20 }}>
          <div style={{ fontWeight: 500 }}>{t("homepage.quote of day")}</div>
          <div
            style={{
              fontSize: 12,
              fontStyle: "italic",
              marginTop: 5,
              width: "90%",
            }}
          >
            "
            {store.quotes &&
              (currentDir === "rtl"
                ? store.quotes.hebrewQuote.line
                : store.quotes.englishQuote.line)}
            "
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              fontStyle: "italic",
              marginTop: 10,
              paddingInlineEnd: 35,
            }}
            className="d-flex justify-content-end pb-3"
          >
            {store.quotes &&
              (currentDir === "rtl" ? (
                <span>
                  {store.quotes.hebrewQuote.book}/
                  {store.quotes.hebrewQuote.author}
                </span>
              ) : (
                <span>
                  {store.quotes.englishQuote.book}/
                  {store.quotes.englishQuote.author}
                </span>
              ))}
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button onClick={logOutFunction} className="btn btn-light btn-sm m-4">
            {t("form.logout")}
          </button>
        </div>
      </div>

      <div
        className={`col-12 col-lg-7 mt-4 mb-4 ${styles.paddingEndMobile}`}
        style={{ paddingInlineStart: 20 }}
      >
        <div className="col-lg-11 col-12" style={{ margin: "0 auto" }}>
          <textarea
            rows={textAreaRows}
            value={userContent}
            placeholder={t("profile.share thought")}
            className={styles.textareaAutoExpand}
            onChange={handleTextAreaChange}
          />

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
          {loadingFeedPost && <FeedPostsSkeleton />}
          {!loadingFeedPost && store.feedPosts.length > 0 && (
            <FeedPosts
              postsToShow={store.feedPosts}
              userId={store.userDetails._id}
            />
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
