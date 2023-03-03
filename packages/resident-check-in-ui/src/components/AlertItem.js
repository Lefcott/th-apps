import React from 'react';
import moment from 'moment-timezone';
import { setIcon } from '../utilities/helper';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, IconButton } from '@material-ui/core';

function Alert(props) {
  const { data, onAlertSelect, } = props;
  const handleClick = React.useCallback(() => onAlertSelect(data), [data]);

  return (
    <ListItem divider onClick={handleClick} style={{ backgroundColor: "#fff", }}>
      <ListItemAvatar>
        <img src={setIcon(data.type)} alt="alert icon" style={{ width: "30px ", }} />
      </ListItemAvatar>
      <ListItemText primary={data.description} secondary={moment(props.data.createdAt).format('ddd, MMM D - h:mm A')} />
      <ListItemSecondaryAction>
        <IconButton onClick={handleClick} style={{ padding: "6px" }}>
          <ArrowRight />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )

}

export default Alert;

// this component is used in the SetAwayModal
export const SecondaryAlertItem = (props) => (
  <List disablePadding>
    <ListItem divider>
      <ListItemAvatar>
        <img src={setIcon(props.data.type)} alt="alert icon" style={{ width: '23px', }} />
      </ListItemAvatar>
      <ListItemText primary={props.data.description} secondary={moment(props.data.createdAt).format('ddd, MMM D - h:mm A')} />
    </ListItem>
  </List>
)

