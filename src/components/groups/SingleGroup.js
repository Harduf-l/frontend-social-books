import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import bookDefaultPic from "../../images/book-default.jpg";
import Skeleton from "react-loading-skeleton";

function SingleGroup() {
  let params = useParams();
  const { i18n, t } = useTranslation();
  let direction = i18n.dir();

  const [chosenGroupData, setChosenGroupData] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchSingleGroupData();
    async function fetchSingleGroupData() {
      try {
        const groupData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}groups/get-single-group-data/${params.id}`
        );
        setChosenGroupData(groupData.data);
      } catch (err) {
        console.log(err.response);
      }
    }
  }, [params.id]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        marginTop: 10,
        marginInlineStart: 10,
        marginInlineEnd: 10,
        height: "87vh",
      }}
    >
      <div
        style={{
          height: 100,
          backgroundColor: "#b6c3ce",
        }}
      >
        <Link to={`/groups`}>
          <button className="btn btn-light btn-sm m-2">
            <i
              className={
                direction === "ltr"
                  ? "fa-solid fa-arrow-left"
                  : "fa-solid fa-arrow-right"
              }
            ></i>
            <span style={{ marginInlineStart: 10 }}>
              {t("groups.back to group page")}
            </span>
          </button>
        </Link>
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ position: "relative", bottom: windowWidth > 470 ? 65 : 40 }}
      >
        <div>
          {chosenGroupData.name ? (
            <img
              style={{
                height: 140,
                width: 140,
                borderRadius: "50%",

                objectFit: "cover",
              }}
              src={
                chosenGroupData.picture
                  ? chosenGroupData.picture
                  : bookDefaultPic
              }
              alt=""
            />
          ) : (
            <Skeleton height={140} width={140} borderRadius={70} />
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 7,
              fontWeight: 500,
              color: "#313131",
            }}
          >
            {chosenGroupData && chosenGroupData.name}
          </div>
        </div>
      </div>

      {chosenGroupData.posts && chosenGroupData.posts.length === 0 && (
        <p style={{ marginInlineStart: 20 }}>
          נראה שעוד לא נכתבו פוסטים בקבוצה זו. היה הראשון לפרסם פוסט בקבוצה
        </p>
      )}
    </div>
  );
}

export default SingleGroup;
