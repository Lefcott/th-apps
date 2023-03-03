import moment from "moment-timezone";
import alert from "../assets/icons/alert.svg";
import issue from "../assets/icons/issue.svg";

export function findMatchingAlert(alertId, alertsArr) {
  return alertsArr.find((alert) => alert.id === alertId);
}

/* Bootstrap alignment with our status colors */
/* Bootstrap colors
-Primary(blue)
-Secondary(dark grey)
-Success(green)
-Info(teal)
-Warning(yellow) = Alert / System Issue / Priority 2
-Danger(red) = Alert / No Activity / Priority 1
 */

const setIcon = (status) => {
  switch (status) {
    case "alert":
      return alert;
    case "issue":
      return issue;
    default:
      return "";
  }
};

function isOverlapping(awayStatus, startDate, endDate) {
  const awayStartDate = moment(awayStatus.startDate);
  const awayEndDate = awayStatus.endDate ? moment(awayStatus.endDate) : null;

  if (!endDate && !awayEndDate) {
    return true;
  } else if (!endDate) {
    return startDate.isBefore(awayEndDate);
  } else if (!awayEndDate) {
    return awayStartDate.isBefore(endDate);
  } else {
    return (
      startDate.isBetween(awayStartDate, awayEndDate) ||
      awayStartDate.isBetween(startDate, endDate, null, "[]")
    );
  }
}

function getAwayReasonLabel(name) {
  switch (name) {
    case "vacation":
      return "Vacation";
    case "transferred":
      return "Transferred";
    case "withFamily":
      return "With Family";
    case "other":
      return "Other";
    default:
      return name;
  }
}

export { setIcon, isOverlapping, getAwayReasonLabel };
