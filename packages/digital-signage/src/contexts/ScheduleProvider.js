/** @format */

import React from 'react';
import { getOneSearchParam } from '@teamhub/api';
import ManagerApi from '../api/managerApi';
import { identity, isEqual, find, pickBy } from 'lodash';
import DocumentApi from '../api/documentApi';
import { useSnackbar } from 'notistack';
import { useCommunity } from './CommunityProvider';

export const ScheduleContext = React.createContext();

const filterDefaultState = {
  sort: 'updatedAt:desc',
  destination: null,
  timestamp: null,
  search: '',
};
export function ScheduleProvider(props) {
  const { communityId } = useCommunity();
  const { enqueueSnackbar } = useSnackbar();
  const [schedules, setSchedules] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState(filterDefaultState);
  const [activeSchedule, setActiveSchedule] = React.useState({
    new: false,
    data: null,
    fromRecent: false,
  });
  const filterRef = React.useRef();

  function escapeRegExp(text) {
    return text.replace(/[%]/g, '\\$&');
  }
  const getSchedules = async (filterParams) => {
    setLoading(true);
    // if no filterParams passed, pass the state filters obj
    const pickedFilters = pickBy(filterParams || filters, identity);
    if (pickedFilters.search) {
      // escape the search so that it doesn't blow up in the sql side
      pickedFilters.search = encodeURIComponent(
        escapeRegExp(pickedFilters.search),
      );
    }

    const params = { communityId, ...pickedFilters };
    let res = await ManagerApi.getSchedule(params);
    if (res !== 'error') {
      await setSchedules(res);
      setLoading(false);
      return res;
    } else {
      setSchedules([]);
      setLoading(false);
      return [];
    }
  };

  function alreadyPublished(id, playlist) {
    return find(playlist, ({ Document }) => Document.guid === id);
  }

  async function setInitialPublishingState(playlist) {
    const contentId = getOneSearchParam('contentId');
    if (contentId) {
      const existingSchedule = alreadyPublished(contentId, playlist);
      // if its already in the list, we use the found document
      if (!existingSchedule) {
        const newDoc = await DocumentApi.getOne(contentId);
        updateActiveSchedule(newDoc, true);
      } else {
        updateActiveSchedule(existingSchedule, false, true);
      }
    }
  }

  function updateActiveSchedule(data, isNew, fromRecent = false) {
    setActiveSchedule({
      data,
      new: isNew,
      fromRecent,
    });
  }

  async function publishSchedule(data, name) {
    const res = await ManagerApi.postSchedule(data);
    if (res !== 'error') {
      enqueueSnackbar(`${name} was successfully published`);
      updateActiveSchedule(null, false);
      const what = await getSchedules(filters);
    } else {
      enqueueSnackbar(`An error occurred publishing ${name}`, {
        variant: 'error',
      });
    }
  }

  async function unpublishSchedule(data) {
    const document = data.Document;
    const destinationIds = data.Destinations.map((destination) => {
      return destination.guid;
    });
    const params = {
      documents: document.guid,
      destinations: destinationIds,
    };

    const res = await ManagerApi.deleteSchedule(params);
    if (res !== 'error') {
      enqueueSnackbar(`${document.name} was successfully unpublished`);
      getSchedules(filters);
      updateActiveSchedule(null, false, false);
    } else {
      enqueueSnackbar(
        `An error occured attempting to unpublish ${document.name}`,
        { variant: 'error' },
      );
    }
  }

  React.useEffect(() => {
    if (!isEqual(filters, filterRef.current)) {
      getSchedules(filters).then((playlist) => {
        setInitialPublishingState(playlist);
        filterRef.current = filters;
      });
    }

    //eslint-disable-next-line
  }, [filters]);

  const value = {
    getSchedules,
    activeSchedule,
    updateActiveSchedule,
    unpublishSchedule,
    schedules,
    filters,
    setFilters,
    loading,
    alreadyPublished,
    publishSchedule,
  };
  return (
    <ScheduleContext.Provider value={value}>
      {props.children}
    </ScheduleContext.Provider>
  );
}

export function useSchedules() {
  const context = React.useContext(ScheduleContext);
  if (!context) {
    throw new Error('Must use useSchedules hook inside of a ScheduleProvider');
  }

  return context;
}
