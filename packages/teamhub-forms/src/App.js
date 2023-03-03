import React, { Suspense, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { CircularProgress } from "@material-ui/core";
import {
  StylesProvider,
  createGenerateClassName,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

import { useCurrentUser, getAuthToken } from "@teamhub/api";
import { jwt, user, communityId } from "./recoil/atoms";

import List from "./pages/List";
import Builder from "./pages/Builder";

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: { main: "#4c43db" },
    secondary: { main: "#cc4c3b" },
  },
});

function Loader() {
  return (
    <div
      style={{
        height: "calc(100vh - 4rem)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="primary" />
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 20,
    maxHeight: "100%",
    boxSizing: "border-box !important",
    height: "100%",
    overflowY: "auto",
  },
  fab: {
    zIndex: 200,
    position: "absolute",
    borderRadius: 4,
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  icon: {
    paddingRight: "4px",
  },
  descriptorItem: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  table: {
    minWidth: 480,
  },
  tableContainer: {
    marginBottom: 60,
  },
}));

function App() {
  const classes = useStyles();
  const [_jwt, setJwt] = useRecoilState(jwt);
  const [_user, setUser] = useRecoilState(user);
  const [_communityId, setCommunityId] = useRecoilState(communityId);
  const [currentUser, loadingUser, err] = useCurrentUser({
    onCompleted: (user) => {
      if (user && user.community) {
        setUser(user);
        setCommunityId(user.community._id);
      }
    },
  });

  React.useEffect(() => {
    setJwt(getAuthToken());
    // eslint-disable-next-line
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <SnackbarProvider maxSnack={3}>
        <StylesProvider
          generateClassName={createGenerateClassName({
            productionPrefix: "teamhub-forms",
            seed: "teamhub-forms",
          })}
        >
          <ThemeProvider theme={theme}>
            {loadingUser ? (
              <Loader />
            ) : (
              <div className={classes.root}>
                <Switch>
                  <Route exact path="/">
                    <List classes={classes} />
                  </Route>
                  <Route path="/builder">
                    <Builder classes={classes} />
                  </Route>
                </Switch>
              </div>
            )}
          </ThemeProvider>
        </StylesProvider>
      </SnackbarProvider>
    </Suspense>
  );
}

export default App;
