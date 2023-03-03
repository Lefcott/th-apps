import React, { useContext } from "react";
import styles from "./ListItem.module.css";
import { some, isEqual } from "lodash";
import {
  ListItem,
  ListItemText,
  Grid,
  Hidden,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  MoreVert,
  NotificationsOffOutlined,
  NotificationsOff,
} from "@material-ui/icons";
import { SwipeableItem } from "@k4connect/caregiver-components";
import IconDropdown from "./IconDropdown";
import moment from "moment-timezone";
import { useSnackbar } from "notistack";
import { sendPendoEvent } from "@teamhub/api";
import issueIcon from "../../assets/icons/issue.svg";
import { ResidentContext } from "../ResidentProvider";
import { swipeButtons, listItemOptions } from "../../utilities/data";
import UsersApi from "../../apis/usersApi";
import AlertCounter from "../AlertCounter";
import { useAwayStatusesContext } from "../AwayStatusProvider";

export default function ResidentItem(props) {
  const { resident, active, resOnClick, updateView } = props;
  const Context = useContext(ResidentContext);
  const { enqueueSnackbar } = useSnackbar();
  const { refetchAwayStatuses } = useAwayStatusesContext();
  const isActive = isEqual(active, resident.guid);

  const hasAlertSaved = (alerts = []) =>
    alerts.some((alert) => {
      const audits = alert.AlertsAudits;
      if (
        audits.length === 1 &&
        audits[0].actions.toLowerCase().indexOf("created") > -1
      ) {
        return true;
      }
      return false;
    });

  const markUnread = () => {
    const isAlertSaved = hasAlertSaved(resident.alerts);
    const style = {};
    if (isAlertSaved) {
      style.fontWeight = "bold";
    }
    return style;
  };

  // this function sets the className which determines left border color and width
  const setItemCls = () => {
    let cls = styles.listItem;
    if (isActive) {
      if (resident.alerts && resident.alerts.length > 0 && !resident.optOut) {
        const hasAlert = some(resident.alerts, ["type", "alert"]);
        cls = hasAlert ? styles.statusAlert : styles.statusIssue;
      } else if (resident.optOut) {
        cls = styles.statusOptOutActive;
      } else if (!resident.system) {
        // there is no system
        cls = styles.statusNoSystem;
      } else {
        cls = styles.statusClear;
      }
    }

    if (resident.optOut || !resident.system) {
      cls = `${cls} ${styles.statusOptOut}`;
    }
    return cls;
  };

  const setStatus = () => {
    if (resident.optOut) {
      return "Alerts not active";
    }

    if (!resident.system) {
      return "No System Association";
    }

    if (resident.alerts && resident.alerts.length !== 0) {
      if (resident.alerts.length > 1) {
        return "Alerts";
      }
      if (resident.alerts[0].type === "alert") {
        return "Alert";
      }
      if (resident.alerts[0].type === "issue") {
        return "System Issue";
      }
    } else {
      return resident.system === null ? null : "No Alerts";
    }
  };

  const setAlertIcon = () => {
    const alerts = resident.alerts;
    let icon = null;
    if (alerts && alerts.length) {
      if (isEqual(alerts.length, 1) && isEqual(alerts[0].type, "issue")) {
        icon = (
          <img
            className={styles["listItem-statusIcon"]}
            src={issueIcon}
            alt="status"
          />
        );
      } else {
        const hasTypeAlert = some(alerts, ["type", "alert"]);
        if (hasTypeAlert) {
          icon = (
            <AlertCounter
              style={{ margin: "2px 5px 0 0" }}
              numAlerts={alerts.length}
              type={"error"}
            />
          );
        }
      }
    }
    return icon;
  };

  const lastActivityStr = () => {
    const time = resident.lastActivity;
    const device = resident.lastActivityDevice;

    if (time) {
      const now = moment().format();
      const parsedTime = handleDateString(time);
      const diff = moment.duration(moment(now).diff(moment(parsedTime)));
      const days = parseInt(diff.asDays());
      let hours = parseInt(diff.asHours());
      hours -= days * 24;
      let minutes = parseInt(diff.asMinutes());
      minutes -= days * 24 * 60 + hours * 60;
      let seconds = parseInt(diff.asSeconds());
      seconds -= days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;

      if (days > 0) {
        return `${device} - ${days} days ago`;
      }
      if (hours > 0) {
        return `${device} - ${hours} hours ago`;
      }
      if (minutes > 0) {
        return `${device} - ${minutes} minutes ago`;
      }
      return `${device} - ${seconds} seconds ago`;
    }
    return "--";
  };

  const handleDateString = (str) => {
    const newTime = str.replace("UTC", "Z");
    return newTime;
  };

  const handleAlertDate = () => {
    const alerts = resident.alerts;
    let dateLabel = "Multiple Dates/Times";
    const timezone = resident.timezone;

    if (alerts.length === 1) {
      const alertDate = alerts[0].createdAt;
      const formattedDate = moment
        .tz(alertDate, timezone)
        .format("ddd, MMM D - h:mm A");
      dateLabel = formattedDate;
    } else if (alerts.length === 0) {
      dateLabel = null;
    }
    return dateLabel;
  };

  const markReturned = async () => {
    const { guid, firstName, lastName } = resident;
    const name = `${firstName} ${lastName}`;

    const res = await UsersApi.removeUserStatus({ guid });

    if (res !== "error") {
      enqueueSnackbar(`You have successfully marked ${name} as returned.`);
      const [_, dispatch] = Context;
      dispatch({
        type: "UPDATE_AWAY",
        payload: { ...resident, away: false, statusDates: {} },
      });
    } else {
      enqueueSnackbar(
        `There was an error. Unable to set ${name} as returned.`,
        { variant: "error" }
      );
    }

    refetchAwayStatuses();
    sendPendoEvent("checkin_mark_as_returned");
  };

  // provides a function to the swipeable items depending on their purpose
  const optionClick = (name) => {
    switch (name) {
      case "returned":
        markReturned();
        break;
      default:
        console.error("your swipe button functions did not find a match");
    }
  };

  return (
    <SwipeableItem buttons={swipeButtons[resident.away]} onClick={optionClick}>
      <ListItem
        button
        className={setItemCls()}
        onClick={() => {
          resOnClick(resident);
          updateView();
        }}
        divider
        style={{ height: "100px" }}
      >
        <ListItemText
          primary={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={markUnread()}>{resident.fullName}</span>
              <AwayIndicator resident={resident} />
            </div>
          }
          secondary={
            <>
              <Hidden smDown>
                <span style={{ display: "block" }}>{`Address: ${
                  resident.address ? resident.address : "--"
                }`}</span>
              </Hidden>
              <span
                style={{ display: "block" }}
              >{`Last Activity: ${lastActivityStr()}`}</span>
            </>
          }
        />
        <Grid
          style={{
            textAlign: "right",
            marginRight: !resident.away ? "16px" : "0px",
          }}
        >
          <div className={styles["listItem-alertLabel"]}>
            {setAlertIcon()}
            <Hidden smDown>
              <span className={styles["listItem-header"]} style={markUnread()}>
                {setStatus()}
              </span>
            </Hidden>
          </div>
          {resident.alerts && (
            <Hidden smDown>
              <div className={styles["listItem-subLabel"]}>
                {handleAlertDate()}
              </div>
            </Hidden>
          )}
        </Grid>
        {resident.away && (
          <Hidden smDown>
            <IconDropdown
              id="Rci_residentListItem-snowmanMenu"
              icon={<MoreVert />}
              buttonprops={{ disabled: resident.optOut || !resident.system }}
              menuItems={listItemOptions[resident.away]}
              itemOnClick={(name) => optionClick(name)}
            />
          </Hidden>
        )}
      </ListItem>
    </SwipeableItem>
  );
}

function AwayIndicator({ resident, ...props }) {
  const { away, statusDates, timezone } = resident;
  if (!away) return null;

  const nowTz = moment.tz(moment(), timezone);
  const startTz = statusDates.startDate
    ? moment.tz(statusDates.startDate, timezone)
    : null;

  const endTz = statusDates.endDate
    ? moment.tz(statusDates.endDate, timezone)
    : null;

  if (startTz <= nowTz) {
    // in this case we are within the statusDates range and the user is considered "away"
    // Resident is away [Start Date] - [End Date]
    const start = formatDateIfExists(startTz);
    const end = formatDateIfExists(endTz);

    return (
      <Tooltip
        title={`Resident is away ${start} - ${end ? end : "No End"}`}
        placement="right"
      >
        <div className={styles["listItem__away__container"]}>
          <NotificationsOff fontSize="small" alt="away" color="primary" />
          <Typography color="primary" variant="caption">{`Away ${
            end ? `until ${end}` : "indefinitely"
          }`}</Typography>
        </div>
      </Tooltip>
    );
  } else if (startTz >= nowTz) {
    // in this case away dates have been set, but we are prior to them
    const start = formatDateIfExists(startTz);
    const end = formatDateIfExists(endTz);
    return (
      <Tooltip
        title={`Resident will be away ${start} - ${end ? end : "No End"}`}
        placement="right"
      >
        <div className={styles["listItem__away__container"]}>
          <NotificationsOffOutlined
            fontSize="small"
            alt="away"
            color="disabled"
          />
          <Typography
            color="textSecondary"
            variant="caption"
          >{`Away starting ${start}`}</Typography>
        </div>
      </Tooltip>
    );
  }
}

function formatDateIfExists(date) {
  return date ? date.format("MMM Do") : null;
}
