/** @format */

import { Box, Typography } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import React from 'react';

const EmptyStateMessage = withStyles(() => ({
  root: {
    textAlign: 'center',
    width: '100%',
  },
}))(Typography);

const SupportLink = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    marginLeft: '0.2rem',
    textDecoration: 'none',
  },
}))(Typography);

const ExternalLinkIcon = withStyles(() => ({
  root: {
    marginLeft: '0.2rem',
    fontSize: '0.8rem',
    marginBottom: '-0.1rem',
  },
}))(OpenInNew);

export default function RestaurantsDrawerEmptyState() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      mt={5}
      mx={5}
      justifyContent="center"
    >
      <EmptyStateMessage variant="caption">
        Get started by adding your first restaurant to your community using the
        “Add Restaurant” button above.
      </EmptyStateMessage>

      <Box display="flex" mt={7}>
        <EmptyStateMessage variant="caption">
          Questions? View
          <SupportLink
            component="a"
            color="primary"
            variant="caption"
            target="_blank"
            rel="noreferrer"
            href="https://support.k4connect.com/knowledgebase/all-about-menu-management/"
          >
            <a>Dining Support Page</a>
            <ExternalLinkIcon fontSize="small" />
          </SupportLink>
        </EmptyStateMessage>
      </Box>
    </Box>
  );
}
