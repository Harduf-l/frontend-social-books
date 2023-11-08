import { useState, useContext } from "react";
import { Modal, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { updateUserContent } from "../utlis/axiosCalls";
import { storeContext } from "../../context/store";
import { LoadingSavingBtn } from "../utlis/sharedComponents";
import styles from "../homePageUser/HomePageUser.module.css";

const style = {
  position: "absolute",
  top: "52%",
  left: "50%",
  width: "70vw",
  maxHeight: 440,
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Iprops {
  freeText: string;
  amIwritingText: string;
  open: boolean;
  handleClose: () => void;
  email: string;
}

export const EditUserContentModal = ({
  freeText,
  amIwritingText,
  handleClose,
  email,
  open,
}: Iprops) => {
  const { dispatch } = useContext<{ dispatch: any }>(storeContext);

  const { t } = useTranslation();
  const minRows = 2;
  const maxRows = 5;

  const [userFreeText, setUserFreeText] = useState<string>(freeText);
  const [userAmIwritingText, setUserAmIwritingText] =
    useState<string>(amIwritingText);
  const [textAreaRowsAboutMe, setTextAreaRowsAboutMe] = useState(2);
  const [textAreaRowsWriting, setTextAreaRowsWriting] = useState(2);

  const [isSavingProcessHappenning, setIsSavingProcessHappenning] =
    useState<boolean>(false);

  const saveNewEditedUserContent = async () => {
    if (userFreeText === freeText && userAmIwritingText === amIwritingText) {
      handleClose();
    } else {
      try {
        setIsSavingProcessHappenning(true);
        await updateUserContent(
          userFreeText.trim(),
          userAmIwritingText.trim(),
          email
        );
        dispatch({
          type: "updateContentProfile",
          payload: {
            userFreeText,
            userAmIwritingText,
          },
        });
        setIsSavingProcessHappenning(false);
        handleClose();
      } catch (err) {}
    }
  };
  const reverseDataAndClose = () => {
    setUserFreeText(freeText);
    setUserAmIwritingText(amIwritingText);

    handleClose();
  };

  const handleTextAreaChange = (
    event,
    stateToChange: (val: string) => void,
    stateRowsToChange: (val: number) => void
  ) => {
    const textareaLineHeight = 24;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    stateToChange(event.target.value);

    let newTextAreaRows = currentRows < maxRows ? currentRows : maxRows;
    stateRowsToChange(newTextAreaRows);
  };

  return (
    <Modal
      open={open}
      onClose={reverseDataAndClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>{t("form.freeText")}</div>

        <textarea
          rows={textAreaRowsAboutMe}
          value={userFreeText}
          onChange={(e) =>
            handleTextAreaChange(e, setUserFreeText, setTextAreaRowsAboutMe)
          }
          className={styles.textareaAutoExpand}
        ></textarea>

        <div>{t("form.writingDescription")}</div>

        <textarea
          rows={textAreaRowsWriting}
          value={userAmIwritingText}
          onChange={(e) =>
            handleTextAreaChange(
              e,
              setUserAmIwritingText,
              setTextAreaRowsWriting
            )
          }
          className={styles.textareaAutoExpand}
        ></textarea>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={reverseDataAndClose}>
            {t("form.cancel")}
          </button>

          <LoadingSavingBtn
            isLoading={isSavingProcessHappenning}
            savingFunction={saveNewEditedUserContent}
            shallSendEvent={false}
            textOnBtn={t("form.save")}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default EditUserContentModal;
