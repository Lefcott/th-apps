/** @format */

import React, { useRef, useState } from 'react';
import moment from 'moment-timezone';
import { ListItem as MuiItem, ListItemText } from '@material-ui/core';
import { MoreVertRounded } from '@material-ui/icons';
import { isEqual } from 'lodash';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import State from '../StateProvider';
import EventOptions from './EventOptions';

const ListItem = styled(MuiItem)`
  &&&& {
    display: flex;
    justify-content: center;
    padding: 0 8px;
    margin: ${(props) => (isEqual(props.allday, 'true') ? '2px 0' : '10px 0')};
    background-color: ${(props) =>
      isEqual(props.allday, 'true') ? '#f0f0f7' : '#ffffff'};
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
`;

const TimeStyle = styled.span`
  &&&& {
    font-size: 14px;
    font-weight: bold;
    display: ${(props) => (isEqual(props.allday, 'true') ? 'none' : 'flex')};
  }
`;

const NameStyle = styled.span`
  font-style: ${(props) =>
    isEqual(props.status, 'Draft') ? 'italic' : 'normal'};
  font-weight: ${(props) =>
    isEqual(props.allday, 'true') ? 'bold' : 'normal'};
`;

const MoreOptionsIcon = styled(MoreVertRounded)`
  marginleft: 15px;
  fontsize: 14px;
  cursor: pointer;
  visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};
`;

function DayEventsListItem({ event, setSelectedEvent, setDialogAction }) {
  const [isHovering, setIsHovering] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const moreActionsRef = useRef();
  const Context = useContext(State);
  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  const itemOnClick = (event) => {
    if (event.recurring) {
      setSelectedEvent(event);
      setDialogAction('edit');
    } else {
      Context.setRecurring(false);
      history.push(
        `/${event.eventId}/date/${moment(
          event.startsAt,
        ).toISOString()}${searchParams}`,
      );
    }
  };

  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    setShowOptions(true);
  };

  const handleClickAction = (action) => {
    setShowOptions(false);
    setSelectedEvent(event);
    setTimeout(() => {
      setDialogAction(action);
    }, 1);
  };

  return (
    <>
      <ListItem
        id={`Em_calendarEvent-${event.name.replaceAll(/\s+/g, '_')}`}
        className={`Em_calendarEvent Em_calendarEvent-${
          event.recurring ? 'recurring' : 'single'
        }`}
        button
        onClick={() => itemOnClick(event)}
        allday={event.allDay.toString()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <ListItemText
          primary={
            <TimeStyle allday={event.allDay.toString()}>
              {`${moment(event.startsAt).format('h:mm A')} - ${moment(
                event.endsAt,
              ).format('h:mm A')}`}
            </TimeStyle>
          }
          secondary={
            <NameStyle
              status={event.publishStatus}
              allday={event.allDay.toString()}
            >
              {event.name}
            </NameStyle>
          }
        />
        <MoreOptionsIcon
          onClick={handleMoreOptionsClick}
          hidden={!isHovering}
          ref={moreActionsRef}
        />
      </ListItem>
      {showOptions && (
        <EventOptions
          event={event}
          anchorEl={moreActionsRef.current}
          onClose={() => setShowOptions(false)}
          onOptionClicked={handleClickAction}
        />
      )}
    </>
  );
}

export default DayEventsListItem;
