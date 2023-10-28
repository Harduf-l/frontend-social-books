import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { calculateAge } from "../utlis/utils";
import EditUserDetailsModal from "../modals/EditUserDetailsModal";

import styles from "./profilePage.module.css";
import defaultProfilePicture from "../../images/plain.jpg";

export const InfoBox = ({ translationDate, dataItself }) => {
  return (
    <div>
      <span className={styles.littleHeaderCard}>{translationDate}</span>
      <br />
      <span className={styles.dataCard}>{dataItself}</span>
    </div>
  );
};

export const UserCard = ({
  currentUserPage,
  isItMe,
  createNewMessageAndNavigate,
  sendFriendRequest,
  friendshipStatus,
  confirmFriendRequest,
}) => {
  const { t } = useTranslation();
  const [userAge, setuserAge] = useState<number>(0);
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false);

  useEffect(() => {
    if (currentUserPage.birthday) {
      setuserAge(calculateAge(JSON.parse(currentUserPage.birthday)));
    }
  }, [currentUserPage, friendshipStatus]);

  return (
    <div className={styles.cardItself}>
      <div className="text-center">
        <img
          className={styles.userImage}
          src={
            currentUserPage.picture
              ? currentUserPage.picture
              : defaultProfilePicture
          }
          alt=""
        />
        {isItMe && (
          <div
            style={{ position: "relative" }}
            onClick={() => setShowEditUserModal(true)}
          >
            <div className={styles.userEditImage}>
              <i className="fa-regular fa-pen-to-square"></i>
            </div>
          </div>
        )}
      </div>

      <EditUserDetailsModal
        open={showEditUserModal}
        handleClose={() => setShowEditUserModal(false)}
        userDetails={currentUserPage}
      />
      <div style={{ height: 20 }}></div>

      <InfoBox
        translationDate={t("form.name")}
        dataItself={currentUserPage.username}
      />

      {userAge && (
        <InfoBox translationDate={t("form.age")} dataItself={userAge} />
      )}

      {currentUserPage.city && (
        <InfoBox
          translationDate={t("form.city")}
          dataItself={currentUserPage.city}
        />
      )}

      {currentUserPage.favoriteWriter && (
        <InfoBox
          translationDate={t("form.favorite writer")}
          dataItself={currentUserPage.favoriteWriter}
        />
      )}

      <div>
        <span className={styles.littleHeaderCard}>{t("genres.favorite")}</span>

        <br />
        <p>
          {currentUserPage.genres.map((el, index) => {
            if (index === currentUserPage.genres.length - 1) {
              return (
                <span className={styles.dataCard} key={el}>
                  {t(`genres.${el}`)}.
                </span>
              );
            } else {
              return (
                <span className={styles.dataCard} key={el}>
                  {t(`genres.${el}`)},
                </span>
              );
            }
          })}
        </p>
      </div>

      {!isItMe && (
        <div className="d-flex justify-content-between">
          <button
            onClick={createNewMessageAndNavigate}
            className="btn btn-light"
          >
            {t("profile.send a message")}
          </button>

          {friendshipStatus === "no connection" && (
            <button className="btn btn-light" onClick={sendFriendRequest}>
              {t("profile.add as friend")}
            </button>
          )}
          {friendshipStatus === "friendhip" && (
            <button className="btn btn-light">
              {t("profile.in your friend list")}
            </button>
          )}
          {friendshipStatus === "friend request was sent" && (
            <button role={"contentinfo"} className="btn btn-light">
              {t("profile.friend request was sent")}
            </button>
          )}
          {friendshipStatus === "respond to friend request" && (
            <button className="btn btn-light" onClick={confirmFriendRequest}>
              {t("profile.respond to friend request")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
