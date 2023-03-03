/** @format */
import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./utils/theme";
import Settings from "luxon/src/settings";
import { useCurrentUser } from "@teamhub/api";
import { DeviceAlertsView } from "./pages";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BaseAppContainer from "./components/base/BaseAppContainer";

export default function App(props) {
  useCurrentUser({
    onCompleted: (user) => {
      if (user && user.community) {
        Settings.defaultZoneName = user.community.timezone.name;
      }
    },
  });
  return (
    <BaseAppContainer>
      <MuiThemeProvider theme={theme}>
        <Router basename="building-alerts">
          <Route path="/" component={DeviceAlertsView} />
        </Router>
      </MuiThemeProvider>
    </BaseAppContainer>
  );
}
