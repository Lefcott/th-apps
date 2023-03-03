import React from "react";
import styles from "./App.module.css";
import { AppBar, Grid, Hidden, withWidth, Box } from "@material-ui/core";
import { Button } from "@material-ui/core";
import moment from "moment-timezone";
import { SnackbarProvider } from "notistack";
import {
  ResidentProvider,
  ResidentContext,
} from "./components/ResidentProvider";
import { AwayStatusProvider } from "./components/AwayStatusProvider";
import { CommunityProvider } from "./contexts/CommunityContext";
import ResidentList from "./components/ResidentList/ResidentList";
import DownloadReports from "./components/Reports";
import ResidentCard from "./components/ResidentCard/ResidentCard";
import ActivityHistory from "./components/ActivityHistory/ActivityHistory";
import ListActions from "./components/ListActions";
import { UndoProvider, UndoContext } from "./components/UndoContext";
import { ReactActionAreaPortal, useCurrentUser } from "@teamhub/api";
import AlertSnackbar from "./components/AlertStatusBar/AlertStatusBar";

function App(props) {
  const [cardHidden, setCardHidden] = React.useState(true);
  const isTabletOrBelow = ["xs", "sm"].includes(props.width);
  useCurrentUser({
    onCompleted: (user) => {
      if (user && user.community) {
        moment.tz.setDefault(user.community.timezone.name);
      }
    },
  });

  const notistackRef = React.createRef();
  const toggleView = (isVisible) => {
    if (isTabletOrBelow) {
      setCardHidden(isVisible);
    }
  };

  const isListHidden = () => {
    const style = {};
    if (isTabletOrBelow && !cardHidden) {
      style.display = "none";
    }
    return style;
  };

  const isCardHidden = () => {
    const style = {};
    if (isTabletOrBelow && cardHidden) {
      style.display = "none";
    }
    return style;
  };

  const onDismissToast = (key) => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <div className={styles.app}>
      <SnackbarProvider
        ref={notistackRef}
        hideIconVariant
        action={(key) => (
          <Button
            style={{ color: "#ffffff", fontWeight: "bold" }}
            onClick={() => onDismissToast(key)}
          >
            Dismiss
          </Button>
        )}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ width: 350 }}
      >
        <ResidentProvider>
          <CommunityProvider>
            <Hidden smDown>
              <ReactActionAreaPortal>
                <DownloadReports />
              </ReactActionAreaPortal>
            </Hidden>
            <Grid container className={styles["app-microContainer"]}>
              <UndoProvider>
                <AwayStatusProvider>
                  <Grid container className={styles["app-mainContainer"]}>
                    <Grid
                      item
                      className={styles["app-mainContainer-list"]}
                      style={isListHidden()}
                      sm={12}
                      md={6}
                    >
                      <UndoContext.Consumer>
                        {(undoContext) => (
                          <ResidentContext.Consumer>
                            {(residentContext) => (
                              <>
                                <AlertSnackbar />
                                <ListActions />
                                <ResidentList
                                  hideListView={() => toggleView(false)}
                                  undoContext={undoContext}
                                  residentContext={residentContext}
                                />
                              </>
                            )}
                          </ResidentContext.Consumer>
                        )}
                      </UndoContext.Consumer>
                    </Grid>

                    <Grid
                      item
                      className={styles["app-mainContainer-card"]}
                      style={isCardHidden()}
                      sm={12}
                      md={6}
                    >
                      <Hidden mdUp>
                        <Box position="absolute" top="0" left="0" width="100%">
                          <AppBar
                            position="static"
                            className={styles["card-mobileBar"]}
                          ></AppBar>
                        </Box>
                      </Hidden>

                      <Grid item className={styles["card-main"]}>
                        <ResidentCard updateView={() => toggleView(true)} />
                        <ActivityHistory />
                      </Grid>
                    </Grid>
                  </Grid>
                </AwayStatusProvider>
              </UndoProvider>
            </Grid>
          </CommunityProvider>
        </ResidentProvider>
      </SnackbarProvider>
    </div>
  );
}

export default withWidth()(App);
