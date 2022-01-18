import React, { useContext, useState } from "react";
import { storeContext } from "../../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./HomePageUser.module.css";
import BookModal from "./bookModal";
import defaultPicture from "../../images/plain.jpg";
import { useNavigate } from "react-router-dom";

function HomePageUser() {
  let navigate = useNavigate();
  const profileBackground = "#c2ccc4";
  const { t } = useTranslation();
  const { dispatch, store } = useContext(storeContext);
  const [userContent, setUserContent] = useState("");
  const [singleBookData, setSingleBookData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { username } = store.userDetails;
  const { booksRecommendation } = store;

  const handleClose = () => {
    setOpen(false);
  };

  const chooseTextTag = (e) => {
    console.log(e.target.value);
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
  return (
    <div className="d-flex flex-wrap">
      <BookModal
        open={open}
        handleClose={handleClose}
        chosenBookData={singleBookData}
        loading={loading}
      />
      <div
        className="col-12 col-lg-2"
        style={{ backgroundColor: profileBackground }}
      >
        <p className={styles.welcomeMessage}>
          {t("profile.welcome")}
          {username}
        </p>

        <button
          onClick={() => dispatch({ type: "logout" })}
          className="btn btn-light m-4"
        >
          {t("form.logout")}
        </button>
      </div>

      <div className="col-12 col-lg-7 mt-4" style={{ paddingInlineStart: 30 }}>
        <textarea
          placeholder={t("profile.share thought")}
          className={
            userContent ? styles.textAreaWithContent : styles.textAreaStyle
          }
          value={userContent}
          onChange={(e) => setUserContent(e.target.value)}
        ></textarea>
        <div
          className={userContent ? styles.editDiv : `${styles.editDiv} d-none`}
        >
          <div>
            <select
              className="form-select"
              onChange={chooseTextTag}
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
          <div>
            <button className="btn btn-light">{t("form.send")}</button>
          </div>
        </div>

        <div>
          <p className={styles.miniHeadingItalic}>
            {t("profile.book lovers")}...
          </p>
          <div className="d-flex flex-wrap">
            {store.userSuggestedFriends &&
              store.userSuggestedFriends.map((el, index) => {
                return (
                  <div key={index}>
                    <div
                      style={{
                        textAlign: "center",
                        color: "#251703",
                        backgroundColor: "#f3f3f3",
                        margin: 5,
                        borderRadius: 10,
                        border: "1px dotted #d3c6b4",
                      }}
                    >
                      <img
                        onClick={() => navigate(`/user/${el._id}`)}
                        role={"button"}
                        style={{
                          borderRadius: "20px",
                          height: "80px",
                          width: "80px",
                          objectFit: "cover",
                          padding: 5,
                        }}
                        src={el.picture ? el.picture : defaultPicture}
                        alt=""
                      />

                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "12px",
                          marginTop: "6px",
                        }}
                      >
                        {el.username}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="col-12 col-lg-3 pt-3"
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
      </div>
    </div>
  );
}

export default HomePageUser;
