/** @format */

import React, { useState } from "react";

import { idGenerator } from "../utils";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import RCISettingsForm from "../components/RCISettingsForm";
import RCIDivider from "../components/base/RCIDivider";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
  },
  accordion: {
    [theme.breakpoints.down("sm")]: {
      borderRadius: "0 !important",
    },
    marginTop: "16px",
    "&::before": {
      height: 0,
    },
  },
  description: {
    color: "rgba(0, 0, 0, 0.6)",
  },
  accordionDetails: {
    paddingTop: 0,
  },
  title: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
}));

export default function RCISettings({ enabled }) {
  const idGen = idGenerator.createWithAppendedPrefix("RCISettingsView");
  const classes = useStyles();

  const [settings, setSettings] = useState({
    expanded: false,
    summary: "Resident Check-in",
    accordionId: "accordion--rci",
  });

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
        onClick={() => toggleExpanded()}
      >
        {text}
      </Button>
    );
  }

  function toggleExpanded() {
    setSettings((settings) => ({ ...settings, expanded: !settings.expanded }));
  }

  const renderForm = () => (
    <RCISettingsForm
      expanded={settings.expanded}
      onClose={() => toggleExpanded()}
    />
  );

  const disabledMessage = () => (
    <Grid container spacing={2}>
      <RCIDivider />
      <Grid item xs={12}>
        <Typography className={classes.description}>
          Resident Check-in has not been set up for your community yet. Please
          contact{" "}
          <Link href="mailto:support@k4connect.com">support@k4connect.com</Link>
          .
        </Typography>
        <br />
      </Grid>
    </Grid>
  );

  return (
    <Accordion
      id={`accordion-${settings.accordionId}`}
      className={classes.accordion}
      key={settings.accordionId}
      expanded={settings.expanded}
    >
      <AccordionSummary>
        <Grid container>
          <Grid container item xs={12}>
            <Typography className={classes.title} variant="subtitle1">
              Resident Check-in
            </Typography>
            {getExpandedIcon(settings.accordionId, settings.expanded)}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {enabled ? renderForm() : disabledMessage()}
      </AccordionDetails>
    </Accordion>
  );
}
