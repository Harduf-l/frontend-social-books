import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import bookDefault from "../images/plain.jpg";
import { checkIfInputIsHebrew } from "../components/utlis/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeContext } from "../context/store";

function RegisterProcess() {
  let navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const currentDir = i18n.dir();

  const { dispatch } = useContext(storeContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [chosenPictureName, setChosenPictureName] = useState("");
  const [favoriteWriter, setFavoriteWriter] = useState("");
  const [email, setEmail] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [userGenres, setGenres] = useState({});

  const registerNewUser = async (e) => {
    const userGenresArray = Object.keys(userGenres);
    e.preventDefault();
    if (
      name &&
      password &&
      favoriteWriter &&
      email &&
      selectedImage &&
      userGenresArray.length > 0
    ) {
      const formData = new FormData();
      formData.append("username", name);
      formData.append("password", password);
      formData.append("favoriteWriter", favoriteWriter);
      formData.append("email", email);
      formData.append("photo", selectedImage.imageFile);
      formData.append("genres", userGenresArray);

      try {
        const response = await axios.post(
          "http://localhost:5005/add-user",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.status === "error") {
          console.log(response.data.error);
          if (response.data.error === "Duplicated email") {
            setRegisterError("duplicate email");
          }
        } else {
          dispatch({
            type: "login",
            payload: {
              userDeatils: response.data.userDetails,
              friends: response.data.suggestedUsers,
            },
          });

          navigate(`/`);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const setImageFunction = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      const fileType = event.target.files[0].type.split("/")[0];

      if (fileType === "image") {
        if (img.size > 600000) {
          setImageError(true);
          setChosenPictureName(null);
          setSelectedImage(null);
        } else {
          setSelectedImage({
            imageObj: URL.createObjectURL(img),
            imageFile: img,
          });
          setChosenPictureName(img.name);
          setImageError(null);
        }
      } else {
        setChosenPictureName(null);
        setSelectedImage(null);
        setImageError(true);
      }
    }
  };

  const onInputClick = (event) => {
    event.target.value = "";
  };

  const passWordSetAndCheck = (event) => {
    if (event.target.value[0]) {
      if (checkIfInputIsHebrew(event.target.value[0])) {
        setPasswordError(true);
      } else {
        setPasswordError(null);
      }
    }

    setPassword(event.target.value);
  };

  ////////////////////////
  const getGenres = (e) => {
    let newObgGenres = { ...userGenres };
    if (e.target.checked) {
      newObgGenres[e.target.value] = true;
    } else {
      delete newObgGenres[e.target.value];
    }
    setGenres(newObgGenres);
  };
  ///////////////////////////////
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
          style={{ paddingInlineStart: "5px" }}
          htmlFor={name}
        >
          {t(`genres.${name}`)}
        </label>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 col-md-12">
          <form>
            <div className="d-flex ">
              <div>
                <input
                  className="form-control "
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("form.name")}
                />
              </div>
              <div style={{ paddingInlineStart: "20px" }}>
                <input
                  dir="ltr"
                  style={{ textAlign: currentDir === "rtl" ? "end" : "start" }}
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={passWordSetAndCheck}
                  placeholder={t("form.password")}
                  autoComplete="on"
                />
                <small
                  style={{
                    display: "block",
                    marginTop: "10px",
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {passwordError && t("form.password hebrew error")}
                </small>
              </div>
            </div>
          </form>
          <div className="d-flex ">
            <div>
              <input
                className="form-control "
                type="text"
                value={favoriteWriter}
                onChange={(e) => setFavoriteWriter(e.target.value)}
                placeholder={t("form.favorite writer")}
              />
            </div>
            <div style={{ paddingInlineStart: "20px" }}>
              <input
                dir="ltr"
                style={{ textAlign: currentDir === "rtl" ? "end" : "start" }}
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.email")}
                autoComplete="on"
              />
              {/* <small
                  style={{
                    display: "block",
                    marginTop: "10px",
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {passwordError && t("form.password hebrew error")}
                </small> */}
            </div>
          </div>
          <small
            style={{
              display: "block",
              marginTop: "15px",
              color: "red",
              fontSize: "12px",
              textAlign: "start",
            }}
          >
            {registerError && t(`form.${registerError}`)}
          </small>

          <p>{t(`genres.favorite`)}:</p>

          <div className="d-flex">
            <div>
              <CheckBok name={"novel"} />
              <CheckBok name={"thriller"} />
              <CheckBok name={"biographic"} />
              <CheckBok name={"poetry"} />
            </div>

            <div style={{ paddingInlineStart: "20px" }}>
              <CheckBok name={"fantasy"} />
              <CheckBok name={"madab"} />
              <CheckBok name={"children"} />
              <CheckBok name={"teenagers"} />
            </div>

            <div style={{ paddingInlineStart: "20px" }}>
              <CheckBok name={"plays"} />
              <CheckBok name={"nonfiction"} />
              <CheckBok name={"self help"} />
              <CheckBok name={"psychology"} />
            </div>

            <div style={{ paddingInlineStart: "20px" }}>
              <CheckBok name={"phlipsophy"} />
              <CheckBok name={"history"} />
              <CheckBok name={"comics"} />
              <CheckBok name={"management"} />
            </div>
          </div>
          <button
            type="submit"
            onClick={(e) => registerNewUser(e)}
            className="btn btn-secondary mt-4"
          >
            {t("form.send")}
          </button>
        </div>
        <div
          className="col-lg-4 col-md-12"
          style={{ paddingInlineStart: "50px" }}
        >
          {!selectedImage && (
            <div className="mobile-space">
              <img
                style={{
                  height: "200px",
                  width: "200px",
                  objectFit: "cover",
                }}
                src={bookDefault}
                alt=""
              />
            </div>
          )}
          {selectedImage && (
            <div style={{ position: "relative" }} className="mobile-space">
              <img
                style={{
                  height: "200px",
                  width: "200px",
                  objectFit: "cover",
                }}
                src={selectedImage.imageObj}
                alt=""
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  color: "red",
                  fontWeight: "bold",
                  paddingInlineStart: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedImage(null);
                  setChosenPictureName(null);
                }}
              >
                X
              </div>
            </div>
          )}
          <br />
          <label htmlFor="formFile" className="btn btn-light btn-sm">
            {t("form.uploadImage")}
          </label>
          <input
            className="d-none"
            type="file"
            onChange={setImageFunction}
            onClick={onInputClick}
            name="photo"
            id="formFile"
          />
          <span style={{ marginInlineStart: "10px", fontSize: "12px" }}>
            {chosenPictureName}
          </span>
          <small
            style={{
              display: "block",
              marginTop: "10px",
              color: "red",
              fontSize: "12px",
            }}
          >
            {imageError && t("form.imageError")}
          </small>
        </div>
      </div>
    </div>
  );
}

export default RegisterProcess;
