import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { theme } from './theme.js';
import {
  MuiThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import ContentView from './pages/ContentView';

export default function App() {
  return (
    <StylesProvider
      generateClassName={createGenerateClassName({
        productionPrefix: 'content-lib',
        seed: 'content-lib',
      })}
    >
      <MuiThemeProvider theme={theme}>
        <Router basename="library">
          <Switch>
            <Route path="/" component={ContentView} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </StylesProvider>
  );
}
