import React from 'react';
import PropTypes from 'prop-types';

const Schedule = ({ data, style }) => (
  <div style={style}>{data}</div>
);

Schedule.propTypes = {
  data: PropTypes.string,
  style: PropTypes.object
};

export default Schedule;
