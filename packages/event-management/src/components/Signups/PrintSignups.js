/** @format */

import React from 'react';
import { MenuItem, Menu, Grid } from '@material-ui/core';
import { Header, SubHeader, MetaWrapper, ActionButton } from '../styleUtils';
import { formatPhone } from '../PrintAttendance';
import moment from 'moment-timezone';
import { get } from 'lodash';
import styled from '@emotion/styled';
import ReactToPrint from 'react-to-print';
import MaterialTable from 'material-table';
import strings from '../../constants/strings';

// for hiding the print attendance components
const Hide = styled.div`
  display: none;
`;

const TableHeader = styled(SubHeader)`
  &&&& {
    font-size: 1.35em;
    font-weight: bold;
  }
`;

const pageStyle = `
  @page { 
    margin: 15px 50px 50px;
    size: auto;
  }

  @page :first {
    margin: 0 50px 50px
  }
  
  @media print {
    html, body {
      height: initial !important;
      overflow: initial !important;
      -webkit-print-color-adjust: exact;
    }
  }
`;

function PrintSignups(props) {
  const { waitlists = [], signups = [], event } = props;
  const signupsRef = React.useRef();
  const waitlistsRef = React.useRef();
  const bothRef = React.useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = ({ currentTarget }) => setAnchorEl(currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <ActionButton
        style={{ marginRight: '10px' }}
        variant="contained"
        onMouseEnter={handleOpen}
      >
        {strings.Buttons.print}
      </ActionButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        <ReactToPrint
          trigger={() => (
            <MenuItem id="Em_signups-printSignups" style={{ padding: '12px' }}>
              {strings.Attendance.signups.title}
            </MenuItem>
          )}
          content={() => signupsRef.current}
          pageStyle={pageStyle}
        />
        <Hide>
          <PrintSignupsWaitlists
            ref={signupsRef}
            signups={signups}
            event={event}
            signUpCount={props.signUpCount}
          />
        </Hide>
        <ReactToPrint
          trigger={() => (
            <MenuItem id="Em_signups-printWaitlist" style={{ padding: '12px' }}>
              {strings.Attendance.signups.waitlists}
            </MenuItem>
          )}
          content={() => waitlistsRef.current}
          pageStyle={pageStyle}
        />
        <Hide>
          <PrintSignupsWaitlists
            ref={waitlistsRef}
            waitlists={waitlists}
            event={event}
          />
        </Hide>
        <ReactToPrint
          trigger={() => (
            <MenuItem id="Em_signups-printBoth" style={{ padding: '12px' }}>
              {strings.Attendance.signups.both}
            </MenuItem>
          )}
          content={() => bothRef.current}
          pageStyle={pageStyle}
        />
        <Hide>
          <PrintSignupsWaitlists
            ref={bothRef}
            waitlists={waitlists}
            signups={signups}
            event={event}
            signUpCount={props.signUpCount}
          />
        </Hide>
      </Menu>
    </>
  );
}

class PrintSignupsWaitlists extends React.Component {
  render() {
    const { waitlists, signups, event } = this.props;
    const eventDate = moment(event.startsAt).format('L LT');
    return (
      <Grid style={{ marginTop: 25 }}>
        <Header>{event.name}</Header>
        <SubHeader>{eventDate}</SubHeader>
        <MetaWrapper>
          {signups && (
            <span>
              {strings.Attendance.labels.signups}: {signups.length}
            </span>
          )}
          {waitlists && (
            <span>
              {strings.Attendance.signups.waitlist}: {waitlists.length}
            </span>
          )}
        </MetaWrapper>
        {signups && (
          <>
            <TableHeader>{`${strings.Attendance.labels.signups} ${
              this.props.signUpCount || ''
            }`}</TableHeader>
            <MaterialTable
              data={signups}
              columns={[
                {
                  title: strings.Attendance.tables.columns.name,
                  field: 'displayName',
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                },
                {
                  title: strings.Attendance.tables.columns.phone,
                  field: 'phone',
                  render: (data) => {
                    const phone = get(
                      data,
                      'user.primaryPhone',
                      get(data, 'displayPhone'),
                    );
                    return formatPhone(phone);
                  },
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                },
                {
                  title: strings.Attendance.tables.columns.dateTime,
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                  render: (data) =>
                    data &&
                    moment(data.recordedAt || moment()).format(
                      'MM/DD/YYYY hh:mm a',
                    ),
                  initalEditValue: moment().format('MM/DD/YYYY hh:mm a'),
                  readonly: true,
                },
                {
                  title: strings.Attendance.tables.columns.address,
                  field: 'Address',
                  searchable: true,
                  render: (data) => {
                    const address = get(data, 'user.address', 'No Address');
                    return address;
                  },
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                },
              ]}
              options={{ toolbar: false, paging: false }}
              style={{ boxShadow: 'none' }}
            />
          </>
        )}

        {waitlists && (
          <>
            <TableHeader>{strings.Attendance.signups.waitlist}</TableHeader>
            <MaterialTable
              data={waitlists}
              columns={[
                {
                  title: strings.Attendance.tables.columns.name,
                  field: 'displayName',
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                },
                {
                  title: strings.Attendance.tables.columns.phone,
                  field: 'phone',
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                  render: (data) => {
                    const phone = get(
                      data,
                      'user.primaryPhone',
                      get(data, 'displayPhone'),
                    );
                    return formatPhone(phone);
                  },
                },
                {
                  title: strings.Attendance.tables.columns.dateTime,
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                  render: (data) =>
                    data &&
                    moment(data.recordedAt || moment()).format(
                      'MM/DD/YYYY hh:mm a',
                    ),
                  initalEditValue: moment().format('MM/DD/YYYY hh:mm a'),
                  readonly: true,
                },
                {
                  title: strings.Attendance.tables.columns.address,
                  field: 'Address',
                  searchable: true,
                  render: (data) => {
                    const address = get(data, 'user.address', 'No Address');
                    return address;
                  },
                  headerStyle: { fontWeight: 'bold', fontSize: '1.15em' },
                },
              ]}
              options={{ toolbar: false, paging: false }}
              style={{ boxShadow: 'none' }}
            />
          </>
        )}
      </Grid>
    );
  }
}

export default PrintSignups;
