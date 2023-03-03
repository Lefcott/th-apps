/** @format */

import React from 'react';
import styled from '@emotion/styled';
import { ButtonGroup, Button } from '@material-ui/core';

const FixedButtonContainer = styled(ButtonGroup)`
  && {
    background-color: #cecece;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 10;
  }
`;

const PaddedButton = styled(Button)`
  &&&&&& {
    padding: 18px;
    border: none;
    font-weight: bold;
  }
`;

// CardButtons is a fixed div that sits at the bottom of the
// ResidentCard, and handles updating the edit state of the card
// as well as saving/submitting resident form information
export default function CardButtons(props) {
  function goBack() {
    props.updateView()
  }

  return (
    <FixedButtonContainer fullWidth>
      <PaddedButton id="Rci_Form-back" onClick={goBack}>
        Back
      </PaddedButton>
    </FixedButtonContainer>
  );
}