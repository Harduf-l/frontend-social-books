import React, { useContext, useState } from "react";
import { storeContext } from "../context/store";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePageUser() {
  const { t } = useTranslation();
  const { dispatch, store } = useContext(storeContext);
  const [searchedBook, setSearchedBook] = useState("");
  const { favoriteWriter, picture, username, genres, userAge } =
    store.userDetails;
  const [booksResults, setBooksResults] = useState("");
  const [loading, setLoading] = useState(false);

  const getBooks = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5005/books/get-book-list?search=${searchedBook}`)
      .then((res) => {
        setLoading(false);
        setBooksResults(res.data);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-3 p-3" style={{ backgroundColor: "#fff9f1" }}>
          <div className="text-center">
            <img
              style={{
                borderRadius: "30px",
                marginBottom: "15px",
                height: "170px",
                width: "170px",
                objectFit: "cover",
              }}
              src={`http://localhost:5005/${picture}`}
              alt=""
            />
          </div>
          <div>
            <span
              style={{
                marginInlineEnd: "5px",
                fontSize: "12px",
                fontStyle: "italic",
                color: "#920000",
              }}
            >
              {t("form.name")}
            </span>
            <p style={{ backgroundColor: "white" }}>{username}</p>
          </div>
          <div>
            <span
              style={{
                marginInlineEnd: "5px",
                fontSize: "12px",
                fontStyle: "italic",
                color: "#920000",
              }}
            >
              {t("form.favorite writer")}
            </span>
            <p style={{ backgroundColor: "white" }}>{favoriteWriter}</p>
          </div>
          {userAge && (
            <div>
              <span
                style={{
                  marginInlineEnd: "5px",
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "#920000",
                }}
              >
                גיל:
              </span>
              <p style={{ backgroundColor: "white" }}>{userAge}</p>
            </div>
          )}
          <div>
            <span
              style={{
                marginInlineEnd: "5px",
                fontSize: "12px",
                fontStyle: "italic",
                color: "#920000",
              }}
            >
              {t("genres.favorite")}
            </span>
            <br />
            <p style={{ backgroundColor: "white" }}>
              {genres.map((el, index) => {
                if (index === genres.length - 1) {
                  return <span key={el}> {t(`genres.${el}`)}. </span>;
                } else {
                  return <span key={el}> {t(`genres.${el}`)}, </span>;
                }
              })}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: "logout" })}
            className="btn btn-light mt-5"
            style={{ backgroundColor: "#999999", color: "white" }}
          >
            {t("form.logout")}
          </button>
        </div>

        <div className="col-7">
          <input
            type="text"
            id="bookSearch"
            value={searchedBook}
            onChange={(e) => setSearchedBook(e.target.value)}
          />
          <button
            onClick={getBooks}
            className="btn btn-secondary btn-sm mb-1 ms-1 me-1"
          >
            {t("profile.search")}
          </button>
          {loading && <div className="pt-4">ממתין לתוצאות...</div>}
          {!loading && booksResults.length > 0 && (
            <table className="mt-3">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#d3c6b4" }}>שם ספר</th>
                  <th style={{ backgroundColor: "#d3c6b4" }}>שם סופר/ת</th>
                </tr>
              </thead>
              <tbody>
                {booksResults.map((el, index) => {
                  return (
                    <tr key={index}>
                      <td>{el.title}</td>
                      <td>{el.author}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <p className="mt-4">{t("profile.share thought")}</p>
          <textarea
            style={{
              border: "2px brown solid",
              width: "95%",
              height: "100px",
            }}
          ></textarea>
        </div>

        <div className="col-2">
          <p
            style={{
              fontSize: "10px",
              backgroundColor: "#5b9979",
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
                    <div style={{ textAlign: "center" }}>
                      <Link to={`/user/${el._id}`}>
                        <img
                          style={{
                            borderRadius: "20px",
                            height: "100px",
                            width: "100px",
                            objectFit: "cover",
                          }}
                          src={`http://localhost:5005/${el.picture}`}
                          alt=""
                        />
                      </Link>
                    </div>
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
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageUser;
