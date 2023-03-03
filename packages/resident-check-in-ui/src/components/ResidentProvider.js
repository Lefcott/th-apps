import React, { useReducer, createContext, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import { orderBy, isEqual } from "lodash/fp";
import UsersApi from "../apis/usersApi";
import { useInterval } from "../utilities/hooks";

export const ResidentContext = createContext({});

export function ResidentProvider(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "LOAD_RESIDENTS":
          return { ...state, ...action.payload };
        case "UPDATE_RESIDENT":
          return {
            ...state,
            userData: state.userData.map((user) => {
              if (user.guid === action.payload.guid) {
                return action.payload;
              }
              return user;
            }),
            filteredList: searchFilterSort(
              state.userData.map((user) => {
                if (user.guid === action.payload.guid) {
                  return action.payload;
                }
                return user;
              }),
              state.filters,
              state.searchTerm
            ),
            selectedResident: !state.selectedResident
              ? action.payload
              : state.selectedResident.guid === action.payload.guid
              ? action.payload
              : state.selectedResident,
          };
        case "CLEAR_RESIDENT":
          return { ...state, ...action.payload };
        case "UPDATE_AWAY":
          return {
            ...state,
            userData: state.userData.map((resident) => {
              if (resident.guid === action.payload.guid) {
                return {
                  ...resident,
                  away: action.payload.away,
                  statusDates: action.payload.statusDates,
                };
              }
              return resident;
            }),
            filteredList: searchFilterSort(
              state.userData.map((user) => {
                if (user.guid === action.payload.guid) {
                  return action.payload;
                }
                return user;
              }),
              state.filters,
              state.searchTerm
            ),
          };
        case "FILTER_LIST":
          return { ...state, ...action.payload };
        case "UPDATE_SEARCHTERM":
          return { ...state, searchTerm: action.payload };
        case "UPDATE_FILTERS":
          return { ...state, filters: action.payload };
        case "SELECT_RESIDENT":
          return { ...state, selectedResident: action.payload };
        case "SELECT_NEXT_RESIDENT":
          return {
            ...state,
            selectedResident:
              state.filteredList[
                state.filteredList
                  .map((user) => user.guid)
                  .indexOf(action.payload.guid) + 1
              ],
          };
        default:
          return state;
      }
    },
    {
      userData: [],
      filteredList: [],
      selectedResident: null,
      filters: [],
      searchTerm: "",
    }
  );

  function sortList(array = []) {
    const noSystem = array.filter((user) => !user.system && !user.optOut);
    const withSystem = array.filter((user) => user.system && !user.optOut);
    const optOut = array.filter((user) => user.optOut);

    function orderByAlerts(item) {
      return item.alerts.length > 0;
    }

    const orderedList = orderBy(
      [orderByAlerts, (user) => user.lastName.toLowerCase()],
      ["desc", "asc"]
    )(withSystem);

    const optOutList = orderBy(
      [(user) => user.lastName.toLowerCase()],
      ["asc"]
    )(optOut);

    const noSystemList = orderBy(
      [(user) => user.lastName.toLowerCase()],
      ["asc"]
    )(noSystem);

    return orderedList.concat(optOutList).concat(noSystemList);
  }

  async function getUsers() {
    const userData = await UsersApi.getUsers();

    if (userData === "error") {
      return enqueueSnackbar("Trying to reconnect...", { variant: "error" });
    }

    let selectedResident;
    if (state.selectedResident && userData) {
      selectedResident = userData?.find(
        (item) => item.guid === state.selectedResident.guid
      );
    } else {
      [selectedResident] = userData;
    }

    return { userData, selectedResident };
  }

  function searchResidents(array = [], searchTerm) {
    if (searchTerm) {
      return array.filter((resident) => {
        const relevantKeys = Object.keys(resident).filter(
          (key) =>
            ~["firstName", "lastName", "fullName", "address"].indexOf(key)
        );

        // need to escape special characters to avoid unterminated literals, which is what this replace does
        const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return relevantKeys.some((a) =>
          typeof resident[a] !== "string"
            ? false
            : resident[a].toLowerCase().search(escapedSearch.toLowerCase()) !==
              -1
        );
      });
    }

    return array;
  }

  function checkCases(resident, activeFilters) {
    const filterCases = {
      "Alerts not active": resident.optOut,
      "Alerts Only":
        resident.system &&
        resident.alerts &&
        resident.alerts.length > 0 &&
        !(resident.alerts.length === 1 && resident.alerts[0].type === "issue"),
      "System Issues Only":
        resident.system &&
        resident.alerts &&
        Boolean(resident.alerts.find((alert) => alert.type === "issue")),
      "No Alerts":
        resident.system && resident.alerts && resident.alerts.length === 0,
      Away: resident.away,
      "No System": !resident.system,
    };
    // we generate a new array containing the evaluated cases only for the active filters
    const casesToCheck = activeFilters.map((filter) => filterCases[filter]);

    // we want to ensure that every single filter evaluates to true, and that the items only evaluate to true filters.
    // this returns a true/false value used by the filter function
    return casesToCheck.every((item) => item);
  }

  function filterResidents(array, filters) {
    return array?.filter((resident) => checkCases(resident, filters)) || [];
  }

  function searchFilterSort(array, filters, search) {
    const finalArr = sortList(
      filterResidents(searchResidents(array, search), filters)
    );
    return finalArr;
  }

  // whenever the list updates, we use this function to check to see if
  // the active user exists in the newly searched/filtered list, and update
  // accordingly depending on what it finds.
  function grabNextResident(list) {
    let { selectedResident } = state;

    if (selectedResident) {
      if (!list.find((res) => selectedResident.guid === res.guid)) {
        if (list.length > 0) {
          selectedResident = list[0];
        } else {
          selectedResident = null;
        }
      }
    }

    if (!selectedResident && list.length > 0) {
      selectedResident = list[0];
    }

    return selectedResident;
  }

  // this use effect populates the filteredList, userData list, and selectedResident
  // on first load.
  useEffect(() => {
    getUsers().then(({ userData, selectedResident }) => {
      dispatch({
        type: "LOAD_RESIDENTS",
        payload: { filteredList: userData, selectedResident, userData },
      });
    });
  }, []);

  // updates the filtered list whenever we update filters or the searchTerm
  useEffect(() => {
    const { searchTerm, userData, filters } = state;
    const filteredList = searchFilterSort(userData, filters, searchTerm);
    const selectedResident = grabNextResident(filteredList);

    dispatch({
      type: "FILTER_LIST",
      payload: { filteredList, selectedResident },
    });
  }, [state.filters, state.searchTerm]);

  function refetchResidents() {
    return getUsers().then(({ userData, selectedResident }) => {
      dispatch({ type: "LOAD_RESIDENTS", payload: { userData } });

      if (!isEqual(userData, state.userData)) {
        // do a new dispatch that resorts/filters list
        const { searchTerm, filters } = state;
        const filteredList = searchFilterSort(userData, filters, searchTerm);
        let newSelectedResident = grabNextResident(filteredList);
        newSelectedResident =
          newSelectedResident.guid === selectedResident.guid
            ? selectedResident
            : newSelectedResident;

        dispatch({
          type: "FILTER_LIST",
          payload: { filteredList, selectedResident: newSelectedResident },
        });
        dispatch({ type: "LOAD_RESIDENTS", payload: { userData } });
      }
    });
  }

  // pull in new latest user informaiton and load into userData
  useInterval(() => {
    getUsers().then(({ userData }) => {
      dispatch({ type: "LOAD_RESIDENTS", payload: { userData } });

      if (!isEqual(userData, state.userData)) {
        // do a new dispatch that resorts/filters list
        const { searchTerm, filters } = state;
        const filteredList = searchFilterSort(userData, filters, searchTerm);
        const selectedResident = grabNextResident(filteredList);
        dispatch({
          type: "FILTER_LIST",
          payload: { filteredList, selectedResident },
        });
        dispatch({ type: "LOAD_RESIDENTS", payload: { userData } });
      }
    });
  }, 1000 * 3000);

  const contextValue = [state, dispatch, searchFilterSort, refetchResidents];
  // we return the Context, surfacing any functions and state consumers need to function
  // along with any props we passed to context
  return (
    <ResidentContext.Provider value={contextValue} {...props}>
      {props.children}
    </ResidentContext.Provider>
  );
}

export const useResidentContext = () => useContext(ResidentContext);
