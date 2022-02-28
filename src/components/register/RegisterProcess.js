import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { storeContext } from "../../context/store";

import LanguageSwitcher from "../layout/LanguageSwitcher";
import {
  InputFunction,
  SmallFunction,
  checkIfInputIsHebrew,
  InputAutoCompleteCombined,
} from "../../components/utlis/utils";
import BookShelves from "../../images/bookshelves.jpg";
import { UploadEditPicture } from "./uploadEditPicture";

function RegisterProcess() {
  const BACKCOLOR = "#f3f3f3";

  const { t, i18n } = useTranslation();
  const currentDir = i18n.dir();

  const [nameChosen, setName] = useState("");
  const [passwordChosen, setPassword] = useState("");
  const [cityChosen, setCity] = useState("");
  const [countryChosen, setChousenCountry] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [userImage, setChosenImage] = useState("");
  const [favoriteWriter, setFavoriteWriter] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [userGenres, setGenres] = useState({});
  const [birthday, setBirthdate] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [passwordErrorType, setPasswordErrorType] = useState("");
  const [cities, setCities] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [writingStatus, setWritingStatus] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [freeWriterText, setFreeWriterText] = useState("");
  const [loadingResitration, setLoadingRegistration] = useState(false);
  let navigate = useNavigate();
  const { dispatch } = useContext(storeContext);
  const [inComponentLifeCycle, setInComponentLifeCycle] = useState(true);

  useEffect(() => {
    setInComponentLifeCycle(true);
    return () => {
      setInComponentLifeCycle(false);
    };
  }, []);

  const RegisterNewUser = async (e) => {
    if (!inComponentLifeCycle) return;
    e.preventDefault();

    const userGenresArray = Object.keys(userGenres);

    if (
      nameChosen &&
      passwordChosen &&
      email &&
      birthday &&
      !passwordError &&
      !emailError &&
      !birthDateError &&
      userGenresArray.length > 0
    ) {
      setLoadingRegistration(true);
      let birthArray = birthday.split("-").map((el) => +el);
      const birthdayObj = {
        year: birthArray[0],
        month: birthArray[1],
        day: birthArray[2],
      };

      const userObjectToSend = {};

      if (writingStatus) {
        userObjectToSend["writingDescription"] = freeWriterText;
      }

      userObjectToSend["freeText"] = freeText;
      userObjectToSend["city"] = cityChosen;
      userObjectToSend["country"] = countryChosen;
      userObjectToSend["username"] = nameChosen;

      userObjectToSend["password"] = passwordChosen;
      userObjectToSend["favoriteWriter"] = favoriteWriter;
      userObjectToSend["email"] = email;
      userObjectToSend["picture"] = userImage;

      userObjectToSend["genres"] = userGenresArray;
      userObjectToSend["birthday"] = JSON.stringify(birthdayObj);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}users/add-user`,
          userObjectToSend,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status === "error") {
          console.log(response.data.error);
          if (response.data.error === "Duplicated email") {
            setRegisterErrorFunction();
          }
        } else {
          localStorage.setItem("token", response.data.token);
          dispatch({
            type: "login",
            payload: {
              userDeatils: response.data.userDetails,
              friends: response.data.suggestedUsers,
              booksRecommendations: response.data.recommendationBookArray,
              myPendingConnections: [],
              myConversations: response.data.welcomeMessage,
              numberOfUnSeenMessages: 0,
            },
          });
          window.location.href = "/";
        }
        setLoadingRegistration(false);
      } catch (err) {
        console.log(err.message);
        setLoadingRegistration(false);
      }
    } else {
      setRegisterErrorFunction("data not sufficient");
    }
  };

  const wakeUpServer = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}users/wake-up`);
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

  const setRegisterErrorFunction = (string) => {
    if (string === "data not sufficient") {
      setRegisterError("invalid data");
    } else {
      setRegisterError("duplicate email");
    }
  };

  const setImageFileFunction = (imageDataUrl) => {
    setChosenImage(imageDataUrl);
  };

  const citySuggestions = (e) => {
    setCity(e.target.value);
    if (e.target.value.length > 0 && currentDir === "rtl") {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}autoComplete/get-cities-list?search=${e.target.value}`
        )
        .then((res) => {
          setCities(res.data.splice(0, 4));
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      setCities([]);
    }
  };

  const setChosenCity = (city) => {
    setCity(city);
  };

  const setCountrySuggestions = async (e) => {
    setChousenCountry(e.target.value);
    if (!e.target.value) {
      setCountriesOptions([]);
    }
    let asciValue = e.target.value.charCodeAt(0);

    let serverRoute = null;

    if (asciValue >= 1488 && asciValue <= 1514 && currentDir === "rtl") {
      serverRoute = "get-countriesHeb-list";
    }
    if (asciValue >= 65 && asciValue <= 122 && currentDir === "ltr") {
      serverRoute = "get-countries-list";
    }

    if (serverRoute) {
      let response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}autoComplete/${serverRoute}?search=${e.target.value}`
      );
      setCountriesOptions(response.data.splice(0, 4));
    }
  };

  const setChosenCountryFunction = (country) => {
    setChousenCountry(country);
  };

  const setNameFunction = (e) => {
    setName(e.target.value);
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

  ///
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
          <div className="col-11 col-md-5" style={{}}>
            <div
              style={{
                borderRadius: "10px",
                backgroundColor: BACKCOLOR,
                paddingTop: "20px",
                paddingInlineEnd: "5px",
                paddingInlineStart: "5px",
                paddingBottom: "20px",
              }}
            >
              <div className="d-flex flex-wrap justify-content-between">
                <div className="d-flex">
                  <div style={{ width: 10, color: "red" }}>*</div>
                  <div>
                    <InputFunction
                      fieldName={"name"}
                      stateValue={nameChosen}
                      functionToSetField={setNameFunction}
                      type={"text"}
                      onFocusFunction={wakeUpServer}
                    />

                    <div style={{ height: "20px" }}></div>
                  </div>
                </div>
                <div className="d-flex">
                  <div style={{ width: 10, color: "red" }}>*</div>
                  <div>
                    <InputFunction
                      dir="ltr"
                      styleFunction={() => {
                        let direction;
                        direction = currentDir === "rtl" ? "end" : "start";
                        return {
                          textAlign: direction,
                          width: "auto",
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
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between">
                <div>
                  <div className="d-flex">
                    <div>
                      <div style={{ width: 10, color: "red" }}>*</div>
                    </div>
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
                          width: "auto",
                        };
                      }}
                      dir={"ltr"}
                      autoComplete={true}
                    />
                  </div>
                  <div style={{ marginInlineStart: 10 }}>
                    <SmallFunction
                      stateError={passwordError}
                      translationError={passwordErrorType}
                    />
                  </div>
                </div>
                <div>
                  <div className="d-flex">
                    <div style={{ width: 10, color: "red" }}></div>
                    <InputFunction
                      fieldName={"favorite writer"}
                      stateValue={favoriteWriter}
                      functionToSetField={setFavoriteWriterFunction}
                      type={"text"}
                    />
                  </div>
                  <div style={{ height: "20px" }}></div>
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between">
                <div style={{ marginInlineStart: 10 }}>
                  <InputAutoCompleteCombined
                    dataArray={countriesOptions}
                    setChosenInput={setChosenCountryFunction}
                    fieldName={"country"}
                    stateValue={countryChosen}
                    functionToSetField={setCountrySuggestions}
                    type={"text"}
                  />

                  <div style={{ height: "20px" }}></div>

                  <InputAutoCompleteCombined
                    dataArray={cities}
                    setChosenInput={setChosenCity}
                    fieldName={"city"}
                    stateValue={cityChosen}
                    functionToSetField={citySuggestions}
                    type={"text"}
                  />

                  <div style={{ height: "20px" }}></div>

                  <div className="mb-2" style={{ fontSize: 14 }}>
                    <span style={{ marginInlineEnd: 5 }}>
                      {t("form.do you write")}
                    </span>
                    <input
                      onClick={() => setWritingStatus(true)}
                      style={{ marginInlineEnd: 2 }}
                      type="radio"
                      id="yes"
                      name="doIWrite"
                    />
                    <label style={{ marginInlineEnd: 5 }} htmlFor="yes">
                      {t("yes")}
                    </label>
                    <input
                      onClick={() => setWritingStatus(false)}
                      style={{ marginInlineEnd: 2 }}
                      type="radio"
                      id="no"
                      name="doIWrite"
                    />
                    <label htmlFor="no">{t("no")}</label>
                    {writingStatus && (
                      <textarea
                        className="form-control mt-2 mb-2 textAreaForm"
                        placeholder={t("form.what do you write")}
                        maxLength={70}
                        style={{ fontSize: 14 }}
                        onChange={(e) => setFreeWriterText(e.target.value)}
                        value={freeWriterText}
                      ></textarea>
                    )}
                  </div>

                  <label
                    style={{ marginInlineEnd: "10px", fontSize: 13 }}
                    htmlFor="birthdate"
                  >
                    <span style={{ color: "red" }}>*</span>
                    {t("form.birth date")}
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    value={birthday}
                    style={{ marginBottom: "5px", width: "auto" }}
                    id="birthdate"
                    onChange={setBirthdateFunction}
                  />
                  <SmallFunction
                    stateError={birthDateError}
                    translationError={"form.birth date error"}
                  />
                </div>
                <div>
                  <div className="d-flex">
                    <div style={{ width: 10 }}></div>
                    <textarea
                      rows="10"
                      cols="25"
                      placeholder={t("form.describe yourself")}
                      className=" form-control textAreaForm"
                      style={{ fontSize: 14 }}
                      maxLength={200}
                      onChange={(e) => setFreeText(e.target.value)}
                      value={freeText}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-12 col-md-3 p-1 mt-5 mt-md-0 "
            style={{ backgroundColor: BACKCOLOR, borderRadius: "10px" }}
          >
            <p style={{ fontWeight: "500" }}>
              <span style={{ color: "red" }}>*</span>
              {t(`genres.favorite`)}
            </p>

            <div className="d-flex flex-wrap">
              <div className="col-12 col-sm-5 col-xl-6">
                <CheckBok name={"novel"} />
                <CheckBok name={"thriller"} />
                <CheckBok name={"biographic"} />
                <CheckBok name={"poetry"} />
                <CheckBok name={"fantasy"} />
                <CheckBok name={"madab"} />
                <CheckBok name={"children"} />
                <CheckBok name={"teenagers"} />
              </div>

              <div className="col-12 col-sm-5 col-xl-6">
                <CheckBok name={"plays"} />
                <CheckBok name={"nonfiction"} />
                <CheckBok name={"self help"} />
                <CheckBok name={"psychology"} />
                <CheckBok name={"phlipsophy"} />
                <CheckBok name={"history"} />
                <CheckBok name={"comics"} />
                <CheckBok name={"management"} />
              </div>
            </div>
            <p
              className="mt-4"
              style={{
                fontSize: 12,
                color: "#727272",
                fontStyle: "italic",
                paddingInlineStart: 10,
              }}
            >
              {t("form.categoryInstructions")}
            </p>
          </div>

          <UploadEditPicture setImageFileFunction={setImageFileFunction} />
        </div>

        <div className="d-flex justify-content-center flex-wrap mt-4 pb-3 ">
          <div>
            <div style={{ textAlign: "center", paddingBottom: 10 }}>
              <button
                type="submit"
                onClick={(e) => RegisterNewUser(e)}
                className={
                  loadingResitration
                    ? "btn btn-mg btn-secondary disabled"
                    : "btn btn-mg btn-secondary"
                }
              >
                {loadingResitration && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginInlineEnd: 10 }}
                  ></span>
                )}
                {t("form.send")}
              </button>
            </div>
            <SmallFunction
              stateError={registerError}
              translationError={`form.${registerError}`}
            />
          </div>
        </div>
      </div>

      <div
        className="col-md-1 d-none d-md-block"
        style={{
          backgroundColor: "grey",
          backgroundImage: `url(${BookShelves})`,

          height: "100vh",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
}

export default RegisterProcess;
