/** @format */

import React, { useRef, useEffect } from 'react';
import { findIndex, toLower } from 'lodash';
import { DeleteOutline } from '@material-ui/icons';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PdfPlaceholder from '../utils/images/PdfPlaceholder.svg';
import DesignPlaceholder from '../utils/images/DesignPlaceholder.svg';
import PostDropzone from './PostDropzone';
import { isEmpty } from 'lodash';

const FileType = {
  PHOTO: 'photo',
  DESIGN: 'slide',
};

function PostUploadFileSlider(props) {
  const {
    assets,
    errorFiles,
    uploadFiles,
    onDropAreaChange,
    onAssetsChange,
    onDropAreaReject,
    setContentPickerOpen,
  } = props;
  const slider = useRef();
  const hasContent = !isEmpty(assets) || !isEmpty(uploadFiles);

  useEffect(() => {
    if (uploadFiles.length)
      slider.current.scrollLeft = slider.current.scrollWidth;
  }, [!!uploadFiles.length]);

  const onUploadItemHover = (item) => {
    assets.splice(findIndex(assets, item), 1, item);
    onAssetsChange('assets', assets);
  };

  const onFailedFileUpload = (files) => {
    onDropAreaReject(files);
  };

  const onRemoveItemClick = (item) => {
    assets.splice(findIndex(assets, item), 1);
    onAssetsChange('assets', assets);
  };

  const onDrop = (files) => {
    return onDropAreaChange(files);
  };

  return (
    <Box display="flex" ref={slider} overflow="auto">
      <Box display="flex" flex={1}>
        {assets.map((asset) => (
          <PostUploadItem
            key={asset.url}
            asset={asset}
            onUploadItemRemove={onRemoveItemClick}
            onUploadItemHover={onUploadItemHover}
          />
        ))}

        {uploadFiles.map((file) => (
          <PostUploadItemPlaceholder
            key={`${file.name}-${file.lastModified}`}
          />
        ))}
        <PostDropzone
          fullscreen
          onDrop={onDrop}
          thumbnail={hasContent}
          key={uploadFiles.length}
          error={!!errorFiles.length}
          onDropRejected={onFailedFileUpload}
          onChooseDesign={() => setContentPickerOpen(true)}
        />
      </Box>
    </Box>
  );
}

function PostUploadItemPlaceholder() {
  const carouselItemClass = carouselItemStyles({ isPdf: false });

  return (
    <Box
      mr={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      role="upload-item-placeholder"
      className={carouselItemClass.root}
    >
      <CircularProgress size={24} />
    </Box>
  );
}

const carouselItemStyles = makeStyles((theme) => ({
  root: {
    height: '160px !important',
    width: '160px !important',
    border: '1px solid #AFAFAF',
    backgroundColor: ({ hasContentPreview }) =>
      hasContentPreview ? 'rgba(0,0,0,0.03)' : '#fff',
    position: 'relative',
    boxSizing: 'border-box',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    background: ({ backgroundUrl }) => `url("${backgroundUrl}")`,
    backgroundSize: ({ hasContentPreview, isPlaceholder }) =>
      !hasContentPreview || isPlaceholder ? '50px' : 'cover',
    opacity: ({ hasContentPreview, isPlaceholder }) =>
      !hasContentPreview || isPlaceholder ? 0.3 : 1,
    backgroundPosition: ({ hasContentPreview, isPlaceholder }) =>
      !hasContentPreview || isPlaceholder ? 'center top 35%' : 'center',
    backgroundRepeat: 'no-repeat !important',
  },
  label: {
    display: '-webkit-box',
    position: 'absolute',
    top: theme.spacing(14),
    color: '#000',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflowWrap: 'break-word',
    width: '100%',
  },
  labelText: {
    textAlign: 'center',
    overflow: 'hidden',
    padding: `0 ${theme.spacing(1.5)}px`,
    fontSize: theme.spacing(1.5),
  },
  deleteButton: {
    color: '#fff',
    fontSize: '26px',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  overlay: {
    opacity: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'transparent',
    '&:hover': {
      opacity: 1,
      background: 'rgba(0, 0, 0, 0.6)',
    },
  },
}));

function PostUploadItem(props) {
  const { asset, onUploadItemHover, onUploadItemRemove } = props;
  const hasContentPreview = !!asset.preview && asset.type !== 'document';

  const isPdf =
    toLower(asset.type) !== FileType.PHOTO &&
    toLower(asset.type) !== FileType.DESIGN;
  const isPlaceholder = !asset.preview;
  const backgroundUrl = getPreview();
  const carouselItemClasses = carouselItemStyles({
    hasContentPreview,
    isPlaceholder,
    backgroundUrl,
  });

  function getPreview() {
    if (hasContentPreview) {
      return asset.preview;
    }
    if (isPdf) {
      return PdfPlaceholder;
    }
    return DesignPlaceholder;
  }

  function handleMouseEnter() {
    onUploadItemHover(asset);
  }

  function handleMouseLeave() {
    onUploadItemHover(asset);
  }

  function getLabel(asset) {
    return `${asset.name}.pdf`;
  }

  return (
    <Box
      className={carouselItemClasses.root}
      mr={2}
      display="flex"
      role="upload-item"
      flexDirection="column"
    >
      {(!hasContentPreview || isPlaceholder) && (
        <Box className={carouselItemClasses.label}>
          {
            <Typography className={carouselItemClasses.labelText}>
              {getLabel(asset)}
            </Typography>
          }
        </Box>
      )}
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={carouselItemClasses.thumbnail}
      >
        <Box className={carouselItemClasses.overlay}>
          <IconButton
            className={carouselItemClasses.deleteButton}
            onClick={() => onUploadItemRemove(asset)}
          >
            <DeleteOutline />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default PostUploadFileSlider;
