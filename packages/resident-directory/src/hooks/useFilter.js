/** @format */

import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';

function filterByCareSetting(residents = [], careSettings = []) {
  if (!residents) {
    return [];
  }

  if (careSettings.length === 0) {
    return residents;
  }

  return residents.filter((resident) => {
    // filters either by careSetting or by residentGroups and returns the filtered users
    const careSettingMatch = careSettings.includes(resident.careSetting);
    const residentGroupMatch =
      resident.residentGroups && resident.residentGroups.length > 0
        ? resident.residentGroups.filter((group) =>
            careSettings.includes(group.name),
          )?.length || null
        : null;

    return careSettingMatch || residentGroupMatch;
  });
}

function filterList(array = [], searchTerm, filters) {
  if (searchTerm && array) {
    return array.filter((resident) => {
      return filters.some((key) => {
        if (typeof resident[key] !== 'string') {
          return false;
        }
        return (
          resident[key].toLowerCase().includes(searchTerm.toLowerCase()) ===
          true
        );
      });
    });
  }

  // return the array if we don't have a searchTerm
  return array;
}

const useFilter = (
  { searchTerm = '', careSettings = [] },
  array = [],
  filters,
) => {
  const [filtered, setFiltered] = useState(array);
  let lastArray = useRef();

  // multiple use effects to capture each update case
  // 1. someone edits a resident, updating the list content and rerendering
  useEffect(() => {
    if (!isEqual(lastArray.current, array)) {
      setFiltered(
        filterByCareSetting(
          filterList(array, searchTerm, filters),
          careSettings,
        ),
      );
    }

    lastArray.current = array;
    // eslint-disable-next-line
  }, [array]);

  // 2. someone updates the searchterm, rerendering the list
  useEffect(() => {
    setFiltered(
      filterByCareSetting(filterList(array, searchTerm, filters), careSettings),
    );
    // eslint-disable-next-line
  }, [searchTerm, careSettings]);

  return filtered;
};

export default useFilter;
