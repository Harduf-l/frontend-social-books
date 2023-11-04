import { useState, useContext } from "react";
import { Modal, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IBasicDetails, updateUserBasicDetails } from "../utlis/axiosCalls";
import { storeContext } from "../../context/store";
import { compareTwoObjectAreEqual } from "../utlis/utils";

const style = {
  position: "absolute",
  top: "52%",
  left: "50%",
  maxHeight: 440,
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Iprops extends IBasicDetails {
  open: boolean;
  handleClose: () => void;
}

const makeGenresObject = (genresArray) => {
  return genresArray.reduce((genresObject, genreElement) => {
    return { ...genresObject, [genreElement]: true };
  }, {});
};

const EditUserDetailsModal = ({ userDetails, handleClose, open }: Iprops) => {
  const { dispatch } = useContext<{ dispatch: any }>(storeContext);

  const { t } = useTranslation();

  const [userGenres, setGenres] = useState(
    makeGenresObject(userDetails.genres)
  );

  const [userCity, setUserCity] = useState(userDetails.city);
  const [userFavWriter, setUserFavWriter] = useState(
    userDetails.favoriteWriter
  );

  const saveNewEditedUserDetails = async () => {
    if (
      userCity === userDetails.city &&
      userFavWriter === userDetails.favoriteWriter &&
      compareTwoObjectAreEqual(userGenres, makeGenresObject(userDetails.genres))
    ) {
      handleClose();
    } else {
      try {
        const sendUserDetails = {
          city: userCity,
          favoriteWriter: userFavWriter,
          genres: Object.keys(userGenres),
          email: userDetails.email,
        };
        await updateUserBasicDetails(sendUserDetails);

        dispatch({
          type: "updateBasicProfile",
          payload: {
            favoriteWriter: userFavWriter,
            genres: Object.keys(userGenres),
            city: userCity,
          },
        });
        handleClose();
      } catch (err) {}
    }
  };

  const getGenres = (e) => {
    let newObgGenres = { ...userGenres };
    if (e.target.checked) {
      newObgGenres[e.target.value] = true;
    } else {
      delete newObgGenres[e.target.value];
    }
    setGenres(newObgGenres);
  };

  const removeDataAndClose = () => {
    setUserCity(userDetails.city);
    setUserFavWriter(userDetails.favoriteWriter);
    setGenres(makeGenresObject(userDetails.genres));
    handleClose();
  };

  const CheckBok = ({ name }) => {
    return (
      <div>
        <input
          className="form-check-input"
          type="checkbox"
          value={name}
          id={name}
          checked={userGenres[name]}
          onChange={(e) => getGenres(e)}
        />
        <label
          className="form-check-label"
          style={{ paddingInlineStart: "5px", fontSize: "13px" }}
          htmlFor={name}
        >
          {t(`genres.${name}`)}
        </label>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={removeDataAndClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <label htmlFor="city" style={{ marginInlineEnd: 15, width: 150 }}>
            {t("form.city living")}
          </label>
          <input
            type="text"
            id="city"
            onChange={(e) => setUserCity(e.target.value)}
            value={userCity}
          />
        </div>
        <div className="pt-3">
          <label htmlFor="writer" style={{ marginInlineEnd: 15, width: 150 }}>
            {t("form.favorite writer")}
          </label>
          <input
            type="text"
            id="city"
            value={userFavWriter}
            onChange={(e) => setUserFavWriter(e.target.value)}
          />
        </div>

        <div className="pt-3 pb-1"> {t("form.favorite genre")}</div>

        <div className="d-flex flex-wrap">
          <div className="col-12 col-sm-5 col-xl-6">
            <CheckBok name={"novel"} />
            <CheckBok name={"thriller"} />
            <CheckBok name={"biographic"} />
            <CheckBok name={"poetry"} />
            <CheckBok name={"fantasy"} />
            <CheckBok name={"madab"} />
            <CheckBok name={"children"} />
            <CheckBok name={"teenagers"} />
          </div>

          <div className="col-12 col-sm-5 col-xl-6">
            <CheckBok name={"plays"} />
            <CheckBok name={"nonfiction"} />
            <CheckBok name={"self help"} />
            <CheckBok name={"psychology"} />
            <CheckBok name={"phlipsophy"} />
            <CheckBok name={"history"} />
            <CheckBok name={"comics"} />
            <CheckBok name={"management"} />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={removeDataAndClose}>
            {t("form.cancel")}
          </button>
          <button
            className="btn btn-secondary"
            onClick={saveNewEditedUserDetails}
          >
            {t("form.save")}
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditUserDetailsModal;
