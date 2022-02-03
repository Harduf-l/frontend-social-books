import React from "react";
import { Modal, Box } from "@mui/material";
import defaultPicture from "../../../images/plain.jpg";
import styles from "../HomePageUser.module.css";
import { Link } from "react-router-dom";
const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  maxHeight: 400,
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function LikesModal({ open, handleClose, likesArray }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="col-11 col-md-6 col-lg-5" sx={style}>
        <div
          role={"button"}
          onClick={handleClose}
          className={styles.closeModalButton}
        >
          <i style={{ fontSize: 24 }} className="fas fa-times"></i>
        </div>

        <div>
          {likesArray.map((el, index) => {
            return (
              <div key={index} className="d-flex align-items-center mt-2 mb-2">
                <Link to={`user/${el._id}`}>
                  <img
                    className={styles.likePicModal}
                    src={el.picture ? el.picture : defaultPicture}
                    alt=""
                  />
                </Link>
                <p style={{ marginInlineStart: 10 }}>{el.username}</p>
              </div>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
}

export default LikesModal;
