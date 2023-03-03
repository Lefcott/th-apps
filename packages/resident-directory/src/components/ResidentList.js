/**
 * /* eslint-disable
 *
 * @format
 */

import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useMediaQuery } from '@material-ui/core';
import { Virtuoso } from 'react-virtuoso';
import { isEqual } from 'lodash';
import errorImg from '../assets/images/error.svg';
import AutoSizer from 'react-virtualized-auto-sizer';
import ListItem from './ListItem';
import { ListPlaceholder } from '../utils/loadingPlaceholders';
import AddNewListItem from './AddNewListItem';
import { ListEmptyState } from './EmptyState';
import { useFilters } from './FilterProvider';
import { activeResidentVar } from '../apollo.config';
import { getCommunityId } from '@teamhub/api';
import useResidentList from '../hooks/useResidentList';
import { IntegrationsContext } from '../contexts/IntegrationsProvider';

const ListWrapper = styled.div`
  flex: 1 1 auto;
  overflow: auto;
  margin: 10px 0;
  overflow-x: hidden;
`;

const ErrorImg = styled.img`
  display: block;
  margin: 50px auto;
`;

const VirtualList = function VirtualList({ classes, ...props }) {
  const { residents, activeId } = props;
  const virtuoso = React.useRef();

  const { integrations } = React.useContext(IntegrationsContext);
  const { residentIntegrationEnabled = false } = integrations;

  function renderItem(index) {
    return (
      <ListItem
        communityId={props.communityId}
        key={residents[index]._id}
        resident={residents[index]}
        isActive={residents[index]._id === activeId}
        residentIntegrationEnabled={residentIntegrationEnabled}
      />
    );
  }

  function handleScroll(e) {
    const scrollPos = e.target.scrollTop;
    let hidden = true;
    if (scrollPos > 100) {
      hidden = false;
    }
  }

  const lastId = React.useRef();

  function scrollToTop() {
    if (virtuoso.current) {
      virtuoso.current.scrollToIndex({ index: 0, align: 'top' });
    }
  }

  React.useEffect(() => {
    if (activeId === 'new') {
      scrollToTop();
    }

    if (lastId.current === 'new' && activeId !== 'new') {
      const index = residents.findIndex((res) => res._id === activeId);
      if (virtuoso.current) {
        virtuoso.current.scrollToIndex({ index, align: 'top' });
      }
    }
    lastId.current = activeId;
  }, [activeId]);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <div onScroll={handleScroll}>
          <Virtuoso
            totalCount={residents.length}
            item={renderItem}
            className={classes.virtuoso}
            style={{ width, height }}
            overscan={100}
            ref={virtuoso}
          />
        </div>
      )}
    </AutoSizer>
  );
};

function ResidentList(props) {
  const {
    activeId,
    classes,
    setResidentGroupDeleted,
    residentGroupDeleted,
  } = props;
  const isMobile = useMediaQuery('(max-width:960px)');
  const communityId = getCommunityId();
  const { loading, error, residents, refetch } = useResidentList();
  const [{ search, careSettings }] = useFilters();
  const isNewResident = isEqual(activeId, 'new');

  // if currResident is not in the filtered list, we want to update
  // the currResident to be null, so the card shows an empty state
  useEffect(() => {
    if (!loading) {
      let guids = residents.map((res) => res._id);
      // check the currRes guid against the filtered list of guids
      if (!guids.find((_id) => _id === activeId) && !isNewResident) {
        // if its not there, and the list has users, default to the first user
        if (guids.length > 0) {
          const isMobileId = isMobile ? null : residents[0]._id;
          activeResidentVar(isMobileId);
        } else {
          activeResidentVar(null);
        }
      }
    }
  }, [residents.length, isMobile]);

  useEffect(() => {
    // Refetch resident whenever a resident groups is selected because the groups are removed from them
    if (residentGroupDeleted) {
      refetch();
    }

    // Set the flag to false to repeat process several times in a row
    if (!loading && residentGroupDeleted) {
      setResidentGroupDeleted(false);
    }
  }, [residentGroupDeleted, loading]);

  if (loading) return <ListPlaceholder />;

  if (error) {
    console.error(error);
    return <ErrorImg src={errorImg} alt="error" />;
  }

  if (residents && !loading) {
    return (
      <>
        {residents.length > 0 ? (
          <ListWrapper>
            <AddNewListItem isHidden={isNewResident ? false : true} />
            <VirtualList
              classes={classes}
              residents={residents}
              activeId={activeId}
              communityId={communityId}
            />
          </ListWrapper>
        ) : (
          <ListEmptyState search={search} careSettings={careSettings} />
        )}
      </>
    );
  }

  return (
    <ListWrapper>
      <p>No residents in this community</p>
    </ListWrapper>
  );
}

export default ResidentList;
