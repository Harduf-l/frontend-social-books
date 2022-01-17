import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import bookDefault from "../../images/book-default.jpg";
import { useTranslation } from "react-i18next";
import BookModal from "../homePageUser/bookModal";

function BookSearch() {
  const [searchParams] = useSearchParams();
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chosenBookData, setChosenBookData] = useState({});
  const [singleBookLoading, setSingleBookLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const openModalWithDetails = (book) => {
    const { bookId } = book;
    setChosenBookData({});
    setSingleBookLoading(true);
    setOpen(true);
    axios
      .get(`http://localhost:5005/books/get-single-book-data?bookId=${bookId}`)
      .then((res) => {
        setChosenBookData({ ...book, ...res.data });
        console.log({ ...book, ...res.data });
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
      <BookModal
        open={open}
        handleClose={handleClose}
        chosenBookData={chosenBookData}
        loading={singleBookLoading}
      />
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
              className="flex-column d-flex justify-content-between"
              style={{
                width: 190,
                paddingInlineStart: 5,
                maxHeight: 160,
                paddingTop: 7,
                paddingBottom: 7,
              }}
            >
              <div style={{ maxHeight: 200, overflowY: "scroll" }}>
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
