/** @format */

// marketplace link ``
import React from 'react';
import {
  Card,
  Button,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { OpenInNew as LinkIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useFlags } from '@teamhub/api';



const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#3D36AF',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: '14px',
    color: 'white',
  },
  noPaddingBottom: {
    paddingBottom: 0,
  },
}));

export default function IntegrationMarkplaceCard() {
  const classes = useStyles();
  const flags = useFlags();
  const INTEGRATIONS_LINK = flags['teamhub-support-center'] ? 'https://support.k4connect.com/docs/community-staff/integrations/' : 'https://integrations.k4connect.com?utm_campaign=K4Connect%20Integrations&utm_source=teamhub';
  return (
    <Card className={classes.root}>
      <CardContent className={classes.noPaddingBottom}>
        <Typography color="textPrimary" className={classes.text}>
          <span style={{ fontWeight: 'bold' }}>NEW!</span> Find your favorite
          apps and services to integrate with K4Community!
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          variant="text"
          target="_blank"
          className={classes.text}
          href={INTEGRATIONS_LINK}
          endIcon={<LinkIcon />}
        >
          Marketplace
        </Button>
      </CardActions>
    </Card>
  );
}
