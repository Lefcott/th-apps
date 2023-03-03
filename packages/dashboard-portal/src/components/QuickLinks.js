/** @format */

import React from 'react';
import { Card, CardContent, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChipHeader from './ChipHeader';
import { navigate, useFlags } from '@teamhub/api';
import { kebabCase } from 'lodash';
import { useNavItems } from '@teamhub/navbar';
import Icon from './Icon';

const useStyles = makeStyles((theme) => ({
  qlHeader: { padding: '16px 16px' },
  itemText: {
    padding: '16px 16px',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      padding: '16px 16px',
    },
  },
}));

export default function QuickLinks(props) {
  const { mailIsHere } = useFlags();
  const { user } = props;

  /*
  the ordering of static quick links
  * Content Library
  * Post Manager (App Publisher)
  * Digital Signage Manager
  * Event Manager
  * Resident Directory
  * 
  * 6th optional item if no mail is here:
  * resident check-in
  */
  const quickLinks = [
    '/library',
    '/publisher',
    '/events',
    '/check-in',
    // '/directory',
    // '/signage',
  ];
  const { navItems } = useNavItems({ grouped: false });
  const links = navItems.filter((navItem) => quickLinks.includes(navItem.to));
  const classes = useStyles();
  const linksToDisplay = mailIsHere ? links.slice(0, 4) : links;
  return (
    <Card className={classes.qlCard}>
      <CardContent style={{ padding: 0 }}>
        <div className={classes.qlHeader}>
          <ChipHeader
            label="Quick Links"
            icon={<Icon className="far fa-link"></Icon>}
          />
        </div>
        {linksToDisplay.map((link) => (
          <div key={link.to}>
            <Divider />
            <div
              className={classes.itemText}
              role="link"
              id={`LP_quicklink_${kebabCase(link.display)}`}
              tabIndex={0}
              onClick={() =>
                navigate(`${link.to}?communityId=${user.community._id}`)
              }
            >
              <Typography variant="body2">{link.grouping}</Typography>
              <Typography
                variant="h6"
                style={{ paddingTop: '8px' }}
                color="primary"
              >
                {link.display}
              </Typography>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
