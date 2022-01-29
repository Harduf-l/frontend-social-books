import React from "react";
import FriendList from "../homePageUser/FriendsList";
import styles from "./profilePage.module.css";
import { useTranslation } from "react-i18next";
import LoadingFriendSkeleton from "./LoadingFriendSkeleton";
function ContentProfilePage({
  currentUserPage,
  approvedFriends,
  userId,
  loadingFriends,
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div
        style={{
          backgroundColor: "#eeedec",
          padding: "5px 10px 10px 10px",
        }}
      >
        {currentUserPage.freeText && (
          <div>
            <span className={styles.littleHeaderCard}>
              {t("form.freeText")}
            </span>
            <p>{currentUserPage.freeText}</p>
          </div>
        )}

        {currentUserPage.writingDescription && (
          <div>
            <span className={styles.littleHeaderCard}>
              {t("form.writingDescription")}
            </span>
            <p>{currentUserPage.writingDescription}</p>
          </div>
        )}
      </div>
      <div className="row pt-3" style={{ height: 180 }}>
        <div className="col-12 col-md-6">
          <h5 className={styles.mainMiddleHeader}>
            {t("profile.in my book list")}
          </h5>
          {true &&
            currentUserPage.username +
              " " +
              t("profile.didnt add books to list")}
        </div>
        <div className="col-12 col-md-6">
          <h5 className={styles.mainMiddleHeader}>
            {t("profile.last comments")}
          </h5>
          {true && t("profile.didnt write comments")}
        </div>
      </div>
      <div>
        <h6 className={styles.mainMiddleHeader}>{t("profile.my friends")}</h6>
        {loadingFriends && <LoadingFriendSkeleton />}
        {!loadingFriends && approvedFriends.length > 0 && (
          <div>
            <FriendList userFriends={approvedFriends} userId={userId} />
          </div>
        )}
        {!loadingFriends && approvedFriends.length === 0 && (
          <div>
            {currentUserPage.username +
              " " +
              t("profile.didnt add friends to list")}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentProfilePage;
