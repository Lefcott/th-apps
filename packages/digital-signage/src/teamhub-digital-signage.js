/** @format */

import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import 'url-search-params-polyfill';
import 'rc-swipeout/assets/index.css';
import { ScheduleProvider } from './contexts/ScheduleProvider';
import { CommunityProvider } from './contexts/CommunityProvider';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Button } from '@material-ui/core';
import {
  MuiThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import { theme } from './utilities/theme';
import { DestinationsProvider } from './contexts/DestinationsProvider';

const WithProviders = (props) => {
  const notistackRef = React.useRef();
  const onDismissToast = (key) => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: 'dig-sign',
        seed: 'dig-sign',
      })}
      injectFirst
    >
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider
            ref={notistackRef}
            hideIconVariant
            action={(key) => (
              <Button
                style={{ color: '#ffffff', fontWeight: 'bold' }}
                onClick={() => onDismissToast(key)}
              >
                {' '}
                Dismiss
              </Button>
            )}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            style={{ width: 350 }}
          >
            <CommunityProvider>
              <DestinationsProvider>
                <ScheduleProvider>
                  <App {...props} />
                </ScheduleProvider>
              </DestinationsProvider>
            </CommunityProvider>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: WithProviders,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
