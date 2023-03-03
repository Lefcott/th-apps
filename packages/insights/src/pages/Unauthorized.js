import React from "react";
import charts from "../utils/images/charts.svg";
import styles from "../index.css";
function Unauthorized() {
  return (
    <div className={styles["EI_requestInfo"]}>
      <img src={charts} alt="charts" />
      <div style={{ maxWidth: 800 }}>
        <div className={styles["EI_requestInfo-header"]}>
          NEW Event Insights!
        </div>
        <div className={styles["EI_requestInfo-body"]}>
          Designated staff members in your community can now access valuable,
          actionable event insights to keep informed on important event and
          resident attendance information specific to your community.
        </div>
        <div className={styles["EI_requestInfo-label"]}>
          Interested in learning more?
        </div>
        <div
          className={styles["EI_requestInfo-label"]}
          style={{ color: "#4c43db" }}
        >
          Contact Member Support: (855) 876-9673 or support@k4connect.com
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
