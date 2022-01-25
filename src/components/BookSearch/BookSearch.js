import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import bookDefault from "../../images/book-default.jpg";
import { useTranslation } from "react-i18next";
import BookModal from "../homePageUser/bookModal";
import { blueGrey, grey } from "@mui/material/colors";
import { auto } from "@popperjs/core";

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
      .get(
        `${process.env.REACT_APP_SERVER_URL}books/get-single-book-data?bookId=${bookId}`
      )
      .then((res) => {
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
        `${process.env.REACT_APP_SERVER_URL}books/get-book-list-data?search=${wordSearched}`
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
    <div className="d-flex flex-wrap mt-4">
      <BookModal
        open={open}
        handleClose={handleClose}
        chosenBookData={chosenBookData}
        loading={singleBookLoading}
      />
      <div
        className="col-12 col-md-9 mt-3"
        style={{ paddingInlineStart: 20, paddingInlineEnd: 20 }}
      >
        <h4 className="pb-3">
          {t("search results")}"{searchParams.get("search")}"
        </h4>
        <div style={{ height: 200, backgroundColor: "#efefef" }}>
          <h6 className="pb-1" style={{ backgroundColor: "white" }}>
            פוסטים
          </h6>
          <p>לא נמצאו פוסטים רלוונטים</p>
        </div>
        <div style={{ height: 200, backgroundColor: "#efefef", marginTop: 50 }}>
          <h6 className="pb-1" style={{ backgroundColor: "white" }}>
            קבוצות דיון
          </h6>
          <p>לא נמצאו קבוצות דיון רלוונטיות</p>
        </div>
      </div>
      <div
        className="col-12 col-md-3"
        style={{ maxHeight: 500, overflowY: "auto" }}
      >
        {booksData.map((book) => {
          return (
            <div
              key={book.bookId}
              style={{
                height: 120,
                margin: 15,
                border: "1px solid #efefef",
                textAlign: "center",
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
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <p style={{ fontSize: 12 }}>
                    {book.title}/{book.author}
                  </p>
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
                    height: 105,
                    width: 70,
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
    </div>
  );
}

export default BookSearch;
