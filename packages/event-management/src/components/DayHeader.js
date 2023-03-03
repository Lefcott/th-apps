/** @format */

import React from 'react';
import moment from 'moment-timezone';
import { assign } from 'lodash';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';

const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Header = styled(Grid)`
  flex-shrink: 0;
  text-align: center;
  background-color: #f4f4f4;
  padding: 25px;

  @media (max-width: 960px) {
    width: 20vw;
    border: solid #e3e5e5;
    border-width: 1px 0;
  }
`;

function DayHeader(props) {
  const dayIndex = props.date.day();
  const dayShort = weekdaysShort[dayIndex];
  const dayNum = props.date.format('D');

  const dayNumStyle = () => {
    const normStyle = { fontWeight: 500, fontSize: 18 };
    const isTodayStyle = {
      backgroundColor: '#4c43db',
      color: '#ffffff',
      padding: '5px 10px',
      borderRadius: 100,
    };
    return moment().isSame(props.date, 'day')
      ? assign(normStyle, isTodayStyle)
      : normStyle;
  };

  return (
    <Header item>
      <span style={{ fontWeight: 'bold' }}>{dayShort}</span>
      <Grid style={{ paddingTop: 8 }}>
        <span style={dayNumStyle()}>{dayNum}</span>
      </Grid>
    </Header>
  );
}

export default DayHeader;
