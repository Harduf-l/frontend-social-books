import React, { useCallback, useEffect, useState, useContext } from "react";
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

function EditPostModal({ open, handleClose, postData, savePostShowNew }) {
  const { dispatch } = useContext(storeContext);

  const { t } = useTranslation();
  const [currentPostValue, setPostValue] = useState(postData.postContent);
  const [textAreaRows, setTextAreaRows] = useState(2);

  function setUserContentFunction(newContent) {
    setPostValue(newContent);
  }

  function setTextAreaRowsFunction(newRows) {
    setTextAreaRows(newRows);
  }

  const handleTextAreaChange = useCallback((eventTarget) => {
    textAreaChange(
      eventTarget,
      2,
      12,
      setUserContentFunction,
      setTextAreaRowsFunction
    );
  }, []);

  const saveNewEditedPost = async () => {
    if (postData.postContent === currentPostValue) {
      handleClose();
    } else {
      // axios change value

      try {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}posts/edit-post`, {
          postId: postData._id,
          newPostContent: currentPostValue,
          token: localStorage.getItem("token"),
        });

        dispatch({
          type: "editOnePost",
          payload: { postId: postData._id, newContent: currentPostValue },
        });
        handleClose();
      } catch (err) {
        console.log(err.response);
        handleClose();
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      let element = document.getElementById("textAreaElement");
      handleTextAreaChange(element);
      element.scrollTop = 0;
    }, 0);
  }, [handleTextAreaChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="col-11 col-md-6 col-lg-5" sx={style}>
        <textarea
          id="textAreaElement"
          dir="auto"
          rows={textAreaRows ? textAreaRows : 2}
          value={currentPostValue ? currentPostValue : ""}
          onChange={(e) => handleTextAreaChange(e.target)}
          className="textareaAutoExpand"
        ></textarea>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={handleClose}>
            {t("form.cancel")}
          </button>
          <button className="btn btn-secondary" onClick={saveNewEditedPost}>
            {t("form.save")}
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default EditPostModal;
