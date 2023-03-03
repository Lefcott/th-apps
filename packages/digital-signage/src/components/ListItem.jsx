/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { isNull } from 'lodash';
import pdfPlaceholder from '../assets/images/pdfPlaceholder.svg';
import moment from 'moment-timezone';
import Destinations from './Destinations';
import IconMenu from './IconMenu';
import { MoreVert, Announcement } from '@material-ui/icons';
import {
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Tooltip,
  Hidden,
  useMediaQuery,
} from '@material-ui/core';

function SlideshowItem({
  data,
  onClick,
  listItemActions,
  activeGuid,
  ...props
}) {
  const document = data.Document;
  const isMobile = useMediaQuery('(max-width:960px)');
  const isActive = document.guid === activeGuid;
  const editedDate = moment(document.updatedAt).format('MMM DD');
  const thumbnailSrc = isNull(document.editorType)
    ? pdfPlaceholder
    : document.thumbnail;
  const setItemStyle = () => {
    let style = {
      borderRadius: 5,
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px',
      backgroundColor: '#ffffff',
    };
    if (isActive && !isMobile) {
      style.borderLeft = 'solid #4c43db';
      style.borderWidth = '0 0 0 7px';
      style.paddingLeft = 9;
    }
    return style;
  };

  const showUpdate = () => {
    const updatedDate = document.updatedAt;
    const publishedDate = data.published;
    return publishedDate > updatedDate
      ? { display: 'none' }
      : { marginTop: -10 };
  };

  return (
    <ListItem
      divider
      button
      onClick={() => onClick(data)}
      style={setItemStyle()}
    >
      <ListItemAvatar>
        <Avatar
          src={thumbnailSrc}
          alt="slideshowPreview"
          style={{ width: 60, height: 60, paddingRight: 15 }}
        />
      </ListItemAvatar>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <ListItemText primary={<strong>{document.name}</strong>} />
        </Grid>
        <Grid item xs={12} style={{ display: 'flex' }}>
          <Hidden xsDown>
            <Destinations data={data.Destinations} />
          </Hidden>
          <span>Edited: {editedDate}</span>
          <Tooltip
            title="Slideshow has been edited — republish to display latest changes"
            placement="right"
          >
            <Announcement
              style={showUpdate()}
              color="secondary"
              fontSize="small"
            />
          </Tooltip>
        </Grid>
      </Grid>

      <Hidden smDown>
        <IconMenu
          icon={<MoreVert />}
          items={listItemActions}
          dialog={{ enabled: false }}
          data={data}
        />
      </Hidden>
    </ListItem>
  );
}

export default SlideshowItem;
