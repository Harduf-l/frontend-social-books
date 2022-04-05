import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import bookDefault from "../../images/book-default.jpg";
import { useTranslation } from "react-i18next";
import BookModal from "../homePageUser/bookModal";
import FeedPosts from "../homePageUser/FeedPosts";
import { storeContext } from "../../context/store";

function BookSearch() {
  const [searchParams] = useSearchParams();
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { store } = useContext(storeContext);
  const { t } = useTranslation();

  const [wordSearched, setWordSearched] = useState("");

  useEffect(() => {
    setLoading(true);
    const wordSearched = searchParams.get("search");
    setWordSearched(wordSearched);
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}posts/get-searched-posts/${wordSearched}`
      )
      .then((res) => {
        setFoundPosts(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="d-flex flex-wrap mt-4 mb-4">
      <div
        className="col-12 col-md-9 mt-3"
        style={{ paddingInlineStart: 20, paddingInlineEnd: 20 }}
      >
        <h4 className="pb-3">
          {t("search results")}"{searchParams.get("search")}"
        </h4>
        <div style={{}}>
          <h6 className="pb-1" style={{ backgroundColor: "white" }}>
            פוסטים
          </h6>
          {foundPosts.length > 0 ? (
            <FeedPosts
              searchedWord={wordSearched}
              postsToShow={foundPosts}
              userId={store.userDetails._id}
            />
          ) : (
            <p>לא נמצאו פוסטים רלוונטים</p>
          )}
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
      ></div>
    </div>
  );
}

export default BookSearch;
