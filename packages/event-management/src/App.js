/** @format */

import React, { useReducer } from 'react';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import State from './components/StateProvider';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Event from './pages/Event';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Broken from './pages/Broken';
import { useCurrentUser } from '@teamhub/api';
import { theme } from './theme';

const reducer = (oldState, newState) => ({ ...oldState, ...newState });
const RestrictedRoute = ({ component: Component, hasTimezone, ...rest }) => (
  <Route {...rest}>
    {!_isEmpty(hasTimezone) ? <Component /> : <Redirect to="/broken" />}
  </Route>
);

function App() {
  const [loading, setLoading] = React.useState(true);
  const [state, setState] = useReducer(reducer, {
    timezone: null,
    editRecurring: false,
    allCalSelected: false,
    filters: {
      date: new Date(),
      statuses: ['published', 'draft'],
      eventCalendars: ['initialCal'],
      eventTypes: ['initialType'],
      keyword: null,
    },
    pageState: {
      calendar: {
        sidebarStatusExpanded: true,
      },
    },
  });

  const [user] = useCurrentUser({
    onCompleted: (user) => {
      if (user && user.community) {
        try {
          const timezone = user.community.timezone.name;
          moment.tz.setDefault(timezone);
          setState({ timezone });
          setLoading(false);
        } catch (err) {
          setState({ timezone: 'invalid' });
          setLoading(false);
        }
      }
    },
  });

  function updateFilters(name, val) {
    const filters = state.filters;
    filters[name] = val;
    setState({ filters });
  }

  function addFilter(name, value) {
    const filters = state.filters;

    if (!filters[name].includes(value)) {
      setState({ filters: { ...filters, [name]: [...filters[name], value] } });
    }
  }

  function removeFilter(name, value) {
    const filters = state.filters;

    if (filters[name]) {
      setState({
        filters: {
          ...filters,
          [name]: filters[name].filter((_value) => _value !== value),
        },
      });
    }
  }

  function setRecurring(isRecurring) {
    setState({ editRecurring: isRecurring });
  }

  function setAllCalendarSelected(isSelected) {
    setState({ allCalSelected: isSelected });
  }

  /**
   * Sets the state of a value for the page.
   * Uses a page (category) to help organize settings.
   *
   * @param {String} page Top level settings category
   * @param {String} name Name of the setting
   * @param {String|Bool|Number} val Value
   */
  function setPageState(page, name, val) {
    const pageState = state.pageState;
    const settings = pageState[page];
    settings[name] = val;

    setState({
      pageState: {
        ...pageState,
        [page]: {
          ...settings,
        },
      },
    });
    setState(pageState);
  }

  // set up our context object
  const context = {
    updateFilters,
    addFilter,
    removeFilter,
    setRecurring,
    setAllCalendarSelected,
    setPageState,
    ...state,
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <State.Provider value={context}>
          {!loading && state.timezone && (
            <Router basename="events">
              <Switch>
                <RestrictedRoute
                  exact
                  path="/"
                  component={Calendar}
                  hasTimezone={_get(user, 'community.timezone.name', '')}
                />
                <Route path="/settings/*" component={Settings} />
                <Route path="/broken" component={Broken} />
                <Route path="/:id/date/:date" component={Event} />
                <Route path="/:id" component={Event} />
              </Switch>
            </Router>
          )}
        </State.Provider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

export default App;
