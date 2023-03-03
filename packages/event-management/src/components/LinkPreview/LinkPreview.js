/** @format */

import React from 'react';
import { Grid, Paper, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import noPreview from '../../assets/images/noPreview.svg';
import noLinkPreview from '../../assets/images/nolinkpreview.svg';
import noVideoPreview from '../../assets/images/novideopreview.svg';
import styled from '@emotion/styled';
import strings from '../../constants/strings';

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
      marginTop: '8px',
      border: props.hasError && '1px solid #C62828',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: '#E5E5E5',
      position: 'relative',
      width: '100%',
      height: '400px',
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
  const { url, previewImage, type, provider, title, loading, errorMessage } =
    props;
  const classes = useStyles();
  const previewContainerClasses = usePreviewContainerStyles({
    isLoading: loading,
    containsPreviewImage: previewImage && !loading,
    hasError: errorMessage,
  });
  if (!url) {
    return null;
  }

  if (errorMessage) {
    return (
      <Paper
        role="link-preview"
        elevation={0}
        classes={previewContainerClasses}
      >
        <Grid
          container
          alignItems="center"
          justify="flex-end"
          direction="column"
          style={{ height: '100%', whiteSpace: 'pre-line' }}
        >
          <Grid item>
            <img src={noPreview} alt={errorMessage} />
          </Grid>
          <Grid item style={{ marginTop: '15px', color: '#C62828' }}>
            <Typography
              align="center"
              display="block"
              variant="caption"
              style={{ fontSize: '0.85rem' }}
            >
              {errorMessage}
            </Typography>
          </Grid>
          <Grid
            item
            style={{
              backgroundColor: '#EFEFEF',
              width: '100%',
              height: '77px',
              borderTop: '1px solid #C62828',
              marginTop: '50px',
            }}
          ></Grid>
        </Grid>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper
        role="link-preview"
        elevation={0}
        classes={previewContainerClasses}
      >
        <CircularProgress
          color="primary"
          className={classes.marginBot}
          size={50}
        />
        <Typography color="primary" variant="caption">
          {strings.preview.loadingPreview}
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        role="link-preview"
        elevation={0}
        classes={previewContainerClasses}
      >
        {url && previewImage ? (
          <PreviewImage role="link-preview-image" src={previewImage} />
        ) : (
          <img
            src={type === 'video' ? noVideoPreview : noLinkPreview}
            alt={strings.preview.previewNotExist}
          />
        )}
      </Paper>

      <PreviewDescription
        hasImage={previewImage}
        hasContent={provider || title}
        isLoading={loading}
      >
        <>
          {provider && (
            <Typography
              role="link-preview-provider"
              variant="caption"
              style={{ color: '#fff', opacity: 0.5 }}
            >
              {provider}
            </Typography>
          )}
          {title && (
            <Typography
              variant="subtitle1"
              role="link-preview-title"
              className={classes.titleText}
            >
              {title}
            </Typography>
          )}
        </>
      </PreviewDescription>
    </>
  );
}

LinkPreview.defaultProps = {
  url: null,
  errorMessage: null,
  loading: false,
  previewImage: null,
  type: null,
  provider: null,
  title: null,
};

export default React.memo(LinkPreview);
