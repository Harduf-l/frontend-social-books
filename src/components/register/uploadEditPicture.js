import React from "react";
import { Avatar, Button, Box, Slider, Modal, Typography } from "@mui/material";
import { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import defaultProfilePic from "../../images/plain.jpg";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

export const UploadEditPicture = ({ setImageFileFunction }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [imageError, setImageError] = useState(false);
  var editor = "";
  const [picture, setPicture] = useState({
    img: null,
    rotate: 0,
    zoom: 2,
    croppedImg: defaultProfilePic,
  });

  const handleSlider = (event, value) => {
    setPicture({
      ...picture,
      zoom: value,
    });
  };

  const handleRotate = () => {
    let newRotateDegree;
    if (picture.rotate === 270) newRotateDegree = 0;
    else newRotateDegree = picture.rotate + 90;

    setPicture({
      ...picture,
      rotate: newRotateDegree,
    });
  };

  const onInputClick = (event) => {
    event.target.value = "";
  };

  const handleCancel = () => {
    handleClose();
    setPicture({
      ...picture,
      rotate: 0,
      zoom: 2,
    });
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  const handleSave = (e) => {
    handleClose();
    if (setEditorRef) {
      const canvasScaled = editor.getImage();
      const croppedImg = canvasScaled.toDataURL();
      setImageFileFunction(croppedImg);

      setPicture({
        ...picture,
        rotate: 0,
        zoom: 2,
        img: null,
        croppedImg: croppedImg,
      });
    }
  };

  const setPictureToNull = () => {
    setImageFileFunction(null);
    setPicture({
      ...picture,
      croppedImg: defaultProfilePic,
    });
  };

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    const fileType = e.target.files[0].type.split("/")[0];

    if (fileType === "image") {
      if (img.size > 1000000) {
        setImageFileFunction(null);
        setPicture({
          ...picture,
          img: null,
          croppedImg: defaultProfilePic,
        });
        setImageError(true);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onloadend = () => {
          setImageFileFunction(reader.result);
          setPicture({
            ...picture,
            img: reader.result,
            croppedImg: reader.result,
          });
          handleOpen();
          setImageError(false);
        };
      }
    } else {
      setImageFileFunction(null);
      setPicture({
        ...picture,
        img: null,
        croppedImg: defaultProfilePic,
      });
      setImageError(true);
    }
  };

  return (
    <div style={{ width: 200 }} className="pt-4 pt-md-0">
      <Box display="flex">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box display="block">
              <AvatarEditor
                ref={setEditorRef}
                image={picture.img}
                width={200}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                rotate={picture.rotate}
                scale={picture.zoom}
              />
              <Slider
                aria-label="raceSlider"
                value={picture.zoom}
                min={1}
                max={10}
                step={0.1}
                onChange={handleSlider}
                style={{ color: "#13416f" }}
              ></Slider>
              <Typography
                onClick={handleRotate}
                style={{
                  fontSize: 20,
                  cursor: "pointer",

                  display: "inline",
                  padding: 4,

                  borderRadius: 50,
                }}
              >
                <i className="fas fa-sync-alt"></i>
              </Typography>
              <Box>
                <div className="d-flex justify-content-end pt-2">
                  <Button
                    style={{ marginInlineEnd: 10 }}
                    variant="contained"
                    onClick={handleCancel}
                  >
                    {t("form.cancel")}
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    {" "}
                    {t("form.save")}
                  </Button>
                </div>
              </Box>
            </Box>
          </Box>
        </Modal>

        <Box width="80%">
          <div style={{ position: "relative" }}>
            <Avatar
              src={picture.croppedImg}
              style={{
                height: 165,
                width: 165,
                objectFit: "cover",
                padding: "5",
                borderRadius: 10,
              }}
            />
            {picture.croppedImg !== defaultProfilePic && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  color: "red",
                  fontWeight: "bold",
                  paddingInlineStart: "4px",
                  cursor: "pointer",
                }}
                onClick={setPictureToNull}
              >
                X
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between">
            <div>
              <label
                role={"button"}
                htmlFor="formFile"
                className="btn btn-light btn-sm mt-4"
              >
                {t("form.uploadImage")}
              </label>

              <input
                id="formFile"
                className="d-none"
                onClick={onInputClick}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div>
                {imageError && (
                  <span style={{ fontSize: 10, color: "red" }}>
                    {t("form.imageError")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};
