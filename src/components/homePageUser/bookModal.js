import React from "react";
import { Modal, Box, Typography } from "@material-ui/core";
import bookDefault from "../../images/book-default.jpg";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BookModal({ open, handleClose, chosenBookData }) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="col-11 col-md-6 col-lg-5" sx={style}>
        <div>
          <div style={{ paddingInlineStart: 10, paddingBottom: 15 }}>
            <h3>{chosenBookData.title}</h3>
            <h5>{chosenBookData.author}</h5>
          </div>
          <div className="d-flex justify-content-around flex-wrap">
            <div
              style={{
                width: 200,
                maxHeight: 200,
                overflowY: "scroll",
              }}
            >
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
              {chosenBookData.bookDescription && (
                <p>{chosenBookData.bookDescription}</p>
              )}
            </div>
            <div className="pt-5 pt-md-0">
              <img
                style={{
                  height: 225,
                  width: 150,
                  objectFit: "cover",
                }}
                className="pb-2 "
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
