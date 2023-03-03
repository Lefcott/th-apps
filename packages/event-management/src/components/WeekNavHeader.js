/** @format */

import React, { useContext, useState } from 'react';
import State from './StateProvider';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';
import styled from '@emotion/styled';
import { isEqual } from 'lodash';
import PublishAllModal from './PublishAllModal';
import { ReactActionAreaPortal } from '@teamhub/api';
import {
  IconButton,
  Button,
  Hidden,
  useMediaQuery,
  Tooltip,
  Fab,
  Box,
} from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';
import filterIcon from '../utils/icons/filter.svg';
import { makeStyles } from '@material-ui/styles';
import strings from '../constants/strings';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.open ? 'center' : 'space-between')};
  flex-shrink: 0;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;

  @media (max-width: 950px) {
    font-size: 16px;
  }

  @media (max-width: 960px) {
    font-size: 20px;
    justify-content: center;
    border-bottom: 1px solid lightgray;
  }
`;

const FilterIcon = styled.img`
  width: 20px;
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

const useFilterButtonStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      left: theme.spacing(0.75),
    },
  },
}));

const useFabStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    borderRadius: '4px',
    width: 'auto',
    zIndex: 150,
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
}));

function WeekNavHeader(props) {
  const { date, startOfWeek, endOfWeek } = props;
  const filterButtonClasses = useFilterButtonStyles();
  const fabClasses = useFabStyles();
  const Context = useContext(State);
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  const isSquare = useMediaQuery('(max-width:950px)');
  const endWeekFormat = isSquare ? 'MMM DD' : 'MMM DD, YYYY';
  const newEventStartDate = moment(date).isAfter(moment(), 'week')
    ? moment(startOfWeek).add(1, 'day') // Monday of the current week
    : moment(); // Today

  const onDateToggle = (dir) => {
    const newDate = moment(Context.filters.date);
    isEqual(dir, 'prev') ? newDate.subtract(7, 'days') : newDate.add(7, 'days');
    Context.updateFilters('date', newDate);
  };

  return (
    <HeaderWrapper container open={props.isDrawerOpen}>
      {!props.isDrawerOpen ? (
        <Tooltip title={strings.Settings.openFilters}>
          <IconButton
            classes={filterButtonClasses}
            id="Em_calendar-openFilters"
            onClick={() => props.setIsDrawerOpen(true)}
          >
            <FilterIcon src={filterIcon} alt="filters" />
          </IconButton>
        </Tooltip>
      ) : null}
      <Hidden smDown>
        <ReactActionAreaPortal>
          <PublishAllModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            loadEvents={props.loadEvents}
          />
          <StyledButton
            id="Em_calendar-newEvent"
            variant="contained"
            color="primary"
            onClick={() =>
              history.push(`/${'new'}/${searchParams}`, {
                source: 'header',
                startDate: newEventStartDate.toISOString(),
              })
            }
          >
            {strings.Buttons.newEvent}
          </StyledButton>
        </ReactActionAreaPortal>
      </Hidden>
      <Hidden mdUp>
        <Fab
          className={fabClasses.fab}
          color="primary"
          onClick={() =>
            history.push(`/${'new'}/${searchParams}`, {
              source: 'header',
              startDate: newEventStartDate.toISOString(),
            })
          }
        >
          {strings.Buttons.newEvent}
        </Fab>
      </Hidden>
      <Box display="flex" flexShrink={0} alignItems="center">
        <IconButton id="Em_calendar-prev" onClick={() => onDateToggle('prev')}>
          <NavigateBefore />
        </IconButton>
        <span>
          {`${startOfWeek.format('MMM DD')} - ${endOfWeek.format(
            endWeekFormat,
          )}`}
        </span>
        <IconButton id="Em_calendar-next" onClick={() => onDateToggle('next')}>
          <NavigateNext />
        </IconButton>
      </Box>

      <Box></Box>
    </HeaderWrapper>
  );
}

export default WeekNavHeader;
