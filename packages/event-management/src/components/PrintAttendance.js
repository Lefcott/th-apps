/** @format */

import React from 'react';
import moment from 'moment-timezone';
import { Header, SubHeader, MetaWrapper } from './styleUtils';
import { Grid } from '@material-ui/core';
import { get, cloneDeep } from 'lodash';
import MaterialTable from 'material-table';
import strings from '../constants/strings';

export function formatPhone(numStr) {
  const cleaned = ('' + numStr).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, match[2], '-', match[3], '-', match[4]].join('');
  }
  return null;
}

class PrintAttendance extends React.Component {
  render() {
    const { attendees = [], event } = this.props;
    const eventDate = moment(event.startsAt).format('L LT');

    return (
      <Grid style={{ marginTop: 25 }}>
        <Header>{event.name}</Header>
        <SubHeader>{eventDate}</SubHeader>
        <MetaWrapper>
          <span>
            {strings.Attendance.labels.attendees}: {attendees.length}
          </span>
          <span>
            {strings.Attendance.labels.costsMoney}:{' '}
            {event.costsMoney
              ? strings.confirmation.yes
              : strings.confirmation.no}
          </span>
        </MetaWrapper>

        <MaterialTable
          data={cloneDeep(attendees)}
          columns={[
            { title: strings.Attendance.labels.name, field: 'displayName' },
            {
              title: strings.Attendance.labels.phone,
              field: 'phone',
              render: (data) => {
                const phone = get(
                  data,
                  'user.primaryPhone',
                  get(data, 'displayPhone'),
                );
                return formatPhone(phone);
              },
            },
          ]}
          options={{ toolbar: false, paging: false }}
          style={{ boxShadow: 'none' }}
        />
      </Grid>
    );
  }
}

export default PrintAttendance;
