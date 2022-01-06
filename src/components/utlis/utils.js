import { useTranslation } from "react-i18next";

export const checkIfInputIsHebrew = (e) => {
  if (e.charCodeAt(0) >= 1488 && e.charCodeAt(0) <= 1514) {
    return true;
  }
  return false;
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
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <input
        maxLength="25"
        dir={dir ? dir : ""}
        className="form-control "
        type={type}
        value={stateValue}
        onChange={(e) => functionToSetField(e)}
        placeholder={t(`form.${fieldName}`)}
        style={styleFunction && styleFunction()}
        autoComplete={autoComplete ? "on" : "off"}
        onBlur={onBlurFunction && onBlurFunction}
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
