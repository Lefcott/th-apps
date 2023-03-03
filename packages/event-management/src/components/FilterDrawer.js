/** @format */

import React, { Suspense, useContext } from 'react';
import State from './StateProvider';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';
import { isEmpty, includes } from 'lodash';
import styled from '@emotion/styled';
import { SearchBar } from '@k4connect/caregiver-components';
import {
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CircularProgress,
  Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StyledExpansion } from './styleUtils';
import AdvancedFilters from './AdvancedFilters';
import { allStatuses, statusOptions } from '../utils/componentData';
import { Close, SettingsOutlined as GearIcon } from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';
import CalendarPreview from './CalendarPreview';
import { useDebounce } from '../utils/hooks';
import clsx from 'clsx';
import strings from '../constants/strings';

const DownloadEventsModal = React.lazy(() => import('./DownloadEventsModal'));

const HideDrawer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  padding: 5px;
  height: 55px;
  border-bottom: 1px solid #ffffff;
`;

const FiltersWrapper = styled.div`
  flex: 1 1 auto;
  overflow: auto;
`;

const SearchWrapper = styled.div`
  padding: 15px 10px;
`;

const ExpansionWrapper = styled.div`
  border-bottom: 1px solid lightgray;
`;

const drawerWidth = 310;

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: 'relative',
    flexShrink: 0,
  },
  drawerOpen: {
    width: '100%',
    height: 'fill-available',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      height: '100%',
    },
    position: 'relative',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClosed: {
    position: 'relative',
    width: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  list: {
    textAlign: 'center',
  },
}));

const useMonthlyCalendarStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
}));

function FilterDrawer(props) {
  const history = useHistory();
  const {
    location: { search: searchParams },
  } = history;

  const Context = useContext(State);
  const { statuses } = Context.filters;

  const onStatusClick = (val) => {
    if (val === 'all') {
      if (statuses.length === allStatuses.length) {
        return Context.updateFilters('statuses', []);
      }
      return Context.updateFilters('statuses', allStatuses);
    }

    if (includes(statuses, val)) {
      return Context.updateFilters(
        'statuses',
        statuses.filter((status) => status !== val),
      );
    } else {
      return Context.updateFilters('statuses', [...statuses, val]);
    }
  };

  const disableSameWeekDates = (date) => {
    const actualDate = moment(Context.filters.date);
    // if it is the same week
    if (date.day() !== actualDate.day() && date.week() === actualDate.week()) {
      return true;
    }
    return false;
  };

  const {
    calendar: { sidebarStatusExpanded },
  } = Context.pageState;

  const setSidebarStatusExpanded = (event, expanded) => {
    Context.setPageState('calendar', 'sidebarStatusExpanded', expanded);
  };

  const classes = useStyles();
  const monthlyCalendarClasses = useMonthlyCalendarStyles();
  return (
    <Drawer
      className={clsx(classes.drawer, {
        [classes.drawerClosed]: !props.isDrawerOpen,
        [classes.drawerOpen]: props.isDrawerOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.isDrawerOpen,
          [classes.drawerClosed]: !props.isDrawerOpen,
        }),
      }}
      variant="permanent"
      id="Em_filterDrawer"
      style={{ zIndex: '10' }}
    >
      <HideDrawer>
        <IconButton
          id="Em_drawer-close"
          onClick={() => props.setIsDrawerOpen(false)}
        >
          <Close />
        </IconButton>
      </HideDrawer>
      <Divider />

      <FiltersWrapper>
        <Box className={monthlyCalendarClasses.root}>
          <DatePicker
            color="secondary"
            variant="static"
            disableToolbar
            shouldDisableDate={disableSameWeekDates}
            value={Context.filters.date}
            onChange={(date) => Context.updateFilters('date', date)}
            id="Em_monthCalendar"
            leftArrowButtonProps={{ id: 'Em_Month-calendar-prev-month' }}
            rightArrowButtonProps={{ id: 'Em_Month-calendar-next-month' }}
          />
        </Box>

        <Divider />

        <KeywordFilter />

        <ExpansionWrapper>
          <StyledExpansion
            id="Em_expander-status"
            summary="Statuses"
            expanded={sidebarStatusExpanded}
            onChange={setSidebarStatusExpanded}
            details={
              <List style={{ width: '100%' }}>
                {statusOptions.map((option) => {
                  const checked =
                    option.value === 'all'
                      ? statuses.length === allStatuses.length
                      : includes(statuses, option.value);
                  return (
                    <ListItem
                      key={option.name}
                      button
                      id={`Em-status-filter-${option.value}`}
                      onClick={() => onStatusClick(option.value)}
                      style={{ padding: 0 }}
                    >
                      <ListItemIcon>
                        <Checkbox color="primary" checked={checked} />
                      </ListItemIcon>
                      <ListItemText primary={option.name} />
                    </ListItem>
                  );
                })}
              </List>
            }
          />
          <AdvancedFilters />
        </ExpansionWrapper>
        <List className={classes.list}>
          <Suspense
            fallback={
              <CircularProgress size={20} thickness={4} color="primary" />
            }
          >
            <DownloadEventsModal />
          </Suspense>
          <CalendarPreview />
        </List>
        <Divider />
        <List>
          <ListItem
            id="Em_drawer-settings"
            button
            onClick={() => history.push(`/settings/calendars/${searchParams}`)}
            style={{ padding: '8px 24px' }}
          >
            <GearIcon
              color="primary"
              style={{ marginRight: '8px', fontSize: '1.2rem' }}
            />
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ color: 'primary' }}
            />
          </ListItem>
        </List>
      </FiltersWrapper>
    </Drawer>
  );
}

export default FilterDrawer;

function KeywordFilter() {
  const Context = useContext(State);
  const { keyword } = Context.filters;
  const [search, setSearch] = React.useState(keyword);
  const updateSearch = (val) => {
    if (isEmpty(val)) {
      return setSearch(null);
    }

    return setSearch(val);
  };

  const dSearch = useDebounce(search, 500);

  React.useEffect(() => {
    Context.updateFilters('keyword', dSearch);
    //eslint-disable-next-line
  }, [dSearch]);

  return (
    <SearchWrapper>
      <SearchBar
        fullWidth
        color="primary"
        variant="outlined"
        placeholder={strings.Event.inputs.name}
        id="Em_eventSearchbar"
        value={search || ''}
        onChange={updateSearch}
      />
    </SearchWrapper>
  );
}
