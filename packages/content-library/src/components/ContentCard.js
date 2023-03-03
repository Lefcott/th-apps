import React, { useState } from 'react';
import { isEqual, isArray, includes, toLower } from 'lodash';
import {
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InfoOutlined } from '@material-ui/icons';
import { getPlaceholderIcon, getUrlThumb } from './utils';
import ButtonDropdown from './ButtonDropdown';
import ContentDetails from './ContentDetails';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    margin: '7px',
    height: '212px',
    width: '200px',
    cursor: 'pointer',
  },
  image: (props) => ({
    padding: 0,
    width: '100%',
    marginTop: props.error ? '-20px' : '0',
    display: props.loaded ? 'block' : 'none',
    objectFit: props.error ? 'scale-down' : 'cover',
    transition: '0.3s',
    transform: 'scale(1)',
    opacity: '.9',
    '&:hover': {
      opacity: 1,
      transform: 'scale(1.1)',
    },
  }),
  content: {
    maxHeight: 'calc(30% - 48px)',
    padding: '13px 24px',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 0,
    width: '100%',
  },
  primaryText: {
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '80%',
  },
  secondaryText: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  loader: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    marginLeft: '-10px',
  },
  infoButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '7px',
    padding: '0',
    opacity: '80%',
    backgroundColor: '#ffffff',
    '&hover': {
      backgroundColor: '#e6e6e6',
    },
  },
}));

function ContentCard(props) {
  const { data, refetch, sliderRefs, sectionKey } = props;
  const documentUrl = isEqual(data.docType, 'photo') ? data.url : data.images;
  const image = isArray(documentUrl) ? documentUrl[0] : documentUrl;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const src = getUrlThumb(image);
  const classes = useStyles({
    type: data.docType,
    src: src || getPlaceholderIcon(data.docType),
    loaded,
    error: error || !src,
  });

  function onError({ target }) {
    const fallbackSrc =
      target.src.indexOf('.thumb') < 0
        ? getPlaceholderIcon(data.docType)
        : src.replace('.thumb', '');
    target.src = fallbackSrc;
    setError(true);
    setLoaded(true);
  }

  return (
    <Card classes={{ root: classes.card }} elevation={4} className="CL_card">
      <ButtonDropdown
        content={data}
        refetch={refetch}
        sliderRefs={sliderRefs}
        sectionKey={sectionKey}
      />

      {!loaded && <CircularProgress className={classes.loader} size={20} />}
      <CardMedia
        component="img"
        height="212"
        classes={{ img: classes.image, media: classes.image }}
        src={getUrlThumb(image) || getPlaceholderIcon(data.docType)}
        onLoad={() => setLoaded(true)}
        onClick={() => setDetailsOpen(true)}
        alt={data.name}
        title={data.name}
        onError={onError}
      />

      <CardContent
        className={`CL_card-contentName ${classes.content}`}
        onClick={() => setDetailsOpen(true)}
      >
        <Typography className={classes.primaryText}>{data.name}</Typography>
        {data.dimensions ? (
          <Typography className={classes.secondaryText}>
            {data.dimensions}
          </Typography>
        ) : null}
      </CardContent>

      {detailsOpen && (
        <ContentDetails
          data={data}
          image={documentUrl}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </Card>
  );
}

export default ContentCard;
