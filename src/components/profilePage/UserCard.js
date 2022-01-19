import { useTranslation } from "react-i18next";
import react from "react";
import styles from "./profilePage.module.css";
import { calculateAge } from "../utlis/utils";
import defaultProfilePicture from "../../images/plain.jpg";

export const UserCard = ({
  currentUserPage,
  isItMe,
  createNewMessageAndNavigate,
  sendFriendRequest,
}) => {
  const { t } = useTranslation();
  const [userAge, setuserAge] = react.useState(null);

  react.useEffect(() => {
    if (currentUserPage.birthday) {
      setuserAge(calculateAge(JSON.parse(currentUserPage.birthday)));
    }
  }, [currentUserPage]);

  const InfoBox = ({ translationDate, dataItself }) => {
    return (
      <div>
        <span className={styles.littleHeaderCard}>{t(translationDate)}</span>
        <br />
        <span className={styles.dataCard}>{dataItself}</span>
      </div>
    );
  };

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
      </div>

      <InfoBox
        translationDate={"form.name"}
        dataItself={currentUserPage.username}
      />

      {userAge && <InfoBox translationDate={"form.age"} dataItself={userAge} />}

      {currentUserPage.city && (
        <InfoBox
          translationDate={"form.city"}
          dataItself={currentUserPage.city}
        />
      )}

      {currentUserPage.favoriteWriter && (
        <InfoBox
          translationDate={"form.favorite writer"}
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
          <button className="btn btn-light" onClick={sendFriendRequest}>
            {t("profile.add as friend")}
          </button>
        </div>
      )}
    </div>
  );
};
