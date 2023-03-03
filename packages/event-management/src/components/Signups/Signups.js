/** @format */

import React, { useState, useRef } from 'react';
import { Wrapper, FormContainer, Header, ActionButton } from '../styleUtils';
import { useMutation } from '@teamhub/apollo-config';
import { isEqual, isNull } from 'lodash';
import {
  Grid,
  Menu,
  MenuItem,
  useMediaQuery,
  Popover,
} from '@material-ui/core';
import SignupsTable from './SignupsTable';
import { AddResidentAction, SignupsForm } from '../AttendanceActions';
import { ADD_RESIDENT_SIGNUP } from '../../graphql/events';
import { getOneSearchParam } from '../../utils/url';
import PrintSignups from './PrintSignups';
import { showToast } from '@teamhub/toast';
import strings from '../../constants/strings';

export default function Signups({ event, disabled, ...props }) {
  // set default props so the useEffect dependency doesn't fail
  const isMobile = useMediaQuery('(max-width:960px)');
  const { rsvps = [], openSpots, totalSpots, eventId, startsAt } = event;
  const [adding, setAdding] = useState();
  const [addResident] = useMutation(ADD_RESIDENT_SIGNUP);
  const prevRSVPS = React.useRef();
  prevRSVPS.current = rsvps;
  const { refetchEvent } = props;
  const [localRsvps, setLocalRsvps] = useState({
    signups: [],
    waitlists: [],
    fullList: [],
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  function sortByRecordedAt(a, b) {
    return new Date(a.recordedAt).getTime() > new Date(b.recordedAt).getTime();
  }

  React.useEffect(() => {
    // set initial signups based on the props
    if (rsvps && !isEqual(rsvps, prevRSVPS)) {
      prevRSVPS.current = rsvps;
      const { waitlists, signups } = rsvps.sort(sortByRecordedAt).reduce(
        (acc, item) => {
          if (item.status === 'Waitlisted' || item.status === 'waitlisted') {
            acc.waitlists.push(item);
          }
          if (item.status === 'Registered' || item.status === 'registered') {
            acc.signups.push(item);
          }

          return acc;
        },
        { waitlists: [], signups: [] },
      );
      setLocalRsvps({
        waitlists,
        signups,
        fullList: waitlists.concat(signups),
      });
    }
  }, [rsvps]);

  async function submitResident(user, guest) {
    try {
      setAdding(false);
      // check to see if this is already in a list
      const existingRsvp = fullList.find(
        (rsvp) =>
          rsvp.user._id === user.id ||
          rsvp?.displayName?.toLowerCase() === guest?.name?.toLowerCase(),
      );
      if (existingRsvp) {
        return showToast(
          `${existingRsvp.displayName} is already ${existingRsvp.status}`,
          { variant: 'error' },
        );
      }
      const status = adding;
      await addResident({
        variables: {
          userId: user.id,
          communityId: getOneSearchParam('communityId', '14'),
          eventId,
          date: startsAt,
          status,
          guestName: guest?.name,
        },
      });
      await refetchEvent();
      let message = guest?.name
        ? `You successfully added ${user.name} and ${guest.name}!`
        : `You successfully added ${user.name}!`;
      showToast(message);
    } catch (err) {
      console.error(err);
      showToast(
        `An error has occured. We have been notified and are looking into the issue.`,
        { variant: 'error' },
      );
    }
  }

  const hasUnlimitedSpots = isNull(openSpots);
  const isFull = openSpots === 0;
  const { fullList, signups } = localRsvps;

  const signUpCount = totalSpots
    ? `(${signups.length} / ${totalSpots})`
    : `(${signups.length})`;

  return (
    <Wrapper>
      <FormContainer container style={{ maxWidth: isMobile ? '100%' : '85%' }}>
        <Grid container spacing={4} style={{ padding: !isMobile && '25px' }}>
          <Grid item xs={12}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: isMobile && 'column',
              }}
            >
              <Header
                style={
                  isMobile ? { fontSize: '1.5rem', margin: '1.5rem auto' } : {}
                }
              >
                {`${strings.Attendance.signups.signup} ${signUpCount}`}
              </Header>
              <div
                style={{
                  width: '60%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <PrintSignups
                  event={event}
                  signups={localRsvps.signups}
                  waitlists={localRsvps.waitlists}
                  signUpCount={signUpCount}
                />
                <HoverMenu
                  isFull={isFull}
                  hasUnlimitedSpots={hasUnlimitedSpots}
                  setAdding={setAdding}
                  waitlists={localRsvps.waitlists}
                  disabled={disabled}
                  onClick={(adding, anchor) => {
                    setAdding(adding);
                    setAnchorEl(anchor);
                  }}
                />
                <Popover
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorEl={anchorEl}
                  transformOrigin={{ vertical: 'center', horizontal: 'right' }}
                  anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                >
                  <SignupsForm
                    submitResident={submitResident}
                    close={handleClose}
                  />
                </Popover>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} id="EM_signupsTable">
            <SignupsTable
              fullList={fullList}
              startsAt={startsAt}
              noAdd={isFull || localRsvps.waitlists.length > 0}
              hasUnlimitedSpots={hasUnlimitedSpots}
              type="registered"
              data={localRsvps.signups}
              openSpots={openSpots}
              refetchEvent={props.refetchEvent}
              eventId={eventId}
            />
          </Grid>
          <Grid item xs={12}>
            <Header>{strings.Attendance.signups.waitlist}</Header>
          </Grid>
          <Grid item xs={12} id="EM_waitlistTable">
            <SignupsTable
              fullList={fullList}
              startsAt={startsAt}
              hasUnlimitedSpots={hasUnlimitedSpots}
              noAdd={localRsvps.waitlists.length === 0 && !isFull}
              type="waitlist"
              openSpots={openSpots}
              data={localRsvps.waitlists}
              eventId={eventId}
              refetchEvent={refetchEvent}
              isFull={isFull}
            />
          </Grid>
        </Grid>
      </FormContainer>
    </Wrapper>
  );
}

function HoverMenu(props) {
  const { isFull, waitlists, hasUnlimitedSpots, disabled, onClick } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const addButtonRef = useRef(null);
  const handleOpen = ({ currentTarget }) => setAnchorEl(currentTarget);

  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <ActionButton
        color="primary"
        variant="contained"
        onMouseEnter={handleOpen}
        disabled={disabled}
        ref={addButtonRef}
      >
        {strings.Buttons.add}
      </ActionButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
      >
        <MenuItem
          id="Em_signups-addToSignups"
          style={{ padding: '12px' }}
          onClick={(event) => {
            onClick('Registered', addButtonRef.current);
          }}
          disabled={
            (!hasUnlimitedSpots && (isFull || waitlists.length)) || disabled
          }
        >
          {strings.Buttons.addToSignups}
        </MenuItem>
        <MenuItem
          id="Em_signups-addToWaitlist"
          style={{ padding: '12px' }}
          onClick={() => {
            onClick('Waitlisted', addButtonRef.current);
          }}
          disabled={
            (!hasUnlimitedSpots && !isFull && !waitlists.length) || disabled
          }
        >
          {strings.Buttons.addToWaitlist}
        </MenuItem>
      </Menu>
    </>
  );
}
