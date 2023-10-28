import { useCallback, useEffect, useState, useContext } from "react";
import { Modal, Box } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { textAreaChange } from "../utlis/utils";
import { storeContext } from "../../context/store";

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

const EditUserDetailsModal = ({ userDetails, handleClose, open }) => {
  const { dispatch } = useContext<{ dispatch: any }>(storeContext);

  const { t } = useTranslation();
  const [currentUserDetails, setUserDetails] = useState(userDetails);
  const [textAreaRows, setTextAreaRows] = useState(2);

  const saveNewEditedPost = async () => {
    if (userDetails === currentUserDetails) {
      handleClose();
    } else {
      // axios change value

      try {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}users/edit-user-data`,
          {
            name: currentUserDetails.name,
            /////
            token: localStorage.getItem("token"),
          }
        );

        dispatch({
          type: "editUserCard",
          payload: { userId: 123, newContent: currentUserDetails },
        });
        handleClose();
      } catch (err) {
        console.log(err.response);
        handleClose();
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>שינוי פרטים - בטיפול. האופציה תתווסף בקרוב</div>
      </Box>
    </Modal>
  );
};

export default EditUserDetailsModal;
