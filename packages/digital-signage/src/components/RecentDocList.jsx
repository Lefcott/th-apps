/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { find, isEqual, get } from 'lodash';
import styled from '@emotion/styled';
import brokenThumbnail from '../assets/images/broken.svg';
import { getDocumentBase } from '../utilities/url-service';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
} from '@material-ui/core';
const documentServiceUrl = getDocumentBase();

const GridListView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: auto;
  height: 100%;
  height: fill-available;
`;

const gridTileStyle = {
  height: '10em',
  width: '45%',
  margin: '2%',
  border: '1px solid black',
  borderRadius: '10px',
  overflow: 'auto',
};

function CardView(props) {
  const { document, scheduleClick } = props;

  const isPublished = find(document.Schedules, (sch) =>
    isEqual(get(sch, 'Destination.type'), 'Risevision Display'),
  );
  const hasSchedules = document.Schedules && document.Schedules.length > 0;

  const getThumbnail = () => {
    let thumbnail = brokenThumbnail;
    if (document.DocumentJpegs && document.DocumentJpegs.length) {
      const jpegArr = document.DocumentJpegs[0].jpegUrl;
      const firstFile = JSON.parse(jpegArr)[0];
      thumbnail = `${documentServiceUrl}/download?filename=${firstFile}&redirect=true`;
    }
    return thumbnail;
  };

  return (
    <GridListTile style={gridTileStyle}>
      <div>
        <img
          src={getThumbnail()}
          alt={document.name}
          style={{ position: 'relative', width: '100%', height: '100%', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
        />
      </div>
      <GridListTileBar
        style={{
          borderRadius: '0px 0px 8px 8px',
          fontWeight: 'bold',
          background: 'rgba(0, 0, 0, 0.7)',
        }}
        title={document.name}
        subtitle={
          <span>
            Edited: {moment(document.updatedAt).format('MMM Do, h:mm A')}
          </span>
        }
        actionIcon={
          <Button
            variant="contained"
            className="DSM_Slideshow-Card-Publish-Button"
            color={hasSchedules && isPublished ? 'secondary' : 'primary'}
            size="small"
            style={{ margin: '0.5em' }}
            aria-label={`info about ${document.name}`}
            onClick={() => scheduleClick(document)}
          >
            {hasSchedules && isPublished ? 'Re-' : ''}Publish
          </Button>
        }
      />
    </GridListTile>
  );
}

function RecentDocList(props) {
  const { documents, scheduleClick } = props;
  return (
    <GridListView>
      <GridList
        style={{
          margin: '0px',
          width: '96%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {documents.map((document) => (
          <CardView
            key={document.guid}
            document={document}
            scheduleClick={scheduleClick}
          />
        ))}
      </GridList>
    </GridListView>
  );
}

RecentDocList.propTypes = {
  documents: PropTypes.array.isRequired,
  scheduleClick: PropTypes.func.isRequired,
};

export default RecentDocList;
