/** @format */

import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { OpenInNew as LinkIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { navigate, useFlags } from '@teamhub/api';
import ChipHeader from './ChipHeader';
import Icon from './Icon';

const useStyles = makeStyles((theme) => ({
  widget: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '400px',
    },
  },
  linkContent: {
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      maxHeight: '400px',
    },
  },
  linkActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  linkIcon: {
    fontSize: '1.2rem',
    paddingLeft: '6px',
  },
}));

export function LearningCenterCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.widget}>
      <CardContent className={classes.linkContent}>
        <ChipHeader
          label="Learning"
          icon={<Icon className="far fa-graduation-cap"></Icon>}
        />
        <Typography style={{ paddingTop: '20px' }} variant="body2">
          The <b>Learning Center</b> provides unlimited access to a customized
          collection of courses available to your community team. Learning
          courses are designed to provide comprehensive training and are
          primarily used in the initial onboarding process. They can also be
          used to provide the necessary training to new staff upon turnover, as
          well as guide existing staff to learn new features as they become
          available.
        </Typography>
      </CardContent>
      <CardActions className={classes.linkActions}>
        <Button
          color="primary"
          href="https://launch.k4connect.com/learningcenter/"
          target="_blank"
          id="LP_learning_center_link"
        >
          Learning Center{' '}
          <LinkIcon className={classes.linkIcon} color="primary" />
        </Button>
      </CardActions>
    </Card>
  );
}

export function SupportCard(props) {
  const classes = useStyles();
  const flags = useFlags();
  return (
    <Card className={classes.widget}>
      <CardContent className={classes.linkContent}>
        <ChipHeader
          label="Help & Support"
          icon={<Icon className="far fa-question-circle"></Icon>}
        />
        <Typography variant="body2" style={{ paddingTop: '20px' }}>
          The <b>Support Center</b> is built for community team members and
          includes knowledge base articles, how-to guides, and more.
        </Typography>
        <br />
        <Typography variant="body2">
          The K4Connect Support Team provides support to community team members
          and residents on the full K4Community solution. Normal support hours
          are Monday-Friday from 8 a.m. to 7 p.m. ET.
        </Typography>

        <br />
        <Typography variant="body2">Call Support: +1 (855) 876-9673</Typography>
        <Typography variant="body2">
          Email Support:{' '}
          <a
            id="LP_mail_support_link"
            style={{ textDecoration: 'none' }}
            href="mailto:support@k4connect.com"
          >
            support@k4connect.com
          </a>
        </Typography>
      </CardContent>
      <CardActions className={classes.linkActions}>
        
        
        { flags['teamhub-support-center-legacy'] && <Button
          id="LP_support_center_link"
          color="primary"
          onClick={() => navigate('/support-center')}
        >
          Support Center{' '}
          <LinkIcon className={classes.linkIcon} color="primary" />
        </Button> }


        { flags['teamhub-support-center'] &&
        <Button
          id="LP_support_center_link"
          color="primary"
          target="_blank"
          href="https://support.k4connect.com/home"
        >
          Support Center{' '}
          <LinkIcon className={classes.linkIcon} color="primary" />
        </Button> }

      </CardActions>
    </Card>
  );
}
