/** @format */

import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core';
import { useSchedules } from '../contexts/ScheduleProvider';
import eyeSlash from '../assets/icons/eye-slash.svg';
import eyeSlashWhite from '../assets/icons/eye-slash-white.svg';
import { useSnackbar } from 'notistack';
import { ListPlaceholder } from '../assets/placeholders';
import NoSearchResults from './NoSearchResults';
import ListItem from './ListItem';
import { findIndex, isEqual } from 'lodash';
import { Virtuoso } from 'react-virtuoso';
import SwipeWrapper from './SwipeWrapper';
import AutoSizer from 'react-virtualized-auto-sizer';
import AddNewListItem from './AddNewListItem';

const useStyles = makeStyles((theme) => ({
  listInnerWrapper: {
    width: '100%',
    flex: 1,
    paddingBottom: '10px',
  },
  thumbnail: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  itemWrapper: {
    padding: '4px 15px',
  },
}));

function List() {
  const {
    updateActiveSchedule,
    activeSchedule,
    schedules,
    unpublishSchedule,
    filters,
    loading,
  } = useSchedules();
  const isMobile = useMediaQuery('(max-width:960px)');
  const virtuosoList = React.useRef(null);
  const classes = useStyles();
  const itemOnClick = (data) => {
    updateActiveSchedule(data, false);
  };

  const listItemActions = [
    {
      name: 'Unpublish',
      value: 'unpublish',
      action: unpublishSchedule,
      dropdownProperties: {
        icon: eyeSlash,
        style: {
          color: '#e52d2d',
        },
      },
      swipeProperties: {
        position: 'right',
        icon: eyeSlashWhite,
        style: {
          background: '#e52d2d',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
          paddingTop: '2px',
          width: '90px',
        },
      },
    },
  ];

  useEffect(() => {
    if (
      activeSchedule.data &&
      !activeSchedule.new &&
      activeSchedule.fromRecent
    ) {
      const { guid } = activeSchedule?.data?.Document;
      const index = findIndex(schedules, (item) =>
        isEqual(item.Document.guid, guid),
      );

      virtuosoList.current.scrollToIndex({ index, align: 'start' });
      updateActiveSchedule(activeSchedule.data, activeSchedule.new, false);
    }
    // eslint-disable-next-line
  }, [activeSchedule]);

  const renderItems = (index) => {
    const props = {
      data: schedules[index],
      listItemActions,
      onClick: itemOnClick,
      activeGuid: activeSchedule?.data?.Document?.guid,
    };

    return (
      <div
        className={classes.itemWrapper}
        key={schedules[index]?.Document?.guid || index}
      >
        <ListItem {...props} />
      </div>
    );
  };

  const renderMobileItems = (index) => {
    const props = {
      data: schedules[index],
      listItemActions,
      onClick: itemOnClick,
      activeGuid: activeSchedule?.data?.Document?.guid,
    };

    return (
      <div
        className={classes.itemWrapper}
        key={schedules[index]?.Document?.guid || index}
      >
        <SwipeWrapper {...props}>
          <ListItem {...props} />
        </SwipeWrapper>
      </div>
    );
  };

  return (
    <>
      {activeSchedule.new && <AddNewListItem document={activeSchedule.data} />}
      {loading ? (
        <ListPlaceholder />
      ) : schedules && schedules.length > 0 ? (
        <>
          <div className={classes.listInnerWrapper}>
            <AutoSizer>
              {({ height, width }) => (
                <Virtuoso
                  ref={virtuosoList}
                  style={{ height, width }}
                  item={isMobile ? renderMobileItems : renderItems}
                  itemHeight={70}
                  overscan={10}
                  totalCount={schedules.length}
                />
              )}
            </AutoSizer>
          </div>
        </>
      ) : (
        <NoSearchResults filter={filters} />
      )}
    </>
  );
}

export default List;
