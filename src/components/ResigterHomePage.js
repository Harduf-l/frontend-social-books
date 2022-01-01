import React from "react";
import { useTranslation } from "react-i18next";
import bookImage from "../images/bookHome.jpg";
import { Link } from "react-router-dom";

function ResigterHomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className=" col-s-12 col-md-6 pb-3">
            <p
              style={{
                fontSize: "50px",
                fontWeight: "lighter",
                paddingInlineStart: "20px",
              }}
            >
              {t("welcome")}
            </p>

            <div className="pt-4 text-center">
              <input
                className="m-1 col-11"
                type="text"
                placeholder={t("form.email")}
              ></input>
              <input
                className="m-1 col-11"
                type="password"
                placeholder={t("form.password")}
              ></input>
              <input
                className="btn btn-light btn-sm mt-2 col-11 p-2"
                type="submit"
                value={t("form.login")}
              />
              <Link to="/register">
                <input
                  className="btn btn-dark btn-sm mt-2 col-11 p-2"
                  type="submit"
                  value={t("form.register")}
                />
              </Link>
            </div>
          </div>
          <div className="col-s-12 col-md-6" style={{ height: "300px" }}>
            <img
              style={{ objectFit: "cover", height: "450px", width: "100%" }}
              src={bookImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResigterHomePage;
