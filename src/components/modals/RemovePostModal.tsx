import { useState, useContext } from "react";
import { Modal, Box } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { storeContext } from "../../context/store";
import { LoadingSavingBtn } from "../utlis/sharedComponents";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  maxHeight: 520,
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function RemovePostModal({ open, handleClose, postData, deletePostGoOn }) {
  const { t } = useTranslation();
  const { dispatch } = useContext(storeContext);
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);

  async function handleDelete() {
    try {
      setIsServerProcessing(true);
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}posts/remove-post-entirely`,
        { data: { token: localStorage.getItem("token"), postId: postData._id } }
      );
      dispatch({ type: "removeOnePost", payload: { postId: postData._id } });
      setIsServerProcessing(false);
    } catch (err) {
      setIsServerProcessing(false);
      console.log(err);
    }
    handleClose();
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="col-11 col-md-6 col-lg-5" sx={style}>
        <div>{t("form.are you sure")}</div>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={handleClose}>
            {t("form.cancel")}
          </button>

          <LoadingSavingBtn
            isLoading={isServerProcessing}
            savingFunction={handleDelete}
            shallSendEvent={false}
            textOnBtn={t("homepage.delete")}
          />
        </div>
      </Box>
    </Modal>
  );
}

export default RemovePostModal;
