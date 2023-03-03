/** @format */

import {
  ButtonGroup,
  Button,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import React from 'react';
import { isEmpty } from 'lodash';

export const ViewIntent = {
  EDIT_SCHEDULE: 'Edit Schedule',
  MAKE_SUBSTITUTION: 'Make Substitution',
};

const IntentButton = withStyles((theme) => ({
  root: {
    fontWeight: 'normal',
    textTransform: 'capitalize',
    height: '29px',
    padding: '0.25rem 0.5rem',
    borderColor: (props) =>
      props.active ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.6)',
    color: (props) =>
      props.active ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.6)',
  },
}))(Button);

const IntentButtonGroup = withStyles({
  root: {
    display: 'flex',
    flex: 1,
    margin: '0 0.25rem',
    alignItems: 'center',
  },
})(ButtonGroup);

const DeleteMenuIcon = withStyles(() => ({
  root: {
    minWidth: '20px',
    fontSize: '0.8rem',
  },
}))(ListItemIcon);

const DeleteMenuText = withStyles({
  primary: {
    fontSize: '0.8rem',
  },
})(ListItemText);

export default function MenuCalendarViewSelector({ onClick }) {
  // const isActive =
  //   currentIntent === ViewIntent.EDIT_SCHEDULE ? 'true' : undefined;

  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);

  return (
    <IntentButtonGroup size="small">
      {/* Button Commented until it has any functionality

      <IntentButton
        // Commented to disable the button until it has any functionality
        // active={isActive}
        disabled
        onClick={() => setCurrentIntent(ViewIntent.EDIT_SCHEDULE)}
      >
        Edit Schedule
      </IntentButton>

      <IntentButton
        active={isActive}
        onClick={() => setCurrentIntent(ViewIntent.MAKE_SUBSTITUTION)}
      >
        Make Substitution
      </IntentButton> */}

      <IntentButton
        id="MD_Menu-delete-Btn"
        onClick={onClick}
        disabled={!isEmpty(enabledDiningIntegrations)}
      >
        <DeleteMenuIcon>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteMenuIcon>
        <DeleteMenuText primary="Delete Menu" />
      </IntentButton>
    </IntentButtonGroup>
  );
}
