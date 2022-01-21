import React from "react";
import { Modal, Box } from "@mui/material";
import bookDefault from "../../images/book-default.jpg";
import { useTranslation } from "react-i18next";
import styles from "./HomePageUser.module.css";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  maxHeight: 380,
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BookModal({ open, handleClose, chosenBookData, loading }) {
  const { t } = useTranslation();
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
          <div>
            {loading ? (
              <div>{t("loading")}</div>
            ) : (
              <div>
                <h3>{chosenBookData.title}</h3>
                <h5>{chosenBookData.author}</h5>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <div
                style={{
                  width: 250,
                  maxHeight: 200,
                  overflowY: "scroll",
                }}
              >
                {!loading && (
                  <p style={{ fontSize: 11 }}>
                    {chosenBookData.printedBy && (
                      <span style={{ display: "inline-block", margin: 2 }}>
                        {chosenBookData.printedBy}
                        {(chosenBookData.pagesInBook ||
                          chosenBookData.yearReleased) &&
                          ","}
                      </span>
                    )}
                    {chosenBookData.yearReleased && (
                      <span style={{ display: "inline-block", margin: 2 }}>
                        {chosenBookData.yearReleased}
                        {chosenBookData.pagesInBook && ","}
                      </span>
                    )}
                    {chosenBookData.pagesInBook && (
                      <span style={{ display: "inline-block", margin: 2 }}>
                        {chosenBookData.pagesInBook} {t("bookCard.pages")}
                      </span>
                    )}
                  </p>
                )}
                {chosenBookData.bookDescription && (
                  <p className="ps-3">{chosenBookData.bookDescription}</p>
                )}
              </div>
              <div style={{ height: 20 }}></div>
            </div>

            <div className="pt-2 pt-md-0">
              <img
                style={{
                  height: 225,
                  width: 150,
                  objectFit: "cover",
                }}
                src={
                  chosenBookData.imgSrc
                    ? `https://simania.co.il/${chosenBookData.imgSrc}`
                    : bookDefault
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default BookModal;
