/** @format */

import React, { useEffect, useState } from "react";
/* Not sure if wanna use papi for this or not */
import { GET_DEVICE_ALERTS } from "../graphql/alerts";

import { useQuery } from "@teamhub/apollo-config";
import { Box, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { getCommunityId } from "@teamhub/api";
import { useCurrentCommunitySettings } from "@teamhub/community-config";
import AlertsTable from "../components/AlertsTable";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "fill-available",
    },
  },
}));

export default function DeviceAlertsView() {
  const classes = useStyles();
  const communityId = getCommunityId();
  const isMobile = useMediaQuery("(max-width:960px)");
  const [search, setSearch] = useState("");
  const [
    settings,
    { loading: settingsLoading, error: settingsError },
  ] = useCurrentCommunitySettings();
  const [alertsConfigured, setAlertsConfigured] = useState([]);

  const [selectedAlertTypes, setSelectedAlertTypes] = useState([]);
  useEffect(() => {
    if (
      !settingsError &&
      !settingsLoading &&
      settings &&
      settings.deviceAlerts
    ) {
      let configuredAlerts = [];
      if (settings.deviceAlerts.highTempAlertEnabled) {
        configuredAlerts.push("HighTemp");
      }
      if (settings.deviceAlerts.lowTempAlertEnabled) {
        configuredAlerts.push("LowTemp");
      }

      if (settings.deviceAlerts.leakAlertEnabled) {
        configuredAlerts.push("Leak");
      }
      if (settings.deviceAlerts.ovenAlertEnabled) {
        configuredAlerts.push("OvenOn");
      }

      setAlertsConfigured(configuredAlerts);
      setSelectedAlertTypes(configuredAlerts);
    }
  }, [settings, settingsLoading, settingsError]);

  function onSearch(val) {
    if (val === " ") return;
    setSearch(val);
  }

  function onFilterChange(val) {
    if (selectedAlertTypes.includes(val)) {
      const filtered = selectedAlertTypes.filter((type) => type !== val);
      if (filtered.length) {
        setSelectedAlertTypes(filtered);
      }
    } else {
      setSelectedAlertTypes((types) => [...types, val]);
    }
  }

  const { data, fetchMore, loading, error } = useQuery(GET_DEVICE_ALERTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !selectedAlertTypes.length,
    variables: {
      communityId,
      page: {
        limit: 50,
        cursor: null,
      },
      filters: {
        search,
        alertTypes: selectedAlertTypes,
      },
    },
  });

  return (
    <Box className={classes.root} display="flex" pt={isMobile ? 3 : 0}>
      <AlertsTable
        data={data}
        loading={loading || settingsLoading}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
        selectedAlertTypes={selectedAlertTypes}
        alertsConfigured={alertsConfigured}
        error={error}
        fetchMore={fetchMore}
      />
    </Box>
  );
}
