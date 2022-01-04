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
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <input
        dir={dir ? dir : ""}
        className="form-control "
        type={type}
        value={stateValue}
        onChange={(e) => functionToSetField(e)}
        placeholder={t(`form.${fieldName}`)}
        style={styleFunction && styleFunction()}
        autoComplete={autoComplete ? "on" : "off"}
      />
    </div>
  );
};

export const SmallFunction = ({ stateError, translationError }) => {
  const { t } = useTranslation();
  return (
    <small
      style={{
        display: "block",
        marginTop: "10px",
        color: "red",
        fontSize: "12px",
      }}
    >
      {stateError && t(translationError)}
    </small>
  );
};
