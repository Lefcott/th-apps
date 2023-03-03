import React from 'react';
import styles from './ResidentForm.module.css';
import {
  Button, FormLabel, RadioGroup, FormControl, TextField, Hidden, Grid
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import {
  reject, pickBy, identity, isEqual
} from 'lodash';
import { useResidentContext } from '../ResidentProvider';
import commentLines from '../../assets/icons/commentLines.svg';
import RadioButton from '../RadioButton';
import AuditNotes from '../AuditNotes/AuditNotes';
import ToastUndo from '../ToastUndo/ToastUndo';
import { defaultAlertActions } from '../../mockData';
import alertsApi from '../../apis/alertsApi';
import { useUndoContext } from '../UndoContext';

const activeStatus = 'active';
const clearedStatus = 'cleared';

export default function ResidentForm(props) {
  const [state, setState] = React.useReducer((oldS, newS) => ({ ...oldS, ...newS, }), {
    notes: '',
    actions: [],
    postedAlert: null,
    saveDisable: true,
    resolveDisable: true,
  });

  const { undoAlert, setUndoAlert, } = useUndoContext();

  const [residentState, dispatch, searchFilterSort] = useResidentContext();
  // we want to store the last alert here
  const lastAlert = React.useRef();
  const lastResident = React.useRef();
  const resForm = React.useRef();
  const { enqueueSnackbar } = useSnackbar();

  function populateForm(checkboxes = defaultAlertActions, alert, undoAlert = {}) {
    if (checkboxes.length === 0) {
      setState({ actions: actions.map(item => ({ ...item, check: false, })), });
      return [];
    }

    // checkboxes at this state are a series of names
    // we filter to remove any undefined/null values at the end
    let actions = checkboxes.map(name => ({
      name,
      check: undoAlert && undoAlert.formActions ? undoAlert.formActions[name] : false,
      visible: true,
      type: alert.type,
    })).filter(ident => ident);

    // now set the actions, and the notes if they exist
    setState({
      actions,
      notes: undoAlert.notes || '',
    });
  }

  function updateForm(res) {
    const { actions, } = state;
    const { resident, alert, } = props;

    const currAlert = resident.alerts.find(item => item.id === alert.id);

    currAlert.AlertsAudits.unshift(res.audit);
    actions.forEach(item => item.check = false);
    setState({ notes: '', });
  }

  function onRadioClick(val) {
    const actions = state.actions.map((a) => { a.name === val ? a.check = true : a.check = false; return a; });
    setState({ actions, resolveDisable: false, });
  }

  function clearRadioClick() {
    setState({
      actions: state.actions.map((action) => {
        action.check = false;
        return action;
      }),
      resolveDisable: true,
    });
  }

  async function saveForm(resident) {
    setUndoAlert();

    const { actions, notes, } = state;
    const { alert, } = props;
    const actionsFromForm = JSON.stringify(actions.reduce((result, current) => {
      result[current.name] = current.check;
      return result;
    }, {}));

    const formData = pickBy({
      status: activeStatus,
      notes,
      actions: actionsFromForm,
    }, identity);

    const res = await alertsApi.putAlerts(alert.id, formData);

    if (res !== 'error') {
      enqueueSnackbar('You have successfully saved your changes.');
      updateForm(res);
      dispatch({ type: 'UPDATE_RESIDENT', payload: resident, });
      if (resident.alerts.length > 1) {
        props.backToMenu();
      } else {
        goToNextUser(residentState.selectedResident, residentState.filteredList);
      }
    } else {
      enqueueSnackbar('Unable to successfully save your changes.', { variant: 'error' });
    }
  }

  // update list and user (function coming from residentProvider)
  // set timer + toast

  async function resolveForm(resident) {
    // grab current alert out of props, as well as form submissions
    setUndoAlert();
    const { actions, notes, } = state;
    const { alert, } = props;

    // 1.) format our form actions into an object
    const formActions = actions.reduce((result, current) => {
      result[current.name] = current.check;
      return result;
    }, {});

    // 2.) update the undo context to hold the full alert, form data ready for submission, and the resident themselves
    const newAlert = {
      ...alert, formActions, notes, resId: resident.guid,
    };
    setUndoAlert(newAlert);

    // format form submission data;
    const formData = pickBy({
      status: clearedStatus,
      notes,
      actions: JSON.stringify(formActions),
    }, identity);
    const timer = createTimer({
      alert: newAlert, resident, formData, notes,
    });


    // update state of list and users
    updateUsersAndList(resident, resident.system, alert);
    // 3.) showUndoToasts triggers the toast(s) and also determines the next card state
    // we pass the timer here so that it is clearable later in the undoAlertPost function
    // show the timers
    showUndoToasts(resident.system, alert, timer);
  }

  function updateUsersAndList(currRes, system, alert) {
    // for this particular user, collect the remaining alerts
    const remainingAlerts = reject(resident.alerts, dataAlert => dataAlert.id === alert.id);

    // get index of curr user in list
    const currUserIndex = residentState.filteredList.map(res => res.guid).indexOf(currRes.guid);

    // update our list (using userData since that's our source of truth);
    // we'll use this to determine who the right next resident is, and
    const updatedResidentList = residentState.userData.map((resident, index) => {
      if (resident.system === system) {
        return { ...resident, alerts: resident.alerts.filter(resAlert => resAlert.id !== alert.id), };
      }

      return resident;
    });


    const filteredList = searchFilterSort(updatedResidentList, residentState.filters, residentState.searchTerm);

    if (remainingAlerts > 1) {
      // in this case we still have more alerts, so we go back to menu
      props.backToMenu();
      dispatch({ type: 'UPDATE_RESIDENT', payload: updatedResidentList[currUserIndex], });
    } else {
      // if we are less than 1 alert, we need to go to the next user
      // we want to find the next resident in the list that has alerts
      // let nextResident = updatedResidentList.slice(currUserIndex).find(resident => resident.alerts.length > 0);
      let nextResident = filteredList[currUserIndex];

      if (!nextResident) {
        nextResident = filteredList[filteredList.length - 1];
      }

      dispatch({ type: 'CLEAR_RESIDENT', payload: { userData: updatedResidentList, filteredList, selectedResident: nextResident, }, });
    }
  }

  // this function handles
  function showUndoToasts(system, alert, timer) {
    // get the remaining alerts for the selectedUser
    const remainingAlerts = reject(resident.alerts, dataAlert => dataAlert.id === alert.id);

    const sameSysUsers = residentState.userData.filter(user => user.system === system);
    sameSysUsers.forEach((user) => {
      // update each resident in the list
      const message = `You have successfully resolved the alert for ${user.fullName}`;

      // display the toast, with the formatted message and
      enqueueSnackbar(<ToastUndo message={message} undoOnClick={() => undoAlertPost(alert, remainingAlerts, sameSysUsers, timer)} />);
    });
  }

  // this is the onclick event function passed to the toast
  async function undoAlertPost(alert, remainingAlerts, users, timer) {
    users.forEach((user) => {
      dispatch({ type: 'UPDATE_RESIDENT', payload: { ...user, alerts: [...remainingAlerts, alert], }, });
    });

    clearTimeout(timer);

    await dispatch({ type: 'SELECT_RESIDENT', payload: residentState.selectedResident, });

    props.onAlertSelect(alert);
  }

  // Creates and returns a timer.
  function createTimer({ alert, resident, formData, }) {
    const timer = setTimeout(async () => {
      const res = await alertsApi.putAlerts(alert.id, formData);
      if (res === 'error') {
        enqueueSnackbar(`Unable to resolve the alert for ${resident.fullName}`, { variant: 'error' });
      }
    }, 5000);
    return timer;
  }

  // this is called in the case of save, rather than resolve
  function goToNextUser(selectedResident, list) {
    const indexOfRes = list.map(item => item.guid).indexOf(selectedResident.guid);

    const nextResident = list[indexOfRes + 1];
    // if no resident, we show empty state
    if (!nextResident && list.length === 0) {
      return dispatch({ type: 'SELECT_RESIDENT', payload: null, });
    }

    if (nextResident) {
      return dispatch({ type: 'SELECT_RESIDENT', payload: nextResident, });
    }
  }

  React.useEffect(() => {
    if (!isEqual(lastAlert.current, props.alert) || !isEqual(props.resident, lastResident.current)) {
      lastResident.current = props.resident;
      lastAlert.current = props.alert;
      if (undoAlert && undoAlert.id === props.alert.id) {
        populateForm(props.alert.actions, props.alert, undoAlert);
      } else {
        populateForm(props.alert.actions, props.alert);
      }

      resForm.current.scrollTop = 0;
    }
  }, [props.alert, props.resident]);


  const { resident, backToMenu, alert, } = props;

  // disabled button cases
  const saveButtonDisabled = !state.actions.find(action => action.check) && state.notes.length === 0;
  const resolveButtonDisabled = !state.actions.find(action => action.check);

  return (
    <>
      <Grid item className={styles["resForm__wrapper"]} ref={resForm}>
        {resident.alerts.length > 0 && (
          <FormControl className={styles["resForm__form"]}>
            <FormLabel>
              <span className={styles["resForm__label"]}>Options</span>
              <span className={styles["resForm__clearSelector"]} id="Rci_residentAlertForm-clearSelection" onClick={clearRadioClick}>Clear Selection</span>
            </FormLabel>
            <RadioGroup name="alertOptions">
              {state.actions.map((action, i) => <RadioButton className={styles["Rci_residentAlertForm-radioOption"]} key={i} name={action.name} checked={action.check} onChange={onRadioClick} />)}
            </RadioGroup>
            <FormLabel style={{ marginTop: 20, }}>
              <span className={styles["resForm__label"]}>Notes</span>
              <img className={styles["resForm__labelIcon"]} src={commentLines} alt="notes" />
            </FormLabel>
            <AuditNotes resident={resident} alert={alert} />
            <Hidden only={['xs', 'sm', 'md']}>
              <TextField id="Rci_residentAlertForm-notes" variant="outlined" multiline rows={2} placeholder="Enter your notes here" value={state.notes} onChange={e => setState({ notes: e.target.value, })} />
            </Hidden>
            <Hidden only={['lg', 'xl']}>
              <TextField id="Rci_residentAlertForm-notes" variant="outlined" multiline rows={2} placeholder="Enter your notes here" value={state.notes} onClick={(e) => { window.scrollTo(0, e.pageY); }} onChange={e => setState({ notes: e.target.value, })} />
            </Hidden>
          </FormControl>
        )}

        <Grid container className={styles["resForm--buttonsContainer"]}>
          {resident.alerts.length > 1 && (
            <Button
              id="Rci_residentAlertForm-cancelBtn"
              color="default"
              variant="outlined"
              onClick={() => backToMenu()}
            >
              Cancel
            </Button>
          )}
          <Button
            id="Rci_residentAlertForm-saveBtn"
            color="secondary"
            variant="outlined"
            onClick={() => saveForm(resident)}
            disabled={saveButtonDisabled}
          >
            Save
          </Button>
          <Button
            id="Rci_residentAlertForm-resolveBtn"
            color="secondary"
            variant="contained"
            onClick={() => resolveForm(resident)}
            disabled={resolveButtonDisabled}
          >
            Save & Resolve
          </Button>
        </Grid>
      </Grid>
      
    </>
  );
}
