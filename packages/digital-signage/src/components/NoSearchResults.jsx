/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import moment from 'moment-timezone';
import { useDestinations } from '../contexts/DestinationsProvider';

const NoSearchResults = ({ filter }) => {
  const destinations = useDestinations();
  return (
    <Wrapper id="DSM_noSearchResults">
      <div>We couldn't find anything matching</div>
      <br />
      {filter.search ? displayParam(filter.search, 'Search') : null}
      {filter.date
        ? displayParam(moment(filter.date).format('MM/DD/YYYY'), 'Date')
        : null}
      {filter.destination
        ? displayParam(
            destinations.find(({ guid }) => filter.destination === guid)?.name,
            'Destination',
          )
        : null}
    </Wrapper>
  );
};

const Wrapper = styled.span`
  width: 100%;
  padding: 20px;
  text-align: center;
`;

const displayParam = (param, label) => (
  <div>
    <span>{label}: </span>
    <span style={{ fontWeight: 600 }}>{param}</span>
  </div>
);

NoSearchResults.propTypes = {
  filter: PropTypes.object,
};

export default NoSearchResults;
