import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
export const checkIfInputIsHebrew = (e) => {
  if (e.charCodeAt(0) >= 1488 && e.charCodeAt(0) <= 1514) {
    return true;
  }
  return false;
};

export const textAreaChange = (
  eventTarget,
  minRows,
  maxRows,
  setUserContent,
  setTextAreaRows
) => {
  const textareaLineHeight = 20;

  const previousRows = eventTarget.rows;
  eventTarget.rows = minRows; // reset number of rows in textarea

  const currentRows = ~~(eventTarget.scrollHeight / textareaLineHeight);

  if (currentRows === previousRows) {
    eventTarget.rows = currentRows;
  }

  if (currentRows >= maxRows) {
    eventTarget.rows = maxRows;
    eventTarget.scrollTop = eventTarget.scrollHeight;
  }

  setUserContent(eventTarget.value);

  let newTextAreaRows = currentRows < maxRows ? currentRows : maxRows;
  setTextAreaRows(newTextAreaRows);
};

export const calculateAge = (birthObject) => {
  let currentDate = new Date();
  const currentDateObject = {
    day: currentDate.getDate(),
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };
  let age = currentDateObject.year - birthObject.year;
  if (currentDateObject.month < birthObject.month) {
    age--;
  }
  if (currentDateObject.month === birthObject.month) {
    if (currentDateObject.day < birthObject.day) {
      age--;
    }
  }
  return age;
};

export const InputAutoCompleteCombined = ({
  dataArray,
  setChosenInput,
  type,
  stateValue,
  functionToSetField,
  fieldName,
}) => {
  const [closeMe, setCloseMe] = useState(false);
  const [suggestionIndex, setActiveSuggestionIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setCloseMe(false);
  }, [dataArray]);

  const closeAndSend = (el) => {
    setChosenInput(el);
    setCloseMe(true);
  };

  const onBlurFunction = (e) => {
    if (
      !e.relatedTarget ||
      e.relatedTarget.className !== "autoCompleteOption"
    ) {
      setCloseMe(true);
    }
  };

  const onKeyDownFunction = (e) => {
    if (e.keyCode === 40) {
      let number = suggestionIndex;
      if (number < dataArray.length - 1) {
        setActiveSuggestionIndex(number + 1);
      }
    }
    if (e.keyCode === 38) {
      let number = suggestionIndex;
      if (number > 0) {
        setActiveSuggestionIndex(number - 1);
      }
    }
    if (e.keyCode === 13) {
      setChosenInput(dataArray[suggestionIndex]);
      setActiveSuggestionIndex(0);
      setCloseMe(true);
    }
  };

  return (
    <div>
      <input
        maxLength="25"
        className="form-control "
        type={type}
        value={stateValue}
        onChange={(e) => functionToSetField(e)}
        placeholder={t(`form.${fieldName}`)}
        style={{ width: "auto" }}
        autoComplete={"off"}
        onBlur={onBlurFunction}
        onKeyDown={(e) => onKeyDownFunction(e)}
      />
      {dataArray.length > 0 && (
        <div
          className="suggestionBox"
          onMouseOver={() => setActiveSuggestionIndex(-9999)}
          onMouseLeave={() => setActiveSuggestionIndex(-1)}
        >
          {!closeMe &&
            dataArray.map((el, index) => {
              return (
                <div
                  key={index}
                  onClick={() => closeAndSend(el)}
                  className={
                    index === suggestionIndex
                      ? "autoCompleteOptionOn"
                      : "autoCompleteOption"
                  }
                  tabIndex="0"
                >
                  {el}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export const InputFunction = ({
  fieldName,
  stateValue,
  functionToSetField,
  type,
  styleFunction,
  autoComplete,
  dir,
  onBlurFunction,
  onFocusFunction,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <input
        maxLength="25"
        dir={dir ? dir : ""}
        className="form-control"
        type={type}
        value={stateValue}
        onChange={(e) => functionToSetField(e)}
        placeholder={t(`form.${fieldName}`)}
        style={styleFunction ? styleFunction() : { width: "auto" }}
        autoComplete={autoComplete ? "on" : "off"}
        onBlur={onBlurFunction && onBlurFunction}
        onFocus={onFocusFunction && onFocusFunction}
      />
    </div>
  );
};

export const SmallFunction = ({ stateError, translationError }) => {
  const { t } = useTranslation();
  return (
    <small
      style={{
        paddingInlineStart: "5px",
        height: "20px",
        display: "block",
        marginTop: "5px",
        color: "red",
        fontSize: "11px",
      }}
    >
      {stateError && t(translationError)}
    </small>
  );
};
