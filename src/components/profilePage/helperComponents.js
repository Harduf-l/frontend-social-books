import { useTranslation } from "react-i18next";
import react from "react";
import styles from "./profilePage.module.css";

export const UserCard = ({ currentUserPage, editOption }) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = react.useState(false);
  const [newName, setNewName] = react.useState(currentUserPage.username);
  const [newAuthor, setNewAuthor] = react.useState(
    currentUserPage.favoriteWriter
  );
  const [currentGenres, setCurrentGenres] = react.useState(
    currentUserPage.genres
  );
  const [userGenres, setGenres] = react.useState({});

  const CheckBok = ({ name }) => {
    return (
      <div>
        <input
          className="form-check-input"
          type="checkbox"
          value={name}
          id={name}
          checked={userGenres[name]}
          onChange={(e) => getGenres(e)}
        />
        <label
          className="form-check-label"
          style={{ paddingInlineStart: "5px", fontSize: "13px" }}
          htmlFor={name}
        >
          {t(`genres.${name}`)}
        </label>
      </div>
    );
  };

  const getGenres = (e) => {
    let newObgGenres = { ...userGenres };
    if (e.target.checked) {
      newObgGenres[e.target.value] = true;
    } else {
      delete newObgGenres[e.target.value];
    }
    setGenres(newObgGenres);
  };

  const saveGenresToLocalState = () => {
    console.log("got new list from user", userGenres);
    setCurrentGenres(Object.keys(userGenres));
    Object.keys(userGenres);
    console.log("wanted format", currentGenres);
    ////////////////
  };

  const resetInfo = () => {
    setEditMode(false);
    setNewName(currentUserPage.username);
    setNewAuthor(currentUserPage.favoriteWriter);
  };

  const openCategoryModal = () => {
    console.log("shall open modal for categories change");
  };
  return (
    <div
      className="col-lg-3 col-12"
      style={{ backgroundColor: "#fff9f1", position: "relative" }}
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
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title" id="staticBackdropLabel">
                {t("form.choose categories")}
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-wrap">
                <div className="col-12 col-sm-6 col-xl-3">
                  <CheckBok name={"novel"} />
                  <CheckBok name={"thriller"} />
                  <CheckBok name={"biographic"} />
                  <CheckBok name={"poetry"} />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                  <CheckBok name={"fantasy"} />
                  <CheckBok name={"madab"} />
                  <CheckBok name={"children"} />
                  <CheckBok name={"teenagers"} />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                  <CheckBok name={"plays"} />
                  <CheckBok name={"nonfiction"} />
                  <CheckBok name={"self help"} />
                  <CheckBok name={"psychology"} />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                  <CheckBok name={"phlipsophy"} />
                  <CheckBok name={"history"} />
                  <CheckBok name={"comics"} />
                  <CheckBok name={"management"} />
                </div>
              </div>
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("form.cancel")}
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="btn btn-primary"
                onClick={saveGenresToLocalState}
              >
                {t("form.save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {editOption && (
        <i
          role="button"
          onClick={() => setEditMode(true)}
          style={{ position: "absolute", top: 5, left: 5, fontSize: "18px" }}
          className="far fa-edit"
        ></i>
      )}
      <div className="text-center">
        <img
          style={{
            borderRadius: "30px",
            marginBottom: "15px",
            height: "170px",
            width: "170px",
            objectFit: "cover",
          }}
          src={`${process.env.REACT_APP_SERVER_URL}${currentUserPage.picture}`}
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
        {(!editOption || !editMode) && (
          <p style={{ backgroundColor: "white" }}>{currentUserPage.username}</p>
        )}
        {editOption && editMode && (
          <input
            style={{
              display: "block",
              width: "100%",
              border: "none",
              marginBottom: "13px",
            }}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        )}
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
        {(!editOption || !editMode) && (
          <p style={{ backgroundColor: "white" }}>
            {currentUserPage.favoriteWriter}
          </p>
        )}

        {editOption && editMode && (
          <input
            style={{
              display: "block",
              marginBottom: "13px",
              width: "100%",
              border: "none",
            }}
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        )}
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
          {t("genres.favorite")}
        </span>
        {editMode && (
          <i
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={openCategoryModal}
            role="button"
            style={{ fontSize: "14px" }}
            className="far fa-edit"
          ></i>
        )}
        <br />
        <p style={{ backgroundColor: "white" }}>
          {currentGenres.map((el, index) => {
            if (index === currentGenres.length - 1) {
              return <span key={el}> {t(`genres.${el}`)}. </span>;
            } else {
              return <span key={el}> {t(`genres.${el}`)}, </span>;
            }
          })}
        </p>
      </div>
      {editMode && (
        <div className="d-flex justify-content-between pb-3 pt-3">
          <button onClick={resetInfo} className="btn btn-sm btn-secondary">
            {t("form.cancel")}
          </button>
          <button className="btn btn-sm btn-secondary">
            {t("form.save all")}
          </button>
        </div>
      )}
    </div>
  );
};
