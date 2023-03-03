/** @format */

import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { get, sortBy, split, toLower, trim } from 'lodash';
import Loader from './Loader';
import OverlayLoading from './OverlayLoading';
import {
  Wrapper,
  FormContainer,
  Header,
  ActionsContainer,
  ActionButton,
} from './styleUtils';
import {
  Grid,
  Avatar,
  Button,
  Typography,
  Badge,
  Fab,
  Hidden,
  Tabs,
  Tab,
  List,
  Popover,
  Fade,
  Grow,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import { Add as AddIcon, Close as CloseIcon } from '@material-ui/icons';
import { AttendanceForm, PartialScreenModal } from './AttendanceActions';
import AttendanceListItem, { InfoListItem } from './AttendanceListItem';
import ReactToPrint from 'react-to-print';
import PrintAttendance, { formatPhone } from './PrintAttendance';
import {
  GET_ATTENDEES,
  ADD_ATTENDEE,
  ADD_GUEST_ATTENDEE,
  REMOVE_ATTENDEE,
} from '../graphql/events';
import { getOneSearchParam } from '../utils/url';
import { showToast } from '@teamhub/toast';
import defaultProf from '../assets/default.svg';
import { ReactActionAreaPortal } from '@teamhub/api';
import strings from '../constants/strings';

const StickyFab = styled(Fab)`
  &&&&&& {
    position: absolute;
    right: 20px;
    bottom: 20px;
    /* z-index: 200; */
    @media (min-width: 960px) {
      display: none;
    }
  }
`;

const StyledMarkAll = styled(Button)`
  &&& {
    margin: 12px 0px;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1, 1.1);
  }
`;

export default function AttendanceTracking(props) {
  const printComp = useRef();
  const theme = useTheme();
  const [active, setActive] = React.useState(0);
  const [modal, setModal] = React.useState(false);
  const [submittingAll, setSubmittingAll] = React.useState(false);
  const { eventId, rsvps, startsAt } = props.event;
  const { data, loading: loadingAttendees, refetch } = useQuery(GET_ATTENDEES, {
    variables: {
      communityId: getOneSearchParam('communityId', '14'),
      eventId,
      date: startsAt,
    },
  });

  const [addAttendee] = useMutation(ADD_ATTENDEE);
  const [addGuestAttendee] = useMutation(ADD_GUEST_ATTENDEE);
  const [removeAttendee] = useMutation(REMOVE_ATTENDEE);

  // arrange attendees and signups here
  const attendees = get(data, 'community.getEvent.attendees', []);
  const signups = rsvps.filter((rsvp) => rsvp.status === 'Registered');
  const attendeeIds = attendees.map((attendee) => get(attendee, 'user._id'));
  const attendeeNames = attendees.map((attendee) =>
    get(attendee, 'displayName'),
  );
  const filteredSignups = signups.filter((signup) => {
    if (signup.__typename === 'UserRSVP') {
      // if its a user, we can check against the IDs
      return !attendeeIds.includes(signup.user._id);
    }

    // otherwise, we need to do a name check and hope for the best to avoid dupes in signups and attendees for guests
    return !attendeeNames.includes(signup.displayName);
  });

  async function addSignup(signup, noToast = null) {
    const { __typename } = signup;
    if (__typename === 'UserRSVP') {
      // if its a user, we can use the user id to submit;
      await submitAttendee({ id: signup.user._id, ...signup }, noToast);
    } else {
      // we'll need to add displayPhone on the papi side
      await submitGuestAttendee(
        { name: signup.displayName, phone: signup.displayPhone },
        noToast,
      );
    }
  }

  async function submitAllSignups(signups) {
    try {
      setSubmittingAll(true);
      const promises = signups.map((signup) => addSignup(signup, true));
      await Promise.all(promises);
      setSubmittingAll(false);
      await refetch();
      showToast(strings.Attendance.addAllSignupsSuccess);
    } catch (err) {
      setSubmittingAll(false);
    }
  }

  async function submitAttendee(user, noToast = null) {
    const { id: userId } = user;
    try {
      // check for dupes before submitting, to provide info toast
      const existingAttendee = attendees.find(
        (attendee) => attendee.user && attendee.user._id === userId,
      );
      if (existingAttendee) {
        return showToast(
          strings.Attendance.alreadyListedAsAttending(
            existingAttendee.displayName,
          ),
        );
      }
      // otherwise we continue and submit the attendee
      await addAttendee({
        variables: {
          communityId: getOneSearchParam('communityId', '14'),
          eventId,
          date: startsAt,
          userId,
        },
      });
      await refetch();
      !noToast && showToast(strings.Attendance.addResidentSuccess);
    } catch (err) {
      console.warn(err);
    }
  }

  async function submitGuestAttendee(guestObj, noToast = null) {
    const { name, phone } = guestObj;
    try {
      await addGuestAttendee({
        variables: {
          communityId: getOneSearchParam('communityId', '14'),
          eventId,
          date: startsAt,
          guestName: name,
          guestPhone: phone || undefined,
        },
      });
      await refetch();
      !noToast && showToast(strings.Attendance.addGuestSuccess);
    } catch (err) {
      const errCode = get(err, 'networkError.result.errors[0].extensions.code');
      if (errCode && errCode.includes('PHONENUMBER.INVALID_VALUE')) {
        showToast(strings.Attendance.phoneInvalid(phone), { variant: 'error' });
      }
    }
  }

  async function deleteAttendee({ _id }) {
    try {
      await removeAttendee({
        variables: {
          communityId: getOneSearchParam('communityId', '14'),
          eventId,
          date: startsAt,
          _id,
        },
      });
      await refetch();
      showToast(strings.Attendance.removeAttendeeSuccess);
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <Wrapper>
      <Hidden mdUp>
        {!loadingAttendees && (
          <>
            <Tabs
              style={{
                color: theme.palette.grey[500],
                background: theme.palette.common.white,
              }}
              TabIndicatorProps={{
                style: { background: theme.palette.primary.main },
              }}
              variant="fullWidth"
              value={active}
              onChange={(event, newValue) => setActive(newValue)}
            >
              <Tab
                label={strings.Attendance.labels.signups}
                style={{
                  color: active === 0 && theme.palette.primary.main,
                }}
              />
              <Tab
                label={strings.Attendance.labels.attendees}
                style={{
                  color: active === 1 && theme.palette.primary.main,
                }}
              />
            </Tabs>
            {active === 0 ? (
              <List style={{ padding: 0 }}>
                <InfoListItem listType={'signups'} />
                {filteredSignups.map((signup) => (
                  <AttendanceListItem
                    key={signup._id}
                    listType="signups"
                    user={signup}
                    submit={addSignup}
                  />
                ))}
              </List>
            ) : (
              <List style={{ padding: 0 }}>
                <InfoListItem listType={'attendees'} />
                {attendees.map((attendee) => (
                  <AttendanceListItem
                    key={attendee._id}
                    listType="attendees"
                    user={attendee}
                    submit={deleteAttendee}
                  />
                ))}
              </List>
            )}
          </>
        )}
      </Hidden>
      <PartialScreenModal active={modal} close={() => setModal(false)}>
        <AttendanceForm
          submitGuestAttendee={submitGuestAttendee}
          submitAttendee={submitAttendee}
          close={() => setModal(false)}
        />
      </PartialScreenModal>
      {active === 1 && (
        <Grow in={active === 1}>
          <StickyFab
            label={strings.Attendance.labels.addAttendee}
            color="primary"
            onClick={() => setModal(true)}
          >
            <AddIcon />
          </StickyFab>
        </Grow>
      )}

      <Hidden smDown>
        {!loadingAttendees ? (
          <>
            <ReactActionAreaPortal>
              <ActionsContainer>
                <>
                  <ReactToPrint
                    trigger={() => (
                      <ActionButton
                        variant="contained"
                        id="Em_attendance-print"
                      >
                        {strings.Buttons.print}
                      </ActionButton>
                    )}
                    content={() => printComp.current}
                    pageStyle="@page { margin: 0 50px 50px }"
                  />
                  <div style={{ display: 'none' }}>
                    <PrintAttendance
                      ref={printComp}
                      event={props.event}
                      attendees={attendees}
                    />
                  </div>
                </>
              </ActionsContainer>
            </ReactActionAreaPortal>

            <FormContainer container maxwidth="85%">
              <Grid container spacing={2} style={{ padding: '25px' }}>
                <Grid item xs={12}>
                  <Header style={{ marginBottom: '12px' }}>
                    {strings.Attendance.signups.imported}
                  </Header>
                  {filteredSignups.length > 0 ? (
                    <Typography
                      variant="h5"
                      style={{
                        lineHeight: '25px',
                        fontSize: '22px',
                        fontWeight: 'normal',
                      }}
                    >
                      {strings.Attendance.signups.clickToMarkPresent}
                      <StyledMarkAll
                        onClick={() => submitAllSignups(filteredSignups)}
                        variant="contained"
                        size="small"
                      >
                        <strong>
                          {strings.Attendance.signups.markAllAsAttended}
                        </strong>
                      </StyledMarkAll>
                    </Typography>
                  ) : (
                    <Typography
                      variant="h5"
                      style={{
                        lineHeight: '25px',
                        fontSize: '22px',
                        fontWeight: 'normal',
                      }}
                    >
                      {strings.Attendance.signups.allInAttendance}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <div
                    style={{
                      width: '100%',
                      position: 'relative',
                      height: '100%',
                    }}
                  >
                    {submittingAll && <OverlayLoading />}
                    <SignupsList
                      signups={filteredSignups}
                      attendees={attendees}
                      addSignup={addSignup}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ padding: '25px' }}>
                <Grid item xs={12}>
                  <Header style={{ marginBottom: '12px' }}>
                    {strings.Attendance.attendees.title}
                  </Header>
                  <Typography
                    variant="h5"
                    style={{
                      lineHeight: '25px',
                      fontSize: '22px',
                      fontWeight: 'normal',
                    }}
                  >
                    {strings.Attendance.attendees.present}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                      <PopoverForm
                        submitAttendee={submitAttendee}
                        submitGuestAttendee={submitGuestAttendee}
                      />
                    </Grid>
                    {attendees.map((attendee) => (
                      <Fade in={!!attendee} key={attendee._id} timeout={200}>
                        <Grid
                          key={attendee._id}
                          item
                          xs={6}
                          sm={4}
                          md={3}
                          lg={2}
                        >
                          <InteractiveAvatar
                            submit={deleteAttendee}
                            user={attendee}
                          />
                        </Grid>
                      </Fade>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </FormContainer>
          </>
        ) : (
          <Loader />
        )}
      </Hidden>
    </Wrapper>
  );
}

function PopoverForm(props) {
  const { submitAttendee, submitGuestAttendee } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        <AttendanceForm
          submitAttendee={submitAttendee}
          submitGuestAttendee={submitGuestAttendee}
          close={handleClose}
        />
      </Popover>
      <Fab
        color="primary"
        style={{ marginBottom: '12px', width: '82px', height: '82px' }}
        id="Em_attendance-add"
        onClick={handleClick}
      >
        <AddIcon
          size="large"
          style={{ fontSize: '42px', textAlign: 'center' }}
        />
      </Fab>
      <Typography variant="body2" style={{ display: 'block' }}>
        {strings.Attendance.attendees.add}
      </Typography>
    </div>
  );
}

function SignupsList(props) {
  const { signups = [], addSignup } = props;

  if (signups.length > 0) {
    return (
      <Grid container style={{ marginTop: '12px' }} spacing={2}>
        {sortBy(signups, (signup) =>
          toLower(trim(split(signup.displayName, ' ')[1])),
        ).map((signup) => (
          <Fade in={Boolean(signup)} key={signup._id} timeout={200}>
            <Grid key={signup._id} item xs={6} sm={4} md={3} lg={2}>
              <InteractiveAvatar showPhone submit={addSignup} user={signup} />
            </Grid>
          </Fade>
        ))}
      </Grid>
    );
  }
  return null;
}

function InteractiveAvatar(props) {
  const { user, submit } = props;
  const [loading, setLoading] = React.useState(false);
  async function handleClick(user) {
    setLoading(true);
    await submit(user);
    setLoading(false);
  }

  let thumbnail = get(user, 'user.thumbnail');
  if (
    thumbnail === 'https://k4connect-shared.s3.amazonaws.com/misc/profile.svg'
  ) {
    thumbnail = null;
  }
  const phone = get(user, 'user.primaryPhone', get(user, 'displayPhone'));

  return (
    <AvatarContainer onClick={() => handleClick(user)}>
      {loading && <OverlayLoading />}
      <Badge
        overlap="circle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar style={{ height: '26px', width: '26px' }}>
            {user.__typename.includes('Attendee') ? <CloseIcon /> : <AddIcon />}
          </Avatar>
        }
      >
        <Avatar
          alt={user.displayName}
          src={thumbnail || defaultProf}
          style={{ height: '82px', width: '82px', marginBottom: '12px' }}
        ></Avatar>
      </Badge>
      <Typography variant="body2" style={{ overflowWrap: 'anywhere' }}>
        {user.displayName}
      </Typography>
      {phone && <Typography variant="body2">{formatPhone(phone)}</Typography>}
    </AvatarContainer>
  );
}
