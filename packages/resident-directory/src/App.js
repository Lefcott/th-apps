/** @format */

import React, { useState } from 'react';
import { Grid, useMediaQuery } from '@material-ui/core';
import Settings from 'luxon/src/settings.js';
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import { GET_ACTIVE_ID } from './graphql/localState';
import { useQuery } from '@teamhub/apollo-config';
import styled from '@emotion/styled';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { activeResidentVar } from './apollo.config';
import ResidentList from './components/ResidentList';
import ResidentCard from './components/ResidentCard';
import ListActions from './components/ListActions';
import { useCurrentUser, useFlags } from '@teamhub/api';
import { FilterProvider } from './components/FilterProvider';
import AddResidentButton from './components/AddResidentButton';
import ManageGroupsButton from './components/ManageGroupsButton';
import IntegrationsWarning from './components/IntegrationsWarning';
import { IntegrationsProvider } from './contexts/IntegrationsProvider';
import usePrevious from './hooks/usePrevious';

// UI Components used in App
const AppContainer = styled.div`
  margin: 25px;
  padding-top: 8px;

  @media (max-width: 960px) {
    margin: 0;
    padding-top: 0;
  }
`;

const ListContainer = styled(Grid)`
  background-color: #e5e5e5;
  border-right: 1px solid #cccccc;
  height: 100%;
  display: flex;
  flex-flow: column;
  height: 100%;
  height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  /* height: fill-available; */
`;

const CardContainer = styled(Grid)`
  height: 100%;
`;

const MainWrapper = styled(Grid)`
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  height: 80vh;

  @media (max-width: 960px) {
    height: 100%;
    height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
    /* height: fill-available; */
    padding-top: 0;
  }
`;

// End of UI Components
const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: { main: '#4c43db' },
    secondary: { main: '#cc4c3b' },
  },
});

const useStyles = makeStyles((theme) => ({
  virtuoso: {
    ' & > div > div': {
      [theme.breakpoints.down('sm')]: {
        paddingBottom: '4.5rem',
      },
    },
  },
  manageGroupsFab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(21.25),
    borderRadius: '4px',
    zIndex: 200,
    width: 'auto',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    borderRadius: '4px',
    zIndex: 200,
    width: 'auto',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
}));

function App(props) {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [nextResident, setNextResident] = useState();
  const [residentGroupDeleted, setResidentGroupDeleted] = useState(false);
  const { data: { activeId } = {} } = useQuery(GET_ACTIVE_ID);
  const previousActiveId = usePrevious(activeId);
  const classes = useStyles();

  const { 'teamhub-resident-groupings': residentGroupsEnabled } = useFlags();

  const [currentUser, loading, err] = useCurrentUser({
    onCompleted: (user) => {
      if (user && user.community) {
        Settings.defaultZoneName = user.community.timezone.name;
      }
    },
  });

  function addNewUser() {
    activeResidentVar('new');
  }

  function isListHidden() {
    return isMobile && activeId ? { display: 'none' } : null;
  }

  function isCardHidden() {
    return isMobile && !activeId ? { display: 'none' } : null;
  }

  return (
    <AppContainer>
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <IntegrationsProvider>
            {residentGroupsEnabled && (
              <ManageGroupsButton
                activeId={activeId}
                classes={classes}
                setResidentGroupDeleted={setResidentGroupDeleted}
              />
            )}
            <AddResidentButton
              addResident={addNewUser}
              activeId={activeId}
              classes={classes}
            />
            <IntegrationsWarning />
            <MainWrapper container>
              <FilterProvider>
                <ListContainer
                  style={isListHidden()}
                  item
                  xs={12}
                  sm={12}
                  md={6}
                >
                  <ListActions activeId={activeId} />
                  <ResidentList
                    classes={classes}
                    activeId={activeId}
                    setResidentGroupDeleted={setResidentGroupDeleted}
                    residentGroupDeleted={residentGroupDeleted}
                  />
                </ListContainer>
                <CardContainer
                  style={isCardHidden()}
                  item
                  xs={12}
                  sm={12}
                  md={6}
                >
                  <ResidentCard
                    me={currentUser || {}}
                    activeId={activeId}
                    previousActiveId={previousActiveId}
                    nextResident={nextResident}
                  />
                </CardContainer>
              </FilterProvider>
            </MainWrapper>
          </IntegrationsProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </AppContainer>
  );
}

export default App;
