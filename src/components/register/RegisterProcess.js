import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import profileDefault from "../../images/plain.jpg";
import { checkIfInputIsHebrew } from "../../components/utlis/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeContext } from "../../context/store";
import LanguageSwitcher from "../layout/LanguageSwitcher";
import { InputFunction, SmallFunction } from "../../components/utlis/utils";
import BookShelves from "../../images/bookshelves.jpg";

function RegisterProcess() {
  const PICTURESIZE = 165;
  const FIXEDPADDING = "30px";
  const BACKCOLOR = "#f3f3f3";
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
  const [emailError, setEmailError] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [userGenres, setGenres] = useState({});
  const [birthday, setBirthdate] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [passwordErrorType, setPasswordErrorType] = useState("");

  const registerNewUser = async (e) => {
    const userGenresArray = Object.keys(userGenres);
    e.preventDefault();
    if (
      nameChosen &&
      passwordChosen &&
      favoriteWriter &&
      email &&
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
          `${process.env.REACT_APP_SERVER_URL}users/add-user`,
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

  const setBirthdateFunction = (event) => {
    const dateEntered = event.target.value;
    setBirthdate(event.target.value);
    if (
      dateEntered.split("-")[0] > 2020 ||
      dateEntered.split("-")[0] < 1890 ||
      dateEntered.split("-")[1] > 12 ||
      dateEntered.split("-")[2] > 31
    ) {
      setBirthDateError(true);
    } else {
      setBirthDateError(false);
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
    if (event.target.value[0]) {
      if (checkIfInputIsHebrew(event.target.value[0])) {
        setPasswordErrorType("form.password hebrew error");
        setPasswordError(true);
      } else {
        setPasswordError(null);
      }
    }
    setPassword(event.target.value);
  };

  const passwordOnBlur = () => {
    if (passwordChosen.length < 6) {
      setPasswordErrorType("form.password limit error");
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const emailBlurFunction = () => {
    let pattern = /[a-zA-Z0-9]{2,18}@[a-zA-Z]{2,}.[a-z.A-Z]{2,7}/g;
    if (!pattern.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
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
          style={{ paddingInlineStart: "5px", fontSize: "13px" }}
          htmlFor={name}
        >
          {t(`genres.${name}`)}
        </label>
      </div>
    );
  };

  return (
    <div className="d-flex">
      <div className="col-md-11 col-12">
        <LanguageSwitcher />

        <div className="d-flex flex-wrap justify-content-around m-3">
          <div className="col-12 col-md-8" style={{}}>
            <div
              style={{
                borderRadius: "10px",
                backgroundColor: BACKCOLOR,
                paddingTop: "20px",
                paddingInlineEnd: "5px",
                paddingInlineStart: "5px",
              }}
            >
              <InputFunction
                fieldName={"name"}
                stateValue={nameChosen}
                functionToSetField={setNameFunction}
                type={"text"}
              />
              <div style={{ height: "20px" }}></div>

              <InputFunction
                onBlurFunction={passwordOnBlur}
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
                translationError={passwordErrorType}
              />

              <InputFunction
                fieldName={"favorite writer"}
                stateValue={favoriteWriter}
                functionToSetField={setFavoriteWriterFunction}
                type={"text"}
              />
              <div style={{ height: "20px" }}></div>
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
                onBlurFunction={emailBlurFunction}
              />
              <SmallFunction
                stateError={emailError}
                translationError={"form.email error"}
              />

              <label style={{ marginInlineEnd: "10px" }} htmlFor="birthdate">
                {t("form.birth date")}
              </label>
              <input
                type="date"
                value={birthday}
                style={{ marginBottom: "5px" }}
                id="birthdate"
                onChange={setBirthdateFunction}
              />
              <SmallFunction
                stateError={birthDateError}
                translationError={"form.birth date error"}
              />
            </div>
          </div>

          <div
            className="pt-5 pt-lg-1"
            style={{
              paddingInlineEnd: FIXEDPADDING,
              paddingInlineStart: FIXEDPADDING,
            }}
          >
            <div>
              {!selectedImage && (
                <div className="mobile-space">
                  <img
                    style={{
                      height: PICTURESIZE,
                      width: PICTURESIZE,
                      objectFit: "cover",
                    }}
                    src={profileDefault}
                    alt=""
                  />
                </div>
              )}
              {selectedImage && (
                <div style={{ position: "relative" }} className="mobile-space">
                  <img
                    style={{
                      height: PICTURESIZE,
                      width: PICTURESIZE,
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

        <div className="d-flex flex-wrap justify-content-around m-3">
          <div
            className="col-12 col-md-8 p-1"
            style={{ backgroundColor: BACKCOLOR, borderRadius: "10px" }}
          >
            <p style={{ fontWeight: "500" }}>{t(`genres.favorite`)}</p>

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

          <div
            style={{
              paddingInlineEnd: FIXEDPADDING,
              paddingInlineStart: FIXEDPADDING,
            }}
          >
            <div style={{ width: "165px", height: "100%" }}>
              <div style={{ height: "70px" }}></div>
              <div style={{ textAlign: "end" }}>
                <button
                  type="submit"
                  onClick={(e) => registerNewUser(e)}
                  className="btn btn-mg btn-secondary text-start"
                >
                  {t("form.send")}
                </button>
                <SmallFunction
                  stateError={registerError}
                  translationError={`form.${registerError}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-1 d-none d-md-block">
        <img
          src={BookShelves}
          style={{ objectFit: "cover", width: "100%", height: "100vh" }}
          alt=""
        />
      </div>
    </div>
  );
}

export default RegisterProcess;
