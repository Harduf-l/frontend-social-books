import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import bookDefaultPic from "../../images/book-default.jpg";
import Skeleton from "react-loading-skeleton";

function SingleGroup() {
  let navigate = useNavigate();
  let params = useParams();
  const { i18n, t } = useTranslation();
  let direction = i18n.dir();

  const [chosenGroupData, setChosenGroupData] = useState({});
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
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
    <div>
      <div>
        <div
          style={{
            height: 100,
            backgroundColor: "#b6c3ce",
          }}
        >
          <div
            style={{
              display: "inline-block",
              margin: 10,
              position: "relative",
              zIndex: 10,
            }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/groups")}
            >
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
          </div>
        </div>
        <div style={{ marginTop: windowWidth > 470 ? -65 : -40 }}>
          <div>
            {chosenGroupData.name ? (
              <div className="d-flex justify-content-center">
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
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-center">
                  <Skeleton height={140} width={140} borderRadius={70} />
                </div>
                <div className="d-flex justify-content-center mt-1">
                  <Skeleton height={25} width={150} />
                </div>
              </div>
            )}

            {chosenGroupData.name && (
              <div style={{ textAlign: "center", paddingTop: 6 }}>
                <span
                  style={{
                    marginInlineEnd: 10,
                    display: "inline-block",
                    marginTop: 3,
                  }}
                >
                  {chosenGroupData && chosenGroupData.name}
                </span>
                <span style={{ position: "absolute" }}>
                  <button className="btn btn-light btn-sm">
                    {t("groups.follow")}
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap-reverse justify-content-between align-items-end m-3">
        <div
          style={{
            marginInlineStart: 15,

            visibility: loading ? "hidden" : "visible",
            color: "#3a3a3a",
            fontSize: 14,
          }}
          className="col-11 col-md-9"
        >
          <div style={{ height: 260, paddingInlineStart: 10, paddingTop: 15 }}>
            <span
              style={{
                visibility:
                  chosenGroupData.posts && chosenGroupData.posts.length === 0
                    ? "visible"
                    : "hidden",
              }}
            >
              {t("groups.no posts yet")}
            </span>
            <div>
              <button
                className="btn btn-light"
                style={{ color: "#3a3a3a", marginTop: 25, fontSize: 14 }}
              >
                <i className="fa-solid fa-pencil"></i>
                <span style={{ marginInlineStart: 10 }}>
                  {t("groups.add a post")}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            margin: 10,
            padding: 5,
            backgroundColor: "#efefef",
            fontSize: 12,
            fontStyle: "italic",
            color: "#414141",
            textAlign: "center",
          }}
          className="col-11 col-md-2 mb-4"
        >
          {chosenGroupData.description && chosenGroupData.description}
        </div>
      </div>
    </div>
  );
}

export default SingleGroup;
