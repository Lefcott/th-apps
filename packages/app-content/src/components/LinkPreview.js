/** @format */

import React from 'react';
import { Paper, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { get, isEmpty, isNil } from 'lodash';
import noPreview from '../assets/images/noPreview.svg';
import noLinkPreview from '../assets/images/nolinkpreview.svg';
import noVideoPreview from '../assets/images/novideopreview.svg';
import styled from '@emotion/styled';

const PreviewDescription = styled.div`
  padding: ${(props) => (props.hasContent ? '10px 16px 10px 16px' : 0)};
  color: white;
  max-height: 50px;
  min-height: ${(props) =>
    props.isLoading || (!props.hasImage && !props.hasContent) ? '50px' : '0px'};
  background-color: ${(props) => (props.hasContent ? '#0e4b71' : '#efefef')};
  width: ${(props) => (props.hasContent ? 'calc(100% - 32px)' : '100%')};
`;

const PreviewImage = styled.img`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
`;

const usePreviewContainerStyles = makeStyles({
  root: (props) => {
    return {
      display: 'flex',
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: props.containsPreviewImage
        ? '#000'
        : 'rgba(0, 0, 0, 0.03)',
      position: 'relative',
      width: '100%',
      height: '299px',
    };
  },
});

const useStyles = makeStyles(() => ({
  titleText: {
    fontSize: '19px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  marginBot: {
    marginBottom: '30px',
  },
}));

function LinkPreview(props) {
  const { url, loading, previewData, error } = props;
  const [parsedData, setParsedData] = React.useState(null);

  function parseData(previewData = null) {
    if (!previewData) {
      return null;
    } else {
      const dataToDisplay = {
        type: get(previewData, 'type', null),
        provider: get(
          previewData,
          'provider_name',
          get(previewData, 'site', null),
        ),
        title: get(previewData, 'title', get(previewData, '', null)),
      };
      const type = get(previewData, 'type');
      if (type === 'photo') {
        dataToDisplay.previewImage = get(
          previewData,
          'url',
          get(
            previewData,
            'image.url',
            get(previewData, 'images[0].url', null),
          ),
        );
      } else {
        dataToDisplay.previewImage = get(
          previewData,
          'thumbnail_url',
          get(
            previewData,
            'image.url',
            get(previewData, 'images[0].url', null),
            null,
          ),
        );
      }

      return !isEmpty(dataToDisplay) ? dataToDisplay : null;
    }
  }

  React.useEffect(() => {
    if (!previewData) {
      setParsedData(null);
    } else {
      setParsedData(parseData(previewData));
    }
    return () => setParsedData(null);
  }, [previewData]);

  const classes = useStyles();
  const previewContainerClasses = usePreviewContainerStyles({
    containsPreviewImage:
      Boolean(get(parsedData, 'previewImage', false)) && !loading,
  });

  return url && !error ? (
    <>
      <Paper
        role="link-preview"
        elevation={0}
        classes={previewContainerClasses}
      >
        {isNil(parsedData) || loading ? (
          <>
            {isNil(parsedData) && !loading && (
              <>
                <img src={noPreview} className={classes.marginBot} />
                <Typography variant="caption">No Preview Available</Typography>
              </>
            )}
            {loading && (
              <>
                <CircularProgress
                  color="primary"
                  className={classes.marginBot}
                  size={50}
                />
                <Typography color="primary" variant="caption">
                  Loading Preview
                </Typography>
              </>
            )}
          </>
        ) : parsedData.previewImage ? (
          <PreviewImage
            role="link-preview-image"
            src={parsedData.previewImage}
          />
        ) : (
          <img
            src={parsedData.type === 'video' ? noVideoPreview : noLinkPreview}
          />
        )}
      </Paper>

      <PreviewDescription
        hasImage={get(parsedData, 'previewImage', null)}
        hasContent={
          get(parsedData, 'provider', null) || get(parsedData, 'title', null)
        }
        isLoading={loading}
      >
        {!isNil(parsedData) && (
          <>
            {parsedData.provider && (
              <Typography
                role="link-preview-provider"
                variant="caption"
                style={{ color: '#fff', opacity: 0.5 }}
              >
                {parsedData.provider}
              </Typography>
            )}
            {parsedData.title && (
              <Typography
                variant="subtitle1"
                role="link-preview-title"
                className={classes.titleText}
              >
                {parsedData.title}
              </Typography>
            )}
          </>
        )}
      </PreviewDescription>
    </>
  ) : null;
}

export default LinkPreview;
