/** @format */

import React, { useState } from 'react';
import { useMutation } from '@teamhub/apollo-config';
import { Tooltip, IconButton } from '@material-ui/core';
import { ArrowDownward, Delete, ArrowUpward } from '@material-ui/icons';
import { get, kebabCase } from 'lodash';
import { MTableBodyRow } from 'material-table';
import { formatPhone } from '../PrintAttendance';
import moment from 'moment-timezone';
import { WITHDRAW_SIGNUP, MODIFY_SIGNUP } from '../../graphql/events';
import { getOneSearchParam } from '../../utils/url';
import MuiTable from '../MuiTable';
import { showToast } from '@teamhub/toast';
import { makeStyles } from '@material-ui/core/styles';
import strings from '../../constants/strings';

const useStyles = makeStyles({
  tooltip: {
    fontSize: '14px',
    padding: '5px',
  },
  hoverRow: {
    '&:hover': {
      backgroundColor: '#f0f0f7',
      '& $hoverActions': {
        visibility: 'visible',
      },
    },
  },
  hoverBtn: {
    padding: '10px',
  },
  hoverActions: {
    display: 'inline-flex',
    visibility: 'hidden',
  },
});

export default function SignupsTable(props) {
  const { data, type, refetchEvent, eventId, isFull, startsAt } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [withdrawOne] = useMutation(WITHDRAW_SIGNUP);
  const [modifyRSVP] = useMutation(MODIFY_SIGNUP);
  const commonVars = {
    eventId,
    date: startsAt,
    communityId: getOneSearchParam('communityId', '14'),
  };
  const { tooltip, hoverRow, hoverActions, hoverBtn } = useStyles();

  const moveAttendee = async (rsvp) => {
    setIsLoading(true);
    const newStatus =
      rsvp.status.toLowerCase() === 'waitlisted' ? 'Registered' : 'Waitlisted';

    await modifyRSVP({
      variables: {
        status: newStatus,
        rsvpId: rsvp._id,
        ...commonVars,
      },
    });
    await refetchEvent();
    showToast(strings.Attendance.signups.moveSuccess(rsvp.displayName, type));
    setIsLoading(false);
  };

  const removeAttendee = async (rsvp) => {
    try {
      setIsLoading(true);
      await withdrawOne({
        variables: { rsvpId: rsvp._id, ...commonVars },
      });
      await refetchEvent();
      showToast(strings.Attendance.signups.withdrawnSuccess(rsvp.displayName));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: strings.Attendance.tables.columns.name,
      field: 'displayName',
      readonly: true,
      searchable: true,
    },
    {
      title: strings.Attendance.tables.columns.dateTime,
      render: (rsvp) =>
        rsvp &&
        moment(rsvp.recordedAt || moment()).format('MM/DD/YYYY hh:mm a'),
      initalEditValue: moment().format('MM/DD/YYYY hh:mm a'),
      readonly: true,
    },
    {
      title: strings.Attendance.tables.columns.phone,
      searchable: true,
      readonly: true,
      render: (rsvp) => {
        const number = get(
          rsvp,
          'user.primaryPhone',
          get(rsvp, 'displayPhone'),
        );
        if (number) {
          return formatPhone(number);
        }

        return strings.Attendance.signups.noPhoneNumber;
      },
    },
    {
      title: strings.Attendance.tables.columns.address,
      searchable: true,
      cellStyle: {
        width: 450,
        maxWidth: 450,
        paddingInline: 0,
      },
      headerStyle: {
        width: 450,
        maxWidth: 450,
        paddingInline: 0,
      },
      render: (rsvp) => {
        const address = get(rsvp, 'user.address', 'No Address');
        return (
          <Tooltip
            placement="top"
            title={<div className={tooltip}>{address}</div>}
          >
            <span>{address}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '',
      cellStyle: {
        paddingInline: 5,
      },
      headerStyle: {
        paddingInline: 5,
      },
      render: (rsvp) => (
        <div className={hoverActions}>
          <Tooltip
            placement="top"
            title={
              <div className={tooltip}>
                {strings.Attendance.signups.moveTo}
                {rsvp.status.toLowerCase() === 'waitlisted'
                  ? 'sign ups'
                  : 'waitlist'}
              </div>
            }
          >
            <IconButton
              aria-label="move"
              fontSize="small"
              id={`EM_${type}Table-move-${kebabCase(rsvp.displayName)}`}
              className={hoverBtn}
              disabled={type === 'waitlist' && isFull}
              onClick={() => moveAttendee(rsvp)}
            >
              {rsvp.status.toLowerCase() === 'waitlisted' ? (
                <ArrowUpward />
              ) : (
                <ArrowDownward />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip
            placement="top"
            title={
              <div className={tooltip}>
                {strings.Attendance.signups.removeFrom}
                {rsvp.status.toLowerCase() === 'waitlisted'
                  ? 'waitlist'
                  : 'sign ups'}
              </div>
            }
          >
            <IconButton
              aria-label="delete"
              color="secondary"
              id={`EM_${type}Table-delete-${kebabCase(rsvp.displayName)}`}
              className={hoverBtn}
              onClick={() => removeAttendee(rsvp)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <MuiTable
      id={`EM_${type}Table`}
      columns={columns}
      data={data}
      onChangeRowsPerPage={(numRows) => setPageSize(numRows)}
      options={{
        paging: true,
        pageSize,
      }}
      isLoading={isLoading}
      components={{
        Row: (props) => (
          <MTableBodyRow
            className={hoverRow}
            id={`EM_${type}Table-resident-${kebabCase(props.data.displayName)}`}
            {...props}
          />
        ),
      }}
    />
  );
}
