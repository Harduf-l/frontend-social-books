import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import bookDefault from "../images/plain.jpg";
import { checkIfInputIsHebrew } from "../components/utlis/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeContext } from "../context/store";
import LanguageSwitcher from "./LanguageSwitcher";
import { InputFunction, SmallFunction } from "../components/utlis/utils";

function RegisterProcess() {
  let navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentDir = i18n.dir();
  const { dispatch } = useContext(storeContext);

  const [nameChosen, setName] = useState("");
  const [passwordChosen, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [chosenPictureName, setChosenPictureName] = useState("");
  const [favoriteWriter, setFavoriteWriter] = useState("");
  const [email, setEmail] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [userGenres, setGenres] = useState({});
  const [birthday, setBirthdate] = useState("");

  const registerNewUser = async (e) => {
    const userGenresArray = Object.keys(userGenres);
    e.preventDefault();
    if (
      nameChosen &&
      passwordChosen &&
      favoriteWriter &&
      email &&
      selectedImage &&
      birthday &&
      userGenresArray.length > 0
    ) {
      let birthArray = birthday.split("-").map((el) => +el);
      const birthdayObj = {
        year: birthArray[0],
        month: birthArray[1],
        day: birthArray[2],
      };

      const formData = new FormData();
      formData.append("username", nameChosen);
      formData.append("password", passwordChosen);
      formData.append("favoriteWriter", favoriteWriter);
      formData.append("email", email);
      formData.append("photo", selectedImage.imageFile);
      formData.append("genres", userGenresArray);
      formData.append("birthday", JSON.stringify(birthdayObj));

      try {
        const response = await axios.post(
          "http://localhost:5005/users/add-user",
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

  const setNameFunction = (e) => {
    setName(e.target.value);
  };
  const onInputClick = (event) => {
    event.target.value = "";
  };

  const passWordSetAndCheck = (event) => {
    console.log(event.target.value);
    if (event.target.value[0]) {
      if (checkIfInputIsHebrew(event.target.value[0])) {
        setPasswordError(true);
      } else {
        setPasswordError(null);
      }
    }

    setPassword(event.target.value);
  };

  const setFavoriteWriterFunction = (e) => {
    setFavoriteWriter(e.target.value);
  };

  const setEmailFunction = (e) => {
    setEmail(e.target.value);
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
    <div>
      <LanguageSwitcher />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="d-flex ">
              <InputFunction
                fieldName={"name"}
                stateValue={nameChosen}
                functionToSetField={setNameFunction}
                type={"text"}
              />

              <div style={{ paddingInlineStart: "20px" }}>
                <InputFunction
                  fieldName={"password"}
                  stateValue={passwordChosen}
                  functionToSetField={passWordSetAndCheck}
                  type={"password"}
                  styleFunction={() => {
                    let direction;
                    direction = currentDir === "rtl" ? "end" : "start";
                    return {
                      textAlign: direction,
                    };
                  }}
                  dir={"ltr"}
                  autoComplete={true}
                />
                <SmallFunction
                  stateError={passwordError}
                  translationError={"form.password hebrew error"}
                />
              </div>
            </div>

            <div className="d-flex ">
              <div>
                <InputFunction
                  fieldName={"favorite writer"}
                  stateValue={favoriteWriter}
                  functionToSetField={setFavoriteWriterFunction}
                  type={"text"}
                />
              </div>
              <div style={{ paddingInlineStart: "20px" }}>
                <InputFunction
                  dir="ltr"
                  styleFunction={() => {
                    let direction;
                    direction = currentDir === "rtl" ? "end" : "start";
                    return {
                      textAlign: direction,
                    };
                  }}
                  fieldName={"email"}
                  stateValue={email}
                  functionToSetField={setEmailFunction}
                  type={"email"}
                  autoComplete={true}
                />
              </div>
            </div>
            <SmallFunction
              stateError={registerError}
              translationError={`form.${registerError}`}
            />
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
            <div className="mt-4">
              <label htmlFor="birthdate"> תאריך לידה </label>
              <input
                type="date"
                style={{ marginInlineStart: "10px" }}
                id="birthdate"
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
            <br />
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
            <SmallFunction
              stateError={imageError}
              translationError={"form.imageError"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterProcess;
