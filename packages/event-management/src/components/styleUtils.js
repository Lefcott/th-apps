/** @format */

import React from 'react';
import styled from '@emotion/styled';
import { styled as muiStyled } from '@material-ui/core/styles';
import { MTableBodyRow } from 'material-table';
import {
  AppBar,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const ExpansionPanel = (props) => (
  <Accordion {...props}>
    <AccordionSummary
      expandIcon={<ExpandMore />}
      id={`${props.id}-header`}
      aria-controls={`${props.id}-content`}
    >
      {props.summary}
    </AccordionSummary>

    <AccordionDetails>{props.details}</AccordionDetails>

    {props.actions ? (
      <AccordionActions>{props.actions}</AccordionActions>
    ) : null}
  </Accordion>
);

export const FlexContainer = styled.div`
  display: flex;
  min-width: 80%;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 960px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ResponsiveTableActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 960px) {
    flex: 1 1 auto;
    overflow: auto;
  }
`;

export const FormContainer = styled(Grid)`
  max-width: ${(props) => (props.maxwidth ? props.maxwidth : '750px')};
  margin: 0 auto;

  @media (max-width: 960px) {
    max-width: 100%;
    padding-bottom: 1.5rem;
  }
`;

export const Header = styled.div`
  font-size: 34px;
  font-weight: bold;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  padding: 15px;

  @media (max-width: 960px) {
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    background: white;
    z-index: 999;
    border: 2px solid #e0e0e0;
  }
`;

export const ScrollableDiv = styled.div`
  flex: 1 1 auto;
  overflow: auto;
`;

export const ActionButton = styled(Button)`
  &&&& {
    margin: 0 5px;
    padding: 5px 40px;
  }

  @media (max-width: 960px) {
    &&&& {
      padding: 5px 20px;
    }
  }
`;

export const CheckboxContainer = styled(Grid)`
  &&&& {
    padding: 0 12px;
  }
`;

export const StyledBar = styled(AppBar)`
  &&&& {
    z-index: 99;
    flex-shrink: 0;
    box-shadow: none;
    background: none;
    border-bottom: 1px solid #e0e0e0;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-content: center;
  margin-right: 5px;
  color: rgba(0, 0, 0, 0.6);
`;

export const AppBarHeader = styled.span`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  flex: 1;
  text-align: center;
`;

export const StyledExpansion = styled(ExpansionPanel)`
  &&&& {
    box-shadow: none;
    border-top: 1px solid lightgray;
  }
`;

export const ColorBlock = styled.div`
  width: 50px;
  height: 20px;
  background-color: ${(props) => props.color};
`;

export const StyledCircularProgress = styled(CircularProgress)`
  &&&& {
    color: red;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
  }
`;

export const HoverRow = styled(MTableBodyRow)`
  #hover {
    visibility: hidden;
  }

  &:hover {
    background-color: #f0f0f7; /* pale grey */
    #hover {
      visibility: visible;
    }
  }
`;

export const SubHeader = styled.div`
  font-size: 20px;
  color: #474848;
  margin-top: 10px;
`;

export const MetaWrapper = styled.div`
  display: grid;
  margin: 20px 0;
  color: #474848;
  line-height: 1.5;
`;

export const SchedulingLabel = muiStyled(Typography)({
  color: 'rgba(0, 0, 0, 0.54)',
  fontSize: '12px',
});

export const HeaderName = ({ heading, icon }) => {
  return (
    <Typography variant="h6">
      {icon}
      {heading}
    </Typography>
  );
};

export const MuiFAIconStyling = {
  position: 'relative',
  top: '5px',
  fontSize: '1.5rem',
  marginRight: '5px',
};

export const DropdownButton = muiStyled(Button)({
  minWidth: '20px',
  padding: '8px',
});

export const DropdownAction = styled(Button)`
  &&&& {
    padding: 5px 20px;
    margin-right: 5px;
  }
`;
