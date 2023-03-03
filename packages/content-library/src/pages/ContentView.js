import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { isUndefined, get } from 'lodash';
import { FullPageSpinner } from '../utils/loaders';
import ActionToolbar from '../components/ActionToolbar';
import ContentLibrary from '../components/ContentLibrary';
import ContentGrid from '../components/ContentGrid';
import Settings from 'luxon/src/settings.js';
import { useCurrentUser } from '@teamhub/api';

const MainContainer = styled.div`
  /* kind of an annoying css hack here we can probably pass widths and such from a master 'style-guide' module */
  max-width: calc(100vw - 56px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: calc(100vh - 4rem);

  @media (max-width: 960px) {
    max-width: 100vw;
  }
`;

const ContentWrapper = styled.div`
  padding: 35px 50px;
  @media (max-width: 960px) {
    padding: 25px;
  }
`;

const sections = {
  designs: {
    name: 'design',
    header: 'Designs',
    description: 'Content made using the Creator',
    accessible: 'create',
  },
  documents: {
    name: 'document',
    header: 'Documents',
    description: 'Uploaded pdf files',
    accessible: 'upload',
  },
  photos: {
    name: 'photo',
    header: 'Photos',
    description: 'Uploaded photos',
    accessible: 'upload',
  },
};
export default function ContentView() {
  let match = useRouteMatch();
  const location = useLocation();
  const [toolbarSticky, setToolbarSticky] = useState(false);
  const [scrolledBottom, setScrolledBottom] = useState(false);
  const [viewFilter, setViewFilter] = useState('myContent');
  const [refetch, setRefetch] = useState(false);
  const ScrollContainer = useRef(null);
  const [user, loading, err] = useCurrentUser({
    onCompleted: (user) => {
      try {
        if (user && user.community) {
          const timezone = get(user, 'community.timezone.name', null);
          if (timezone) {
            Settings.defaultZoneName = timezone;
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  const ownerId = get(user, '_id');

  const onScroll = ({ target }) => {
    const { scrollTop, scrollHeight, offsetHeight } = target;
    const limit = location.pathname === '/' ? 200 : 150;
    if (scrollTop >= limit) {
      setToolbarSticky(true);
    } else if (toolbarSticky) {
      setToolbarSticky(false);
    }

    if (scrollTop >= scrollHeight - offsetHeight - 2) {
      setScrolledBottom(true);
    } else if (scrolledBottom) {
      setScrolledBottom(false);
    }
  };
  useEffect(() => {
    if (!isUndefined(ownerId)) {
      ScrollContainer.current.scrollTop = 0;
      setToolbarSticky(false);
    }
  }, [ownerId]);
  if (isUndefined(ownerId)) return <FullPageSpinner />;
  return (
    <MainContainer ref={ScrollContainer} onScroll={onScroll}>
      <ActionToolbar
        isMultiView={location.pathname === '/'}
        isSticky={toolbarSticky}
        refetchContent={setRefetch}
        ownerId={ownerId}
      />
      <ContentWrapper>
        <Switch>
          <Route path={[`/documents`, `/photos`, `/designs`]}>
            <ContentGrid
              section={sections[location.pathname.slice(1)]}
              viewFilter={viewFilter}
              setViewFilter={setViewFilter}
              ownerId={ownerId}
              scrolledBottom={scrolledBottom}
            />
          </Route>
          <Route exact path={match.path}>
            <ContentLibrary
              viewFilter={viewFilter}
              setViewFilter={setViewFilter}
              refetch={refetch}
              setRefetch={setRefetch}
              ownerId={ownerId}
            />
          </Route>
        </Switch>
      </ContentWrapper>
    </MainContainer>
  );
}
