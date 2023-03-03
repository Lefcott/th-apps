/** @format */

import React from 'react';
import { Grid, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import folderIcon from '../../assets/images/folderIcon.svg';

const dropzoneInfoMessages = {
  banner: {
    dragAndDrop: 'Drag & drop or',
    browseFiles: 'browse files',
    fileTypeRequirements: 'Only jpg, pdf, png formats can be uploaded.',
    fileAvailability: 'Uploaded files will be available in the Content Library',
    chooseDesign: 'choose design from library',
  },
  thumbnail: {
    dragAndDrop: 'Drag & drop,',
    browseFiles: 'browse files',
    fileTypeRequirements: 'jpg, pdf, png',
    fileAvailability: null,
    chooseDesign: 'or choose design',
  },
};

const baseDropzoneInfoStyles = {
  infoNormal: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStretch: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
    letterSpacing: '0.26px',
  },
  infoHighlight: {
    color: '#4c43db !important',
  },
  infoSmall: {
    lineHeight: '6px',
    letterSpacing: '0.3px',
    color: 'rgba(0, 0, 0, 0.37)',
  },
  infoSmallError: {
    color: 'rgba(206, 75, 53, 0.87) !important',
  },
  libraryButton: {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: '500',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '2',
    letterSpacing: '0.4px',
    color: '#4c43db',
    textTransform: 'lowercase',
    zIndex: 9999,
  },
};
const useDropzoneInfoBannerStyles = makeStyles((theme) => ({
  ...baseDropzoneInfoStyles,
  infoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '70px',
    },
  },
  infoNormalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoNormal: {
    ...baseDropzoneInfoStyles.infoNormal,
    color: 'rgba(0, 0, 0, 0.6)',
    margin: ' 10px 3px',
    fontSize: '20px',
    lineHeight: '24px',
  },

  infoSmall: {
    ...baseDropzoneInfoStyles.infoSmall,
    fontSize: '9px',
  },
  libraryButton: {
    ...baseDropzoneInfoStyles.libraryButton,
    marginTop: '16px',
  },
}));

const useDropzoneInfoThumbnailStyles = makeStyles({
  ...baseDropzoneInfoStyles,
  infoNormal: {
    ...baseDropzoneInfoStyles.infoNormal,
    color: 'rgba(0, 0, 0, 0.87)',
    margin: '21px',
    fontSize: '16px',
    lineHeight: '1.2px',
  },

  infoSmall: {
    ...baseDropzoneInfoStyles.infoSmall,
    fontSize: '12px',
  },
  libraryButton: {
    ...baseDropzoneInfoStyles.libraryButton,
    marginTop: '2px',
  },
});

export default function PostDropzoneInfo({ error, onChooseDesign, thumbnail }) {
  const dropzoneInfoClasses = thumbnail
    ? useDropzoneInfoThumbnailStyles()
    : useDropzoneInfoBannerStyles();
  const message = thumbnail
    ? dropzoneInfoMessages.thumbnail
    : dropzoneInfoMessages.banner;

  function getSizes(xs, md, lg) {
    return thumbnail ? { xs: 12, md: 12, lg: 12 } : { xs, md, lg };
  }

  return (
    <Grid container>
      {!thumbnail && (
        <Grid
          item
          className={dropzoneInfoClasses.infoIcon}
          {...getSizes(12, 4, 3)}
        >
          <img src={folderIcon} alt="folderIcon" />
        </Grid>
      )}

      <Grid item {...getSizes(12, 8, 9)}>
        <Box className={dropzoneInfoClasses.infoNormalContainer}>
          <Box mb={2} component="h6" className={dropzoneInfoClasses.infoNormal}>
            {message.dragAndDrop}
          </Box>
          <Box
            component="h6"
            className={`${dropzoneInfoClasses.infoNormal} ${dropzoneInfoClasses.infoHighlight}`}
          >
            {message.browseFiles}
          </Box>
        </Box>
        <Box textAlign="center">
          <Box
            mb={1}
            role="dropzone-info-file-requirements"
            className={`${dropzoneInfoClasses.infoSmall} ${error &&
              dropzoneInfoClasses.infoSmallError}`}
          >
            {message.fileTypeRequirements}
          </Box>
          {!thumbnail && (
            <Box className={`${dropzoneInfoClasses.infoSmall}`}>
              {message.fileAvailability}
            </Box>
          )}
          <Box textAlign="center">
            <Box className={`${dropzoneInfoClasses.infoSmall}`}>
              <Button
                className={`${dropzoneInfoClasses.libraryButton}`}
                onClick={onChooseDesign}
              >
                {message.chooseDesign}
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
