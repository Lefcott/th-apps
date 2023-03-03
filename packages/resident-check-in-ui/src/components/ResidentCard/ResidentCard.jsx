import React, { useRef } from "react";
import styles from "./ResidentCard.module.css";
import moment from "moment-timezone";
import { AlertTitle } from "@material-ui/lab";
import { List, Grid, Avatar, Hidden } from "@material-ui/core";
import { isEmpty, includes } from "lodash";
import noAlertPlaceholder from "../../assets/icons/no_alert_placeholder.svg";
import noSystemPlaceholder from "../../assets/icons/no_system_placeholder.svg";
import { useResidentContext } from "../ResidentProvider";
import AlertItem from "../AlertItem";
import {
  CardPlaceholder,
  CardNoSelectedResident,
} from "../../assets/placeholders/placeholders";
import { findMatchingAlert } from "../../utilities/helper";
import ResidentForm from "../ResidentForm/ResidentForm";
import residentAway_white from "../../assets/icons/residentAway_white.svg";
import AlertCounter from "../AlertCounter";
import CardButtons from "./CardButtons";
import StatusLogs from "./StatusLogs";
import CustomAlert from "../CustomAlert";

// display messages
const NO_ALERT_MESSAGE = "There are no alerts for this resident";
const NO_SYSTEM_MESSAGE = "No system associated with this resident";
const OPT_OUT_MESSAGE = "Alerts are not active for this resident";

export default function ResidentCard({ updateView }) {
  const [activeAlert, setActiveAlert] = React.useState();
  const [rState] = useResidentContext();

  function onAlertSelect(alert) {
    setActiveAlert(alert);
  }

  function backToMenu() {
    setActiveAlert();
  }

  // want to store the last user;
  const lastUser = useRef();


  React.useEffect(() => {
    if (rState.selectedResident) {
      if (rState.selectedResident.alerts.length === 1) {
        // show single alert if only use has 1
        setActiveAlert(rState.selectedResident.alerts[0]);
      } else if (rState.selectedResident.alerts.length > 1) {
        // show menu if there are more than 2 alerts
        setActiveAlert();
      }
      lastUser.current = rState.selectedResident;
    }
  }, [rState.selectedResident]);

  const { selectedResident } = rState;

  if (selectedResident) {
    return (
      <>
        <CardHeader
          selectedResident={selectedResident}
          activeAlert={activeAlert}
        />
        <CardAlertContainer
          selectedResident={selectedResident}
          activeAlert={activeAlert}
        />

        {selectedResident.alerts.length > 0 && (
          <Grid item className={styles["resCard__formWrapper"]}>
            {activeAlert ? (
              <ResidentForm
                resident={selectedResident}
                alert={activeAlert}
                onAlertSelect={onAlertSelect}
                backToMenu={backToMenu}
              />
            ) : (
              <Grid className={styles["resCard__alertList"]}>
                <h3 style={{ fontWeight: "normal" }}>Alerts</h3>
                <List>
                  {selectedResident.alerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      data={alert}
                      onAlertSelect={onAlertSelect}
                    />
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        )}
        <Hidden mdUp>
          <CardButtons updateView={updateView} />
        </Hidden>

        {!selectedResident.alerts.length && (
          <div className={styles["resCard__imgWrapper"]}>
            <img
              src={
                selectedResident.system
                  ? noAlertPlaceholder
                  : noSystemPlaceholder
              }
              alt="no alerts"
            />
          </div>
        )}

        <StatusLogs resident={selectedResident} />
      </>
    );
  }
  return (
    <div style={{ flex: "1 1 auto", height: "100%", width: "100%" }}>
      {/* note that we want the optimistic ui to show up when the page is loading, but any other case we want the empty state placeholder */}
      {rState.userData?.length < 1 ? (
        <CardPlaceholder />
      ) : (
        <CardNoSelectedResident />
      )}
    </div>
  );
}

/** ***********************************************************
 * Presentational components used exclusively by Resident Card
 ************************************************************ */

function CardAlertContainer(props) {
  function handleAlertDate(alert = {}, resident = {}) {
    let dateLabel = "Multiple Dates/Times";
    const { timezone } = resident;
    if (alert && resident.alerts.find((resAlert) => resAlert.id === alert.id)) {
      const alertDate = alert.createdAt;
      const formattedDate = moment
        .tz(alertDate, timezone)
        .format("ddd, MMM D - h:mm A");
      dateLabel = formattedDate;
    }
    return dateLabel;
  }

  function handleAlertsMessage(resident = {}) {
    const { system, alerts, optOut } = resident;

    if (optOut) {
      return OPT_OUT_MESSAGE;
    }

    if (!system) {
      return NO_SYSTEM_MESSAGE;
    }

    return alerts.length > 0 ? processAlertMessage() : NO_ALERT_MESSAGE;
  }

  function processAlertMessage() {
    const { activeAlert } = props;
    if (isEmpty(activeAlert)) {
      return "Unresolved alerts for this resident.";
    }

    return activeAlert.description;
  }

  const setStatus = (resident, alerts, activeAlert) => {
    if (!resident.system || resident.optOut) {
      return "dark";
    }

    // menu case
    if (alerts.length >= 1 && !activeAlert) {
      const hasAlert = alerts.some((item) => item.type === "alert");
      if (hasAlert) {
        return "error";
      }
      return "warning";
    }

    if (activeAlert && findMatchingAlert(activeAlert.id, resident.alerts)) {
      if (activeAlert.type === "alert") {
        return "error";
      }
      return "warning";
    }
    return "success";
  };

  const { selectedResident, activeAlert } = props;
  const status = setStatus(
    selectedResident,
    selectedResident.alerts,
    activeAlert
  );

  const areThereManyAlerts =
    selectedResident.alerts && selectedResident.alerts.length > 0;
  return (
    <Grid container className={styles["resCard__alertContainer"]}>
      <CustomAlert
        color={status}
        severity={status}
        overlap
        icon={
          areThereManyAlerts && !activeAlert ? (
            <AlertCounter
              type={status}
              numAlerts={selectedResident.alerts.length}
            />
          ) : undefined
        }
      >
        <AlertTitle style={{ fontWeight: "bold", fontSize: "12px" }}>
          {handleAlertsMessage(selectedResident)}
        </AlertTitle>
        {areThereManyAlerts
          ? handleAlertDate(activeAlert, selectedResident)
          : null}
      </CustomAlert>
    </Grid>
  );
}

function CardHeader(props) {
  const { selectedResident } = props;
  // if no image exists, we insert initials
  const handleImageInitials = () => {
    const { firstName, lastName } = selectedResident;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  function setPriorityStatus(alerts) {
    const alertCollection = alerts
      .filter((alert) => alert.status === "active")
      .map((alert) => alert.type);
    // if we got no alerts, well, return noAlert
    if (alertCollection.length === 0) {
      return "noAlert";
    }
    const issue = alertCollection.indexOf("issue") > -1;
    const alert = alertCollection.indexOf("alert") > -1;

    if (alert) {
      return "alert";
    }
    if (!alert && issue) {
      return "issue";
    }
  }

  // set the header gradient
  function setGradient() {
    if (!selectedResident.system) {
      return styles.noSystem;
    }

    if (selectedResident.optOut) {
      return styles.optOut;
    }

    const status = setPriorityStatus(selectedResident.alerts);

    switch (status) {
      case "alert":
        return styles.alertAct;
      case "issue":
        return styles.issue;
      default:
        return styles.none;
    }
  }

  return (
    <Grid container className={`${styles.resCard__row} ${setGradient()}`}>
      <Grid className={styles["resCard__imgContainer"]} item xs={4} sm={4}>
        <Avatar
          src={selectedResident.profileUrl}
          className={styles["resCard__img"]}
          alt="resident"
        >
          {handleImageInitials()}
        </Avatar>
      </Grid>
      <Grid item xs={8} sm={8}>
        <div className={styles["resCard__name"]}>
          {selectedResident.fullName ? selectedResident.fullName : null}
          <img
            src={selectedResident.away ? residentAway_white : ""}
            className={styles["resCard__awayIcon"]}
            alt="icon status"
          />
        </div>
        <div className={styles["resCard__info"]}>
          {selectedResident.address
            ? `Address: ${selectedResident.address}`
            : null}
        </div>
        <div className={styles["resCard__info"]}>
          <a
            className={styles["browser-link"]}
            href={`tel: ${
              selectedResident.phone ? selectedResident.phone : null
            }`}
          >
            {selectedResident.phone ? `Phone: ${selectedResident.phone}` : null}
          </a>
        </div>
        <div className={styles["resCard__info"]}>
          <a
            className={styles["browser-link"]}
            href={`mailto: ${
              selectedResident.email ? selectedResident.email : null
            }`}
          >
            {selectedResident.email &&
            !includes(selectedResident.email, "@k4connect.private")
              ? `Email: ${selectedResident.email}`
              : null}
          </a>
        </div>
      </Grid>
    </Grid>
  );
}
