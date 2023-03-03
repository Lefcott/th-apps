/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import tv from '../assets/icons/tv.svg';
import Tooltip from '@material-ui/core/Tooltip';

const Backdrop = styled.div`
  border-radius: 40px;
  background-color: #e3e5e5;
  height: 20px;
  position: relative;
  width: 50px;
  margin-right: 10px;
`;

const Image = styled.img`
  position: absolute;
  left: 10px;
  top: 6px;
  width: 12px;
`;

const Count = styled.span`
  font-size: 12px;
  position: absolute;
  left: 30px;
  top: 2px;
`;

const Destinations = ({ data = [] }) => {
  const title = data.length
    ? data.map((obj) => obj.name).join(', ')
    : 'No destinations';
  return (
    <Tooltip title={title} placement="right" disableFocusListener>
      <Backdrop>
        <Image src={tv} alt="tv" />
        <Count>{data.length}</Count>
      </Backdrop>
    </Tooltip>
  );
};

Destinations.propTypes = {
  data: PropTypes.array,
};

export default Destinations;
