import React from 'react';
import { Box } from '@material-ui/core';
import moment from 'moment-timezone';

export function rowNumber(row, i) {
  return i + 1
}

export function contactInfo(user) {
  const { fullName, phone, address } = user;
  return (
    <>
      <Box whiteSpace="normal" fontWeight="bold">{fullName}</Box>
      {address ? <Box whiteSpace="normal">{address}</Box> : null}
      {phone ? <Box whiteSpace="normal">{phone}</Box> : null}
    </>
  )
}

export function alertDescription(user) {
  const { timezone, alert } = user;
  const { createdAt } = alert;
  const statusDisplay = alert.status === 'active' ? 'Unresolved' : 'Resolved';

  return (
    <>
      <Box whiteSpace="normal" fontWeight="bold">{alert.description}</Box>
      <Box whiteSpace="normal">{moment.tz(createdAt, timezone).format("MMM D, h:mm A")}</Box>
      <Box>{statusDisplay}</Box>
    </>
  )
}

// utility for alert notes
function findKeyWithMatchingValue(obj, valueToMatch) {
  return Object.keys(obj)
    .filter(keyName => obj[keyName] === valueToMatch);
}

export function alertNotes(user) {
  const { alert } = user;
  let audits;
  if (alert.AlertsAudits.length) {
    audits = alert.AlertsAudits;
  } else {
    return <div>--</div>;
  }
  return audits.reduce((str, audit) => {
    const date = moment(audit.date).format('MMM D');
    const actions = JSON.parse(audit.actions);
    const optionArray = findKeyWithMatchingValue(actions, true);
    let action = 'No resolution selected';
    if (optionArray.length) {
      action = optionArray[0];
    }
    return (
      <>
        {str}<div style={{ whiteSpace: "normal", fontWeight: "bold" }}>{action}</div>
        {audit.notes === null ? '' : <div style={{ whiteSpace: "normal" }}>Notes: {audit.notes}</div>}
        {(audit.userProperties && audit.userProperties.email) ? <><div style={{ whiteSpace: "normal" }}>{`${audit.userProperties.email} - ${date}`}</div><br /></> : <><div>{date}</div><br /></>}
      </>
    )
  }, '');
}
