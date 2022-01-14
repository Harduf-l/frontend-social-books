import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import bookDefault from "../../images/book-default.jpg";
import { useTranslation } from "react-i18next";

function BookSearch() {
  const [searchParams] = useSearchParams();
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chosenBookData, setChosenBookData] = useState({});
  const [singleBookLoading, setSingleBookLoading] = useState(false);
  const { t } = useTranslation();

  const openModalWithDetails = (book) => {
    const { bookId } = book;
    setSingleBookLoading(true);
    axios
      .get(`http://localhost:5005/books/get-single-book-data?bookId=${bookId}`)
      .then((res) => {
        console.log(res.data);

        setChosenBookData({ ...book, ...res.data });
        setSingleBookLoading(false);
      })
      .catch((err) => {
        setSingleBookLoading(false);
        console.log(err.response);
      });
  };

  useEffect(() => {
    setLoading(true);
    const wordSearched = searchParams.get("search");
    axios
      .get(
        `http://localhost:5005/books/get-book-list-data?search=${wordSearched}`
      )
      .then((res) => {
        setLoading(false);
        setBooksData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);
      });
  }, [searchParams]);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="d-flex flex-wrap justify-content-center mt-4">
      {booksData.map((book) => {
        return (
          <div
            key={book.bookId}
            style={{
              height: 160,
              width: 300,
              backgroundColor: "#f0eeeb",
              margin: 25,
              border: "1px solid #8f8f8f",
            }}
            className="d-flex justify-content-between"
          >
            <div
              class="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body pb-2"></div>

                  {singleBookLoading && (
                    <div style={{ height: 310 }}>
                      <p style={{ paddingInlineStart: 15 }}>{t("loading")}</p>
                    </div>
                  )}
                  {!singleBookLoading && chosenBookData && (
                    <div>
                      <div
                        style={{ paddingInlineStart: 15, paddingBottom: 15 }}
                      >
                        <h3>{chosenBookData.title}</h3>
                        <h5>{chosenBookData.author}</h5>
                      </div>
                      <div className="d-flex justify-content-around flex-wrap">
                        <div
                          style={{
                            width: 250,
                            maxHeight: 200,
                            overflowY: "scroll",
                          }}
                        >
                          <p style={{ fontSize: 11 }}>
                            {chosenBookData.printedBy && (
                              <span
                                style={{ display: "inline-block", margin: 2 }}
                              >
                                {chosenBookData.printedBy},
                              </span>
                            )}
                            {chosenBookData.yearReleased && (
                              <span
                                style={{ display: "inline-block", margin: 2 }}
                              >
                                {chosenBookData.yearReleased},
                              </span>
                            )}
                            {chosenBookData.pagesInBook && (
                              <span
                                style={{ display: "inline-block", margin: 2 }}
                              >
                                {chosenBookData.pagesInBook}{" "}
                                {t("bookCard.pages")}
                              </span>
                            )}
                          </p>
                          {chosenBookData.bookDescription && (
                            <p>{chosenBookData.bookDescription}</p>
                          )}
                        </div>
                        <div>
                          <img
                            style={{
                              height: 225,
                              width: 150,
                              objectFit: "cover",
                            }}
                            className="pb-2 pt-3"
                            src={
                              book.imgSrc
                                ? `https://simania.co.il/${chosenBookData.imgSrc}`
                                : bookDefault
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="modal-footer justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      {t("form.close")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex-column d-flex justify-content-between"
              style={{
                width: 190,
                paddingInlineStart: 5,
                maxHeight: 160,
                paddingTop: 7,
                paddingBottom: 7,
              }}
            >
              <div>
                <p style={{ fontSize: 14 }}>{book.title}</p>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{book.author}</p>
              </div>
              <div
                className="d-flex flex-wrap justify-content-between"
                style={{ paddingInlineEnd: 7 }}
              >
                <button
                  className="btn btn-sm btn-light"
                  style={{
                    fontSize: 9,
                    backgroundColor: "#729788",
                    color: "#f3f3f3",
                  }}
                >
                  {t("bookCard.add to book list")}
                </button>
                <button
                  onClick={() => openModalWithDetails(book)}
                  className="btn btn-sm btn-light"
                  style={{ fontSize: 9, backgroundColor: "#e6bf8a" }}
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  {t("bookCard.more details")}
                </button>
              </div>
            </div>
            <div>
              <img
                style={{
                  height: 150,
                  width: 100,
                  objectFit: "cover",
                  paddingTop: 10,
                  paddingInlineEnd: 10,
                }}
                src={
                  book.imgSrc
                    ? `https://simania.co.il/${book.imgSrc}`
                    : bookDefault
                }
                alt=""
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BookSearch;
