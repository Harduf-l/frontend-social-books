import { useState } from "react";
import FriendList from "../homePageUser/FriendsList";
import styles from "./profilePage.module.css";
import { useTranslation } from "react-i18next";
import LoadingFriendSkeleton from "./LoadingFriendSkeleton";
import { EditUserContentModal } from "../modals/EditUserContentModal";

function ContentProfilePage({
  isItMe,
  currentUserPage,
  approvedFriends,
  userId,
  loadingFriends,
}) {
  const { t } = useTranslation();

  const [ShowEditFreeTextUserModal, setShowEditFreeTextUserModal] =
    useState(false);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#eeedec",
          padding: "10px",
        }}
      >
        {isItMe && (
          <div
            style={{
              fontSize: 10,
              color: "#f4b556",
              textDecoration: "underline",
              paddingBottom: 5,
              display: "flex",
              justifyContent: "end",
              cursor: "pointer",
            }}
            onClick={() => setShowEditFreeTextUserModal(true)}
          >
            {t("profile.edit details")}
          </div>
        )}
        {ShowEditFreeTextUserModal && (
          <EditUserContentModal
            freeText={currentUserPage.freeText}
            amIwritingText={currentUserPage.writingDescription}
            email={currentUserPage.email}
            handleClose={() => setShowEditFreeTextUserModal(false)}
            open={ShowEditFreeTextUserModal}
          />
        )}
        {currentUserPage.freeText && (
          <div>
            <span className={styles.littleHeaderCard}>
              {t("form.freeText")}
            </span>
            <p style={{ whiteSpace: "pre-line" }}>{currentUserPage.freeText}</p>
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
