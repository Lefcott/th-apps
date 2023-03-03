/** @format */
import React from "react";
import { Box } from "@material-ui/core";
import {
  MuiThemeProvider,
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import theme from "./utils/theme";
import { SettingsView } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App(props) {
  return (
    <Box display="flex" flex={1} flexDirection="column">
      <StylesProvider
        generateClassName={createGenerateClassName({
          productionPrefix: "settings",
          seed: "settings",
        })}
      >
        <MuiThemeProvider theme={theme}>
          <Router basename="settings">
            <Route
              path="/"
              render={(routeProps) => (
                <SettingsView {...routeProps} singleSpa={props.singleSpa} />
              )}
            />
          </Router>
        </MuiThemeProvider>
      </StylesProvider>
    </Box>
  );
}
