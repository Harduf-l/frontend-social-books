import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";
function Footer() {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-center mt-2">
      <span className={styles.logoSign}>©BookMe</span>
    </div>
  );
}

export default Footer;
