/** @format */

import React, { useState } from "react";
import { useMutation } from "@teamhub/apollo-config";
import { UPSERT_SETTINGS } from "../graphql/settings";
import { idGenerator } from "../utils";

import {
  useCurrentCommunitySettings,
  refetchCommunitySettings,
} from "@teamhub/community-config";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { getCommunityId } from "@teamhub/api";
import { showToast } from "@teamhub/toast";

import AlertSettings, {
  createAlertSettingsValidationSchema,
  createAlertSettingsInitialValues,
  validateAlertSettings,
} from "../components/AlertSettings";
import TaskBar from "../components/TaskBar";
import { Formik, Form } from "formik";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
  },
  accordion: {
    [theme.breakpoints.down("sm")]: {
      borderRadius: "0 !important",
    },
  },
  summary: {
    flexDirection: "column",
    padding: 0,
    "& > div": {
      width: "100%",
    },
  },
  title: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
}));

export default function BuildingAlerts({ singleSpa }) {
  const idGen = idGenerator.createWithAppendedPrefix("SettingView");
  const classes = useStyles();
  const [
    communitySettings,
    { refetch: refetchCommunitySettings },
  ] = useCurrentCommunitySettings();

  const [saveCommunitySettings, { loading }] = useMutation(UPSERT_SETTINGS, {
    onCompleted() {
      refetchCommunitySettings();
      showToast("Settings have been saved.");
    },
  });

  const [settings, setSettings] = useState({
    alerts: {
      expanded: false,
      summary: "Building Alerts",
      DetailsComponent: AlertSettings,
    },
  });

  function navigateToBuildingAlerts() {
    singleSpa.navigateToUrl("/building-alerts");
  }

  function getExpandedIcon(id, expanded) {
    const text = expanded ? "collapse" : "expand";
    return (
      <Button
        size="small"
        align="right"
        color="primary"
        variant="outlined"
        aria-label={id}
        id={idGen.getId(`expand-icon-${id}`)}
        onClick={() => toggleExpanded(id)}
      >
        {text}
      </Button>
    );
  }

  function toggleExpanded(id) {
    const currentSettings = settings[id];
    if (currentSettings) {
      currentSettings.expanded = !currentSettings.expanded;
      setSettings((settings) => ({ ...settings, [id]: currentSettings }));
    }
  }
  const validationSchema = yup.object().shape({
    deviceAlerts: createAlertSettingsValidationSchema(),
  });

  const initialValues = {
    deviceAlerts: createAlertSettingsInitialValues(
      communitySettings.deviceAlerts
    ),
  };

  async function onSubmit(settings) {
    validateAlertSettings(settings);
    await saveCommunitySettings({
      variables: {
        communityId: getCommunityId(),
        settings,
      },
    });
  }

  function onCancel() {
    navigateToBuildingAlerts();
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <>
          <Form onSubmit={formik.handleSubmit} className={classes.form}>
            {Object.entries(settings).map(
              ([id, { expanded, summary, DetailsComponent }]) => (
                <Accordion
                  id={idGen.getId(`accordion-${id}`)}
                  className={classes.accordion}
                  key={id}
                  expanded={expanded}
                >
                  <AccordionSummary className={classes.summary}>
                    <Box display="flex" flex={1}>
                      <Typography className={classes.title} variant="subtitle1">
                        {summary}
                      </Typography>
                      {getExpandedIcon(id, expanded)}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DetailsComponent
                      formik={formik}
                      expanded={expanded}
                      onClose={() => toggleExpanded(id)}
                    />
                  </AccordionDetails>
                  <Box my={2} mt={2}>
                    <Divider />
                  </Box>
                  <TaskBar
                    loading={loading}
                    saveDisabled={!formik.isValid}
                    onSubmit={formik.handleSubmit}
                    onCancel={() => onCancel(formik)}
                  />
                </Accordion>
              )
            )}
          </Form>
        </>
      )}
    </Formik>
  );
}
