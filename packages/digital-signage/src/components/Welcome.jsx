/** @format */

import React, { useState, useEffect } from 'react';
import { useSchedules } from '../contexts/ScheduleProvider';
import { FilesPlaceholder } from '../assets/placeholders';
import { isNull, isEqual } from 'lodash';
import broken from '../assets/images/broken.svg';
import Thumbnail from './Thumbnail';
import RecentDocList from './RecentDocList';
import DocumentApi from '../api/documentApi';
import greetings from '../assets/images/welcome.svg';
import Grid from '@material-ui/core/Grid';
import Searchbar from './Searchbar';
import NoSearchResults from './NoSearchResults';
import { useCommunity } from '../contexts/CommunityProvider';
let docParams = {
  template: false,
  sort: encodeURI(
    JSON.stringify([{ property: 'updatedAt', direction: 'DESC' }]),
  ),
  limit: 10,
  page: 0,
  start: 0,
};

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,;\\^$|#\s]/g, '\\$&');
}

function useDebounce(searchTerm, delay = 300) {
  const [dSearch, setDSearch] = React.useState(searchTerm);
  React.useEffect(() => {
    const handler = setTimeout(
      () => setDSearch(escapeRegExp(searchTerm)),
      delay,
    );
    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return dSearch;
}

function Welcome() {
  const { schedules, alreadyPublished, updateActiveSchedule } = useSchedules();
  const { communityId } = useCommunity();

  const [recentDocs, setRecentDocs] = useState([]);
  const [search, setSearch] = React.useState('');

  const debouncedSearchTerm = useDebounce(search);
  useEffect(() => {
    docParams.communityId = communityId;
    getRecents(debouncedSearchTerm);
  }, [communityId, debouncedSearchTerm]);

  const getRecents = async (searchTerm) => {
    // if we have a search term, we use it in the query
    if (searchTerm) {
      docParams.search = encodeURIComponent(searchTerm);
    } else {
      delete docParams.search;
    }
    const res = await DocumentApi.getRecents(docParams);
    const docs = isEqual(res, 'error') ? null : res.documents;
    setRecentDocs(docs);
  };

  const noDataView = isNull(recentDocs) ? (
    <Thumbnail src={broken} style={imgStyle} />
  ) : (
    <FilesPlaceholder />
  );
  return (
    <>
      <Grid container style={imgWrapper}>
        <Thumbnail src={greetings} style={{ width: '100%' }} />
      </Grid>
      <Grid container style={listStyle}>
        <div style={{ margin: '10px 10px 5px 10px' }}>
          <Searchbar
            value={search}
            onChange={setSearch}
            variant="outlined"
            style={{ background: '#fff' }}
            fullWidth
            placeholder="Search for recently saved docs"
            id="DSM_Recent-Docs-Search-Bar"
          />
        </div>
        {recentDocs && recentDocs.length ? (
          <RecentDocList
            documents={recentDocs}
            scheduleClick={(file) => {
              const exists = alreadyPublished(file.guid, schedules);
              updateActiveSchedule(exists || file, !exists, !!exists);
            }}
          />
        ) : debouncedSearchTerm.length > 0 ? (
          <NoSearchResults filter={{ search }} />
        ) : (
          noDataView
        )}
      </Grid>
    </>
  );
}

const imgWrapper = {
  flex: '1 1 -1%',
  display: 'flex', 
};

const listStyle = {
  flex: 1,
  flexShrink: 1,
  flexBasis: '18%',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexFlow: 'column',
  position: 'relative',
};

const imgStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export default Welcome;
