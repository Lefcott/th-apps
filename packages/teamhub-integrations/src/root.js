import React, { useRef } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import IntegrationsPage from "./components/IntegrationsPage";
import PosList from "./components/PosIntegrationList";
import YouTubePage from "./components/Youtube";
import { ApolloProvider } from "@teamhub/apollo-config";
import client from "./apollo.config";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { theme } from "./utils/theme";

export default function Root(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <div>
          <div style={{ height: "100%", overflow: "scroll", display: "flex" }}>
            <div style={{ padding: "40px", height: "100%", flex: 1 }}>
              <Router basename="/integrations">
                <Switch>
                  <Route exact path="/">
                    <IntegrationsPage />
                  </Route>
                  <Route path="/pos/:integration">
                    <PosList />
                  </Route>
                  <Route path="/content/youtube">
                    <YouTubePage />
                  </Route>
                </Switch>
              </Router>
            </div>
          </div>
        </div>
      </ApolloProvider>
    </MuiThemeProvider>
  );
}
