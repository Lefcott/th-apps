/** @format */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';
import styled from '@emotion/styled';
import { List, Button } from '@material-ui/core';
import EventDialog from './EventDialog';
import strings from '../constants/strings';
import DayEventsListItem from './DayEventsListItem';

const ListWrapper = styled(List)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  border: 1px solid #e3e5e5;
  &&&& {
    padding: 0;
  }
`;

const EventsContainer = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0 10px 0;
`;

const StyledButton = styled(Button)`
  &&&& {
    margin: 0 5px;
    padding: 5px 10px;

    @media (max-width: 950px) {
      font-size: 12px;
    }
  }
`;

const EmptyList = styled.div`
  text-align: center;
  font-size: 13px;
  font-style: italic;
  padding: 10px;
`;

function DayEventsList(props) {
  const { events, date, removeEvent, changeEventPublishStatus } = props;
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isHovering, setIsHovering] = useState(false);

  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;
  const isPastDay = moment(date).isBefore(moment(), 'day');

  const handleNewEvent = () => {
    history.push(`/${'new'}/${searchParams}`, {
      source: 'dayColumn',
      startDate: moment(date).toISOString(),
    });
  };

  return (
    <>
      <ListWrapper
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <EventsContainer>
          {events.length ? (
            events.map((event) => (
              <DayEventsListItem
                key={event._id}
                event={event}
                setSelectedEvent={setSelectedEvent}
                setDialogAction={setDialogAction}
              />
            ))
          ) : (
            <EmptyList className="Em_weekCalendar-dayCol-noEvents">
              {strings.Event.noMatchingEvents}
            </EmptyList>
          )}
        </EventsContainer>
        {!isPastDay && isHovering && (
          <ButtonContainer>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleNewEvent}
            >
              {strings.Buttons.newEvent}
            </StyledButton>
          </ButtonContainer>
        )}
      </ListWrapper>
      <EventDialog
        event={selectedEvent}
        isOpen={!!dialogAction}
        setIsOpen={() => setDialogAction(null)}
        onClose={() => setDialogAction(null)}
        action={dialogAction}
        removeEvent={removeEvent}
        changeEventPublishStatus={changeEventPublishStatus}
      />
    </>
  );
}

export default DayEventsList;
