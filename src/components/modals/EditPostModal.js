import React, { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [currentPostValue, setPostValue] = useState(postData.postContent);
  const [textAreaRows, setTextAreaRows] = useState(2);
  const minRows = 2;
  const maxRows = 16;

  function handleTextAreaChange(eventTarget) {
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

    setPostValue(eventTarget.value);

    let newTextAreaRows = currentRows < maxRows ? currentRows : maxRows;
    setTextAreaRows(newTextAreaRows);
  }

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

        savePostShowNew(currentPostValue);
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
  }, []);

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
          rows={textAreaRows}
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
