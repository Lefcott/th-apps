/** @format */

import React from 'react';
import svg from '../assets/images/empty_state.svg';
import styled from '@emotion/styled';
import { Grid, Typography } from '@material-ui/core';
import getCareSettingsDisplayText from '../utils/getCareSettingsDisplayText';
import strings from '../constants/strings';

const EmptyListWrapper = styled(Grid)`
  display: block;
  text-align: center;
  padding: 0 15px;
`;

export const ListEmptyState = ({ search, careSettings = [] }) => (
  <EmptyListWrapper>
    <Typography>{strings.CareSetting.emptyList.title}</Typography>
    {search.length > 0 && (
      <Typography style={{ fontWeight: 600 }}>
        {strings.CareSetting.emptyList.search} {search}
      </Typography>
    )}
    {careSettings.length > 0 && (
      <Typography style={{ fontWeight: 600 }}>
        Care Setting{careSettings.length > 1 ? 's' : ''}:{' '}
        {/* Separate selected options with commas if there are more than one */}
        {careSettings.map((careSetting, index) =>
          index !== careSettings.length - 1
            ? `${getCareSettingsDisplayText(careSetting)}, `
            : getCareSettingsDisplayText(careSetting),
        )}
      </Typography>
    )}
  </EmptyListWrapper>
);

export const CardEmptyState = () => (
  <img
    src={svg}
    alt="No User Selected"
    style={{ height: '100%', width: '100%' }}
  />
);
