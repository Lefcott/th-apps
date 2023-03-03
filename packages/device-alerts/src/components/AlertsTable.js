/** @format */
import React from "react";
import { get } from "lodash";
import BaseTable from "./base/BaseTable";
import { AlertCell, AddressCell, TimeCell } from "./base/BaseTable/cell-types";
import BaseButton from "./BaseButton";
import AlertTypeFilterChip from "./AlertTypeFilterChip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTint,
  faFire,
  faTemperatureFrigid,
  faTemperatureHot,
} from "@fortawesome/pro-regular-svg-icons";
import { navigateToSettings } from "../utils";

export const AlertTypes = {
  LOW_TEMP: "LowTemp",
  HIGH_TEMP: "HighTemp",
  OVEN_ON: "OvenOn",
  Leak: "Leak",
};

function getTableDefinitions() {
  return [
    {
      Header: "Address",
      id: "address",
      Cell: AddressCell,
      width: 40,
      accessor({ address }) {
        return {
          filterable: ["address"],
          data: {
            address,
          },
        };
      },
    },
    {
      Header: "Time",
      Cell: TimeCell,
      accessor: "timestamp",
      width: 60,
    },
    {
      Header: "Alert",
      Cell: AlertCell,
      width: 75,
      accessor({ type, room }) {
        return {
          filterable: ["type"],
          data: { type, room },
        };
      },
    },
  ];
}

export default function AlertsTable({
  data,
  loading,
  error,
  fetchMore,
  selectedAlertTypes,
  alertsConfigured,
  onFilterChange,
  onSearch,
}) {
  const isActive = (string) => alertsConfigured.includes(string);
  let alerts = get(data, "community.deviceAlerts.alerts", []);
  let pageInfo = get(data, "community.deviceAlerts.pageInfo", {});

  const columns = getTableDefinitions();
  const toolbarOptions = {
    fabbable: true,
    actions: [
      {
        key: "new",
        renderPortal: true,
        render() {
          return (
            <BaseButton
              variant="text"
              onClick={navigateToSettings}
              id="DA_navigate-to-settings"
            >
              Alert Settings
            </BaseButton>
          );
        },
      },
      {
        key: "toggle-alert-LowTemp",
        render() {
          return (
            isActive(AlertTypes.LOW_TEMP) && (
              <AlertTypeFilterChip
                label="Low Temp"
                id="low-temp"
                onClick={() => onFilterChange(AlertTypes.LOW_TEMP)}
                active={selectedAlertTypes.includes(AlertTypes.LOW_TEMP)}
                icon={<FontAwesomeIcon size="lg" icon={faTemperatureFrigid} />}
              />
            )
          );
        },
      },
      {
        key: "toggle-alert-HighTemp",
        render() {
          return (
            isActive(AlertTypes.HIGH_TEMP) && (
              <AlertTypeFilterChip
                label="High Temp"
                id="high-temp"
                onClick={() => onFilterChange(AlertTypes.HIGH_TEMP)}
                active={selectedAlertTypes.includes(AlertTypes.HIGH_TEMP)}
                icon={<FontAwesomeIcon size="lg" icon={faTemperatureHot} />}
              />
            )
          );
        },
      },
      {
        key: "toggle-alert-Leak",
        render() {
          return (
            isActive(AlertTypes.Leak) && (
              <AlertTypeFilterChip
                color="primary"
                label="Leak"
                id="leak"
                onClick={() => onFilterChange(AlertTypes.Leak)}
                active={selectedAlertTypes.includes(AlertTypes.Leak)}
                icon={<FontAwesomeIcon size="lg" icon={faTint} />}
              />
            )
          );
        },
      },
      {
        key: "toggle-alert-oven-stove",
        render() {
          return (
            isActive(AlertTypes.OVEN_ON) && (
              <AlertTypeFilterChip
                label="Oven/Stove"
                id="stove-oven"
                onClick={() => onFilterChange(AlertTypes.OVEN_ON)}
                active={selectedAlertTypes.includes(AlertTypes.OVEN_ON)}
                icon={<FontAwesomeIcon size="lg" icon={faFire} />}
              />
            )
          );
        },
      },
    ],
  };

  const searchOptions = {
    onSearch,
    placeholder: "Search by address or time",
    emptyResultMessage: (value) =>
      `We couldn’t find anything matching "${value}"`,
  };

  const rowOptions = {
    hasNextPage: pageInfo.hasNextPage,
    async fetchMore() {
      fetchMore({
        variables: {
          page: {
            limit: 50,
            cursor: pageInfo.cursor,
          },
        },
        updateQuery(prev, { fetchMoreResult }) {
          if (!fetchMoreResult) return prev;
          const alerts = get(
            fetchMoreResult,
            "community.deviceAlerts.alerts",
            []
          );
          const pageInfo = get(
            fetchMoreResult,
            "community.deviceAlerts.pageInfo",
            {}
          );

          return Object.assign({}, prev, {
            community: {
              __typename: "Community",
              deviceAlerts: {
                pageInfo,
                alerts: [
                  ...(prev.community.deviceAlerts?.alerts || []),
                  ...alerts,
                ],
              },
            },
          });
        },
      });
    },
  };

  return (
    <BaseTable
      searchable
      id="SD"
      data={alerts}
      columns={columns}
      rowOptions={rowOptions}
      searchOptions={searchOptions}
      toolbarOptions={toolbarOptions}
      error={error}
      loading={loading}
      alertsConfigured={alertsConfigured}
    />
  );
}
