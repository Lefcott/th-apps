/** @format */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { differenceWith, isEqual } from 'lodash';
import { sendPendoEvent } from '@teamhub/api';
import { useMutation } from '@teamhub/apollo-config';
import { showToast, showErrorToast } from '@teamhub/toast';

import strings from '../../constants/strings';
import { FormCheckbox } from '../../utils/formComponents';
import {
  ActionsContainer,
  CheckboxContainer,
  DropdownButton,
  DropdownAction,
} from '../styleUtils';
import { getOneSearchParam } from '../../utils/url';
import { DELETE_EVENT, UPDATE_EVENT } from '../../graphql/events';

const eventDelete = {
  label: strings.Event.actions.deleteEvent,
  action: 'delete',
};
const eventArchive = {
  label: strings.Event.actions.archiveEvent,
  action: 'archive',
};
const seriesDelete = {
  label: strings.Event.actions.deleteSeries,
  action: 'delete',
};
const seriesArchive = {
  label: strings.Event.actions.archiveSeries,
  action: 'archive',
};
const saveDraft = {
  label: strings.Event.actions.saveDraft,
  action: 'saveDraft',
};
const stateActionMap = {
  forward: [saveDraft, seriesDelete, seriesArchive],
  single: [saveDraft, eventDelete, eventArchive],
  all: [saveDraft, eventDelete, eventArchive],
  draft: [saveDraft],
};

const useStyles = makeStyles(() => ({
  popper: {
    zIndex: 1000,
  },
}));

export default function EventHeader(props) {
  const {
    setFieldValue,
    isSubmitting,
    handleSubmit,
    event,
    disabled,
    isNewEvent,
    setAddAnother,
    addAnother,
    scope,
  } = props;
  const classes = useStyles();

  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const {
    location: { search: searchParams },
  } = history;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (event, action) => {
    execAction(action);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const actionList = () => {
    if (isNewEvent) {
      return stateActionMap['draft'];
    }
    if (event.publishStatus === 'Archived') {
      return differenceWith(
        stateActionMap['all'],
        [eventArchive, seriesArchive],
        isEqual,
      );
    }
    return stateActionMap[scope];
  };

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted(data) {
      onDeleteSuccess(data);
    },
    onError(err) {
      onError(err);
    },
  });

  const [updateEvent] = useMutation(UPDATE_EVENT, {
    onCompleted(data) {
      onArchiveSuccess(data);
    },
    onError(err) {
      onError(err);
    },
  });

  const variables = {
    communityId: getOneSearchParam('communityId', '14'),
    force: true,
  };

  const onDeleteSuccess = (data) => {
    const name = data?.community?.removeEvent?.name || 'Your event';
    showToast(strings.Event.deletion.deleteSuccess(name));

    if (scope === 'recurring') {
      sendPendoEvent('event_series_delete');
    } else {
      sendPendoEvent('event_single_delete');
    }
    history.push(`/${searchParams}`);
  };

  const onArchiveSuccess = (data) => {
    const name = data?.community?.removeEvent?.name || 'Your event';
    showToast(strings.Event.archiving.archiveSuccess(name));

    if (scope === 'recurring') {
      sendPendoEvent('event_series_archive');
    } else {
      sendPendoEvent('event_single_archive');
    }
    history.push(`/${searchParams}`);
  };

  const onError = (error) => {
    showErrorToast();
    console.warn(error);
  };

  const execAction = (action) => {
    switch (action) {
      case 'saveDraft': {
        setFieldValue('status', 'Draft');
        handleSubmit();
        break;
      }
      case 'delete': {
        deleteEvent({
          variables: {
            ...variables,
            scope,
            eventId: event.eventId,
            date: event.startsAt,
          },
        });
        break;
      }
      case 'archive': {
        updateEvent({
          variables: {
            ...variables,
            scope,
            eventId: event.eventId,
            date: event.startsAt,
            updates: {
              status: 'Archived',
              location: event.eventLocation?._id,
            },
          },
        });
        break;
      }
    }
  };
  const actions = actionList();

  return (
    <ActionsContainer>
      {isNewEvent ? (
        <CheckboxContainer item xs={7} md={7} lg={4} xl={2}>
          <FormCheckbox
            name="createAnotherEvent"
            label={strings.Event.saveAndAdd}
            value={addAnother}
            checked={addAnother}
            disabled={isSubmitting || disabled}
            onChange={() => setAddAnother(!addAnother)}
          />
        </CheckboxContainer>
      ) : null}
      <ButtonGroup ref={anchorRef} color="primary">
        <DropdownAction
          id="Em_event-save"
          color="primary"
          variant="contained"
          disabled={isSubmitting || disabled}
          onClick={() => {
            setFieldValue('status', 'Published');
            handleSubmit();
          }}
        >
          {strings.Event.actions.publish}
        </DropdownAction>
        <DropdownButton
          id="Em_event-actions-dropdown"
          color="primary"
          variant="contained"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </DropdownButton>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        disablePortal={true}
        className={classes.popper}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu">
              {actions.map((option) => (
                <MenuItem
                  id={`Em_event-action-${option.action}`}
                  key={option.action}
                  onClick={(event) => handleMenuItemClick(event, option.action)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </ActionsContainer>
  );
}
