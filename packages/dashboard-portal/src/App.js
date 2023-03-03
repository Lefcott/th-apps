/** @format */

import React from 'react';
import {
  ThemeProvider,
  createMuiTheme,
  StylesProvider,
  createGenerateClassName,
  makeStyles,
} from '@material-ui/core/styles';
import { Grid, Box, useMediaQuery } from '@material-ui/core';
import Greeting from './components/Greeting';
import Settings from 'luxon/src/settings.js';
import { useCurrentUser } from '@teamhub/api';
import { SupportCard } from './components/Cards';
import MailNotifier from './components/MailNotifier';
import QuickLinks from './components/QuickLinks';
import IntegrationMarkplaceCard from './components/IntegrationMarketplaceCard';

const useStyles = makeStyles((theme) => ({
  paddingBox: {
    padding: '10px',
  },
}));
export const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: { main: '#4c43db' },
    secondary: { main: '#cc4c3b' },
    text: {
      primary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  overrides: {
    MuiSnackbar: {
      root: {
        '& button': { color: '#c3bfff !important' },
      },
    },
  },
});

function App(props) {
  const isMobile = useMediaQuery('(max-width: 960px)');
  const [me, loading, err] = useCurrentUser({
    onCompleted: (data) => {
      if (data && data.community) {
        const timezone = data.community.timezone.name;
        Settings.defaultZoneName = timezone;
      }
    },
  });

  const classes = useStyles();
  if (!me) {
    return null;
  }

  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        seed: 'teamhub-portal',
        productionPrefix: 'teamhub-portal',
      })}
    >
      <ThemeProvider theme={theme}>
        <Box
          padding="24px"
          style={{ overflowX: 'hidden' }}
          height="calc((100vh - 4rem) - 48px)"
          maxHeight="calc((100vh - 4rem) - 48px)"
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
        >
          {isMobile ? (
            <div>
              <Greeting user={me} />
              <div className={classes.paddingBox} />
              <IntegrationMarkplaceCard />
              <div className={classes.paddingBox} />
              <MailNotifier user={me} />
              <div className={classes.paddingBox} />
              <QuickLinks user={me} />
              <div className={classes.paddingBox} />
              <SupportCard />
              <div className={classes.paddingBox} />
            </div>
          ) : (
            <Grid style={{ flexGrow: 1 }} container spacing={2}>
              <Grid item container sm={8} xs={12} spacing={2}>
                <Grid item xs={12}>
                  <Greeting user={me} />
                </Grid>
                <Grid item xs={12}>
                  <SupportCard />
                </Grid>
              </Grid>
              <Grid
                item
                container
                sm={4}
                xs={12}
                spacing={2}
                justify="flex-start"
                direction="column"
                style={{ paddingRight: 0, width: '100%', marginRight: 0 }}
              >
                <Grid
                  item
                  xs={12}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <IntegrationMarkplaceCard />
                  <div className={classes.paddingBox} />
                  <QuickLinks user={me} />
                  <div className={classes.paddingBox} />
                  <MailNotifier user={me} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default App;
