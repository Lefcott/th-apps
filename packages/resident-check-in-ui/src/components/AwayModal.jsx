import React, { useReducer } from "react";
import { Box, Button, MenuItem, TextField } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useSnackbar } from "notistack";
import moment from "moment-timezone";
import { NotificationsOff } from "@material-ui/icons";
import { isEmpty } from "lodash";
import { useMutation } from "@teamhub/apollo-config";
import { sendPendoEvent } from "@teamhub/api";
import { SecondaryAlertItem } from "./AlertItem";
import DateSelector from "./DateSelector";
import Dialog from "./Dialog";
import { FormDropdown } from "./reusableComponents";
import { useResidentContext } from "./ResidentProvider";
import alertsApi from "../apis/alertsApi";
import { ADD_AWAY_STATUS, UPDATE_AWAY_STATUS } from "../graphql/residents";
import { getOneSearchParam } from "../utilities/url";
import { isOverlapping } from "../utilities/helper";

// essentially recreating this.setState from classes components here for useReducer
const reducer = (oldState, newState) => ({ ...oldState, ...newState });

function AwayModal(props) {
  const { resident, awayStatus, editing, refetch, awayStatuses } = props;
  const { enqueueSnackbar } = useSnackbar();
  const communityId = getOneSearchParam("communityId", "2476");

  const [state, setState] = useReducer(reducer, {
    startDate: awayStatus?.startDate
      ? moment.tz(awayStatus.startDate, resident.timezone).startOf("day")
      : moment().startOf("day"),
    endDate: awayStatus?.endDate
      ? moment.tz(awayStatus.endDate, resident.timezone).endOf("day")
      : null,
    notes: awayStatus?.notes,
    reason: awayStatus?.reason,
    loading: false,
  });

  const [, , , refetchResidents] = useResidentContext();
  const setDates = (dates) => {
    setState({
      startDate: moment(dates[0]),
      endDate: dates[1] ? moment(dates[1]).endOf("day") : dates[1],
    });
  };

  const [updateAwayStatus] = useMutation(UPDATE_AWAY_STATUS, {
    async onCompleted(data) {
      await onUpdateSuccess(data);
    },
    async onError(err) {
      await onUpdateError(err);
    },
  });

  const onUpdateSuccess = async () => {
    await Promise.all([refetch(), refetchResidents()]);
    const startDate = moment.tz(state.startDate, resident.timezone);
    const start = startDate.format("MMM D");
    let endDate;
    if (state.endDate) {
      endDate = moment.tz(state.endDate, resident.timezone);
    }
    if (!endDate) {
      enqueueSnackbar(
        `You have successfully marked ${resident.fullName} away from ${start} indefinitely.`
      );
    } else {
      const end = moment.tz(endDate, resident.timezone).format("MMM D YYYY");
      enqueueSnackbar(
        `You have successfully marked ${resident.fullName} away from ${start} to ${end}.`
      );
    }

    setState({ loading: false });
    closeModal();
  };

  const onUpdateError = () => {
    setState({ loading: false });
    enqueueSnackbar(
      `There was an error. Away dates were not set for ${resident.fullName}.`,
      { variant: "error" }
    );
  };

  const [addAwayStatus] = useMutation(ADD_AWAY_STATUS, {
    async onCompleted(data) {
      await onAddSuccess(data);
    },
    async onError(err) {
      await onAddError(err);
    },
  });

  const onAddSuccess = async () => {
    await Promise.all([refetch(), refetchResidents()]);
    setState({ loading: false });
    closeModal();
    const startDate = moment.tz(state.startDate, resident.timezone);
    const start = startDate.format("MMM D");
    let endDate;
    if (state.endDate) {
      endDate = moment.tz(state.endDate, resident.timezone);
    }
    if (!endDate) {
      enqueueSnackbar(
        `You have successfully marked ${resident.fullName} away from ${start} indefinitely.`
      );
    } else {
      const end = moment.tz(endDate, resident.timezone).format("MMM D YYYY");
      enqueueSnackbar(
        `You have successfully marked ${resident.fullName} away from ${start} to ${end}.`
      );
    }
  };

  const onAddError = () => {
    setState({ loading: false });
  };

  async function bulkResolveAlerts() {
    const alerts = resident.alerts;
    const { notes } = state;
    const numAlerts = alerts.length;

    const alertsToResolve = alerts.map(async (alert) => {
      const { id } = alert;

      const alertData = {
        status: "cleared",
        notes: notes && notes.length > 0 ? notes : undefined,
        actions: JSON.stringify({ "Resident Away": true }),
      };
      return await alertsApi.putAlerts(id, alertData);
    });

    const results = await Promise.all(alertsToResolve);
    const error = results.indexOf("error") !== -1;

    if (!error) {
      enqueueSnackbar(
        `You've resolved ${numAlerts} errors for ${resident.fullName}`
      );
      return "success";
    }
    enqueueSnackbar(`Unable to resolve alerts for ${resident.fullName}`, {
      variant: "error",
    });
    return "failed";
  }

  /**
   * When the selected resident has alerts, this function is called to both resolve all alerts and
   * set the resident away. This takes advantage of the existing setAway function to set away, and the bulkResolveAlerts
   * in this file.
   *
   * @param {Object} resident
   */
  async function setAwayAndResolve(resident) {
    setState({ loading: true });
    // alertResolution will be 'success' or 'failed
    const alertResolution = await bulkResolveAlerts();
    if (alertResolution === "failed") {
      // don't do anything if it failed
      setState({ loading: false });
    } else {
      const updatedResident = { ...resident, alerts: [] };
      // set away
      // pass the updated resident to onSaveAway so that the user data is
      // consistent between UPDATE_RESIDENT and the UPDATE_AWAY dispatch
      // inside of onSaveAway.
      onSaveAway(updatedResident);
      // update resident, and toggle showAlerts
    }
  }

  async function onSaveAway(resident) {
    setState({ loading: true });
    const { guid } = resident;
    const overlap = awayStatuses.find((awayStatus) =>
      isOverlapping(awayStatus, state.startDate, state.endDate)
    );

    if (overlap) {
      setState({ loading: false });
      enqueueSnackbar(
        `These dates cannot be saved because they overlap existing away dates.`,
        { variant: "error" }
      );
      return;
    }

    sendPendoEvent("checkin_add_away_date_save");

    const startDate = moment.tz(state.startDate, resident.timezone).format();
    const endDate = state.endDate
      ? moment.tz(state.endDate, resident.timezone).format()
      : null;

    addAwayStatus({
      variables: {
        communityId,
        residentId: guid,
        startDate,
        endDate,
        notes: state.notes,
        reason: state.reason,
      },
    });
  }

  function onUpdateAway(resident, awayStatus) {
    setState({ loading: true });
    const { guid } = resident;

    const otherAwayStatuses = awayStatuses.filter(
      (item) => item.id !== awayStatus.id
    );
    const overlap = otherAwayStatuses.find((otherAwayStatus) =>
      isOverlapping(otherAwayStatus, state.startDate, state.endDate)
    );

    if (overlap) {
      setState({ loading: false });
      enqueueSnackbar(
        `These dates cannot be saved because they overlap existing away dates.`,
        { variant: "error" }
      );
      return;
    }

    sendPendoEvent("checkin_edit_away_date_save");

    const startDate = moment.tz(state.startDate, resident.timezone).format();
    const endDate = state.endDate
      ? moment.tz(state.endDate, resident.timezone).format()
      : null;

    updateAwayStatus({
      variables: {
        communityId,
        id: awayStatus.id,
        residentId: guid,
        startDate,
        endDate,
        reason: state.reason,
        notes: state.notes,
      },
    });
  }

  function closeModal() {
    setState({
      notes: "",
      reason: null,
      endDate: resident.statusDates.endDate
        ? moment(resident.statusDates.endDate).endOf("date")
        : null,
    });
    props.close();
  }

  function handleSave() {
    if (editing) {
      onUpdateAway(resident, awayStatus);
    } else {
      onSaveAway(resident);
    }
  }

  function handleCancel() {
    sendPendoEvent("checkin_add_away_date_cancel");
    closeModal();
  }

  const content = (
    <div>
      <DateSelector
        style={{ marginBottom: "30px" }}
        startDate={state.startDate}
        minStartDate={moment()}
        endDate={state.endDate}
        handler={setDates}
      />
      <Box mb={1.5}>
        <FormDropdown
          name="reason"
          label="Reason"
          id="Rci_residentAwayReason-input"
          value={state.reason}
          onChange={(e) => setState({ reason: e.target.value })}
        >
          <MenuItem value="vacation">Vacation</MenuItem>
          <MenuItem value="transferred">Transferred</MenuItem>
          <MenuItem value="withFamily">With Family</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </FormDropdown>
      </Box>
      <Box mb={1}>
        <TextField
          id="Rci_residentAwayModal-notes"
          multiline
          label="Notes"
          fullWidth
          rows={2}
          placeholder="Enter your notes here. They will be applied to each alert"
          value={state.notes}
          onChange={(e) => setState({ notes: e.target.value })}
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 150 }}
        />
      </Box>
    </div>
  );

  return (
    <Dialog
      fullScreen={useMediaQuery("(max-width: 960px)")}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <span>{resident.firstName}'s Away Dates</span>
          <NotificationsOff style={{ marginLeft: "5px" }} color="primary" />
        </div>
      }
      id="Rci_residentAwayModal"
      onClose={props.close}
      open={props.isOpen}
      content={content}
      contentStyle={{ flex: 1 }}
      actions={
        <>
          <Button
            id="Rci_residentAwayModal-cancelBtn"
            color="primary"
            variant="outlined"
            onClick={handleCancel}
            disabled={state.loading}
          >
            Cancel
          </Button>
          <Button
            id="Rci_residentAwayModal-saveBtn"
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={state.loading}
          >
            Save
          </Button>
        </>
      }
    />
  );
}

export default AwayModal;
