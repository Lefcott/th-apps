/** @format */

import React from 'react';
import {
  StylesProvider,
  createGenerateClassName,
  ThemeProvider,
} from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CommunitySelector from './components/CommunitySelector';
import ResetPassword from './components/ResetPassword';
import LoginForm from './components/LoginForm';
import RedirectPage from './components/RedirectPage';
import RequestReset from './components/RequestReset';
import Container from './components/Container';
import theme from './utils/theme';

export default function App(props) {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: 'teamhub-auth',
        seed: 'teamhub-auth',
      })}
    >
      <ThemeProvider theme={theme}>
        <Container>
          <Router basename="login">
            <Switch>
              <Route exact path="/">
                <LoginForm />
              </Route>
              <Route path="/community">
                <CommunitySelector />
              </Route>
              <Route path="/reset">
                <ResetPassword />
              </Route>
              <Route path="/request-reset">
                <RequestReset />
              </Route>
              <Route path="/redirect">
                <RedirectPage />
              </Route>
            </Switch>
          </Router>
        </Container>
      </ThemeProvider>
    </StylesProvider>
  );
}
