/** @format */

import React from 'react';
import {
  Button as MUIButton,
  Card as MUICard,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sendPendoEvent } from '@teamhub/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import Strings from '../../../constants/strings';

const Card = withStyles((theme) => ({
  root: {
    border: 0,
    color: 'white',
    backgroundColor: theme.palette.error.dark,
    marginBottom: theme.spacing(2),
  },
}))(MUICard);

const Actions = withStyles({
  root: {
    paddingTop: 0,
    justifyContent: 'space-between',
  },
})(CardActions);

const Button = withStyles(() => ({
  root: {
    fontSize: '10px',
  },
}))(MUIButton);

const DeleteButton = withStyles(() => ({
  root: {
    color: 'rgba(198, 40, 40, 1)',
    paddingLeft: 0,
    marginLeft: '-0.4rem',
  },
}))(Button);

const CancelButton = withStyles(() => ({
  root: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}))(Button);

const getMessage = (length) => {
  switch (length) {
    case 0:
      return Strings.Restaurant.confirmation.delete('');
    case 1:
      return Strings.Restaurant.confirmation.delete(' and 1 menu');
    default:
      return Strings.Restaurant.confirmation.delete(` and all ${length} menus`);
  }
};

export default function Delete({ menus, onRemove, isLoading, disabled }) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const showConfirm = () => {
    sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editDelete);
    setShowConfirmation(true);
  };

  const hideConfirm = () => {
    sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editDeleteCancel);
    setShowConfirmation(false);
  };

  const handleRemove = () => {
    sendPendoEvent(Strings.Dining.pendoEvent.restaurant.editDeleted);
    onRemove();
  };

  return showConfirmation ? (
    <Card variant="outlined">
      <CardContent>
        <Typography id="RD_restaurant-delete-warning-Msg" variant="body2">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            id="RD_Rrestaurant-delete-warning-Icon"
            size="sm"
            style={{ marginRight: '4px', marginBottom: '1px' }}
          />
          WARNING: {getMessage(menus.length)}
        </Typography>
      </CardContent>
      <Actions>
        <CancelButton
          id="RD_restaurant-delete-cancle-Btn"
          size="small"
          onClick={hideConfirm}
        >
          Cancel
        </CancelButton>
        <Button
          id="RD_restaurant-confirm-delete-Btn"
          size="small"
          color="inherit"
          onClick={handleRemove}
          disabled={isLoading}
        >
          Confirm Delete
        </Button>
      </Actions>
    </Card>
  ) : (
    <DeleteButton
      id="RD_restaurant-delete-Btn"
      size="small"
      variant="text"
      onClick={showConfirm}
      disabled={disabled}
    >
      Delete
    </DeleteButton>
  );
}
