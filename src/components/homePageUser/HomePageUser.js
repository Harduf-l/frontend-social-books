import React, { useContext, useState } from "react";
import { storeContext } from "../../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePageUser() {
  const profileBackground = "#e07a5f";
  const barBackground = "#3d405b";
  const { t } = useTranslation();
  const { dispatch, store } = useContext(storeContext);
  const [searchedBook, setSearchedBook] = useState("");
  const { favoriteWriter, picture, username, genres, userAge } =
    store.userDetails;
  const [booksResults, setBooksResults] = useState("");
  const [loading, setLoading] = useState(false);
  const stringsArr = [
    "harduf",
    "hamutal",
    "ronen",
    "programming",
    "ami",
    "jonas",
  ];

  const coloredParagraph = (string, index) => {
    let newArr = string.split("m");
    return (
      <p key={index}>
        {newArr[0]}
        <span style={{ backgroundColor: "yellow" }}>m</span>
        {newArr[1]}
      </p>
    );
  };

  const getBooks = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}books/get-book-list?search=${searchedBook}`
      )
      .then((res) => {
        setLoading(false);
        setBooksResults(res.data);
      });
  };

  return (
    <div className="d-flex">
      <div
        className="col-12 col-lg-3 col-md-6"
        style={{ backgroundColor: profileBackground }}
      >
        <p>
          {t("profile.welcome")}
          {username}
        </p>
        <button
          onClick={() => dispatch({ type: "logout" })}
          className="btn btn-light mt-5"
          style={{ backgroundColor: "#999999", color: "white" }}
        >
          {t("form.logout")}
        </button>
      </div>

      <div className="col-12 col-lg-7 col-md-6">
        <p className="mt-4">{t("profile.share thought")}</p>
        <textarea className="text-area-style"></textarea>

        {stringsArr.map((string, index) => {
          if (string.indexOf("m") !== -1) {
            return coloredParagraph(string, index);
          } else {
            return <p key={index}>{string}</p>;
          }
        })}
      </div>

      <div
        className="col-12 col-lg-2 col-md-6"
        style={{ backgroundColor: barBackground }}
      >
        <p
          style={{
            fontSize: "10px",
            backgroundColor: barBackground,
            color: "white",
            padding: "5px",
            borderRadius: "15px",
          }}
        >
          {t("profile.book lovers")}
        </p>
        <div>
          {store.userSuggestedFriends &&
            store.userSuggestedFriends.map((el, index) => {
              return (
                <div key={index}>
                  <div style={{ textAlign: "center", color: "white" }}>
                    <Link to={`/user/${el._id}`}>
                      <img
                        style={{
                          borderRadius: "20px",
                          height: "100px",
                          width: "100px",
                          objectFit: "cover",
                        }}
                        src={`${process.env.REACT_APP_SERVER_URL}${el.picture}`}
                        alt=""
                      />
                    </Link>
                  </div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      marginTop: "6px",
                      color: "white",
                    }}
                  >
                    {el.username}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default HomePageUser;
