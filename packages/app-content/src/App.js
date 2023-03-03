/** @format */

import React, { useRef, useState, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './app.css';
import styled from '@emotion/styled';
import { useMediaQuery } from '@material-ui/core';
import { FullPageSpinner } from './utils/loaders';
import { getOneSearchParam } from './utils/url';
import { getCurrentUser } from '@teamhub/api';

// code split along new and old, so users dont have to load double the code if not necessary
const PostModal = React.lazy(() => import('./components/PostModal'));
const FeedContainer = React.lazy(() => import('./components/FeedContainer'));

const AppWrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function App() {
  const isMobile = useMediaQuery('(max-width:960px)');
  const [me, setMe] = React.useState(null);
  const communityId = getOneSearchParam('communityId', '2476');
  const [appLoading, setAppLoading] = useState(true);
  const [timezone, setTimezone] = useState();
  React.useEffect(() => {
    getCurrentUser().subscribe((user) => {
      setMe(user);
      setTimezone(user.community.timezone.name);
      setAppLoading(false);
    });
  }, []);

  /* feature-flags */
  return (
    <AppWrapper id="app_wrapper">
      {appLoading ? (
        <FullPageSpinner />
      ) : (
        <Router basename="/publisher">
          <Switch>
            <Redirect
              exact
              from="/"
              to={{
                pathname: '/feed',
                search: `communityId=${communityId}`,
              }}
            />
            <Route
              path="/feed"
              render={({ match: { url }, location }) => (
                <>
                  <Suspense fallback={<FullPageSpinner />}>
                    <FeedContainer
                      isMobile={isMobile}
                      timezone={timezone}
                      location={location}
                    />
                    <Route
                      exact
                      path={`${url}/post`}
                      render={(routeProps) => (
                        <PostModal {...routeProps} me={me || {}} />
                      )}
                    />
                    <Route
                      render={(routeProps) => (
                        <PostModal
                          {...routeProps}
                          me={me || {}}
                          timezone={timezone}
                        />
                      )}
                      exact
                      path={`${url}/post/:id`}
                    />
                  </Suspense>
                </>
              )}
            />
          </Switch>
        </Router>
      )}
    </AppWrapper>
  );
}
