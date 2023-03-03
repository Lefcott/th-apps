/** @format */

import styled from '@emotion/styled';
import { ExpansionPanel } from '../components/reusableComponents';
import { Typography } from '@material-ui/core';

export const StyledExpansionPanel = styled(ExpansionPanel)`
  && {
    border: none;
    border-radius: 4px;
    margin-bottom: 15px;
  }
`;

export const SummaryHeader = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
  }
`;

export const Sublabel = styled(Typography)`
  && {
    font-size: 16px;
    color: #707070;
  }
`;

export const Switchlabel = styled(Typography)`
  && {
    font-size: 12px;
    color: #707070;
    display: inline;
  }
`;
