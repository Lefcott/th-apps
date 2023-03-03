import React from "react";
import { isNull, some, isEqual } from "lodash";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Loader from "./components/Loader";
import DataInsights from "./pages/DataInsights";
import Unauthorized from "./pages/Unauthorized";
import { useCurrentUser } from "@teamhub/api";

const RestrictedRoute = ({ component: Component, isAuthed, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthed ? <Component {...props} /> : <Redirect to="/unauthorized" />
    }
  />
);

function App() {
  const [isAuthed, setIsAuthed] = React.useState(null);
  useCurrentUser({
    onCompleted: (user) => {
      if (user && user.community) {
        setIsAuthed(true);
      }
    },
  });

  if (isNull(isAuthed)) return <Loader />;
  return (
    <Router basename="/insights">
      <RestrictedRoute
        exact
        path="/"
        component={DataInsights}
        isAuthed={isAuthed}
      />
      <Route path="/unauthorized" component={Unauthorized} />
    </Router>
  );
}

export default App;
