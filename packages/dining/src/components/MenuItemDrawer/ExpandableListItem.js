/** @format */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/pro-light-svg-icons';
import { ExpandMoreRounded, MoreVertRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Popover,
} from '@material-ui/core';
import { sendPendoEvent } from '@teamhub/api';

import { IntegrationsContext } from '../../contexts/IntegrationsProvider';
import { isEmpty } from 'lodash';
import Strings from '../../constants/strings';

export default function ExpandableListItem({ item, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleClickEdit = React.useCallback(() => {
    onEdit?.(item);
  }, [onEdit, item]);

  const handleClickDelete = React.useCallback(() => {
    sendPendoEvent(Strings.Dining.pendoEvent.menu.menuCellItemRemoved);
    setAnchorEl(null);
    onDelete?.(item);
  }, [onDelete, item]);

  const handleClickMore = React.useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const openMenu = Boolean(anchorEl);

  const { enabledDiningIntegrations } = React.useContext(IntegrationsContext);

  return (
    <Accordion
      classes={{
        expanded: classes.accordionExpanded,
        root: classes.accordionRoot,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        classes={{
          root:
            item.content || (item.tags && item.tags.length)
              ? classes.accordionSummaryRoot
              : classes.accordionSummaryRootNoContent,
          content: classes.accordionSummaryContent,
          expandIcon:
            item.content || (item.tags && item.tags.length)
              ? classes.accordionExpandIcon
              : classes.accordionExpandIconNoContent,
          expanded: classes.accordionSummaryExpanded,
        }}
      >
        <Box display="flex" width={1} alignItems="center">
          <Box flexGrow={1} color="rgba(0, 0, 0, 0.87)">
            <Typography
              variant="subtitle1"
              noWrap
              style={{ maxWidth: '175px' }}
            >
              {item.title}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            mr={3}
            ml={0.5}
            px={1}
            py={0.1}
            bgcolor="#EBEBEB"
            borderRadius="20px"
            color="rgba(0, 0, 0, 0.87)"
          >
            <Typography
              variant="caption"
              style={{ fontSize: '10px', textTransform: 'capitalize' }}
            >
              {item.badgeText}
            </Typography>
          </Box>
          <Box
            component="span"
            position="absolute"
            right="8px"
            top="10px"
            ml={0.5}
          >
            {isEmpty(enabledDiningIntegrations) && (
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClickMore}
                classes={{ root: classes.moreIconRoot }}
              >
                <MoreVertRounded />
              </IconButton>
            )}
            <Popover
              id="DN_create-item-more-menu"
              open={openMenu}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <Box display="flex" flexDirection="column" py={0.5}>
                <Box
                  display="grid"
                  gridTemplateColumns="18px auto"
                  gridGap="12px"
                  alignItems="center"
                  px={2}
                  py={1}
                  className={classes.menuItem}
                  onClick={handleClickEdit}
                >
                  <Box>
                    <FontAwesomeIcon icon={faEdit} fontWeight="bold" />
                  </Box>
                  <Typography variant="caption">Edit Item</Typography>
                </Box>

                <Box
                  display="grid"
                  gridTemplateColumns="18px auto"
                  gridGap="12px"
                  alignItems="center"
                  px={2}
                  py={1}
                  color="#C62828"
                  className={classes.menuItem}
                  onClick={handleClickDelete}
                >
                  <Box>
                    <FontAwesomeIcon icon={faTrash} fontWeight="bold" />
                  </Box>
                  <Typography variant="caption">Remove from Menu</Typography>
                </Box>
              </Box>
            </Popover>
          </Box>
        </Box>
      </AccordionSummary>

      {item.content || (item.tags && item.tags.length) ? (
        <AccordionDetails>
          <Box display="flex" flexDirection="column" pl="64px">
            <Box mb={1.5}>
              <Typography variant="caption"> {item.content} </Typography>
            </Box>
            <Box>
              <Typography variant="caption">{item.tags.join(', ')}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      ) : null}
    </Accordion>
  );
}

const useStyles = makeStyles(() => ({
  accordionRoot: {
    boxShadow: 'none',
    borderRadius: '0px !important',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: '#EDECFB',
    },
    '&:hover $moreIconRoot': {
      display: 'initial',
    },
    '&:before': {
      display: 'none',
    },
  },
  accordionExpanded: {
    marginTop: '0px !important',
    marginBottom: '0px !important',
    backgroundColor: 'white !important',
    '& $moreIconRoot': {
      display: 'initial',
    },
  },
  accordionSummaryRoot: {
    paddingLeft: '10px',
    minHeight: 'auto !important',
  },
  accordionSummaryRootNoContent: {
    paddingLeft: '10px',
    minHeight: 'auto !important',
    cursor: 'default !important',
    '&:hover': {
      backgroundColor: '#EDECFB',
    },
  },
  accordionSummaryContent: {
    order: 2,
    margin: '0px !important',
  },
  accordionSummaryExpanded: {},
  accordionExpandIcon: {
    order: 1,
    marginRight: '18px',
  },
  accordionExpandIconNoContent: {
    order: 1,
    marginRight: '18px',
    visibility: 'hidden',
  },
  moreIconRoot: {
    display: 'none',
    padding: '2px',
  },
  menuItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F2F2F2',
    },
  },
}));
