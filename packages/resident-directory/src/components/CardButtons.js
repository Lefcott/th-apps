/** @format */

import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import {
  ButtonGroup,
  Button,
  useMediaQuery,
  CircularProgress,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { activeResidentVar } from '../apollo.config';
import strings from '../constants/strings.js';

const FixedButtonContainer = styled(ButtonGroup)`
  && {
    background-color: white;
    width: 100%;
  }
`;

const PaddedButton = styled(Button)`
  &&&&&& {
    padding: 18px;
    border: none;
    font-weight: bold;
  }
`;

function ButtonLoadingState() {
  return (
    <>
      <CircularProgress
        color="inherit"
        size={'1.5rem'}
        style={{ marginRight: '10px' }}
      />
      {strings.Card.button.save}...
    </>
  );
}

// CardButtons is a fixed div that sits at the bottom of the
// ResidentCard, and handles updating the edit state of the card
// as well as saving/submitting resident form information
export default function CardButtons(props) {
  const isMobile = useMediaQuery('(max-width:960px)');

  function goBack() {
    activeResidentVar(null);
  }

  if (!props.editing && isMobile) {
    return (
      <FixedButtonContainer fullWidth>
        <PaddedButton id="Rm_Form-back" onClick={goBack}>
          {strings.Card.button.back}
        </PaddedButton>
        <PaddedButton id="Rm_Form-edit" color="primary" onClick={props.edit}>
          <Edit style={{ marginRight: '5px' }} />
          {strings.Card.button.edit}
        </PaddedButton>
      </FixedButtonContainer>
    );
  } else if (!props.editing && !isMobile) {
    return (
      <FixedButtonContainer fullWidth>
        <PaddedButton id="Rm_Form-edit" color="primary" onClick={props.edit}>
          <Edit style={{ marginRight: '5px' }} />
          {strings.Card.button.edit}
        </PaddedButton>
      </FixedButtonContainer>
    );
  }

  return (
    <FixedButtonContainer fullWidth>
      <PaddedButton
        id="Rm_Form-cancel"
        onClick={props.cancel}
        disabled={props.isSubmitting}
      >
        {strings.Card.button.cancel}
      </PaddedButton>
      <PaddedButton
        id="Rm_Form-save"
        type="submit"
        color="primary"
        onClick={props.save}
        disabled={props.isSubmitting}
      >
        {props.isSubmitting ? <ButtonLoadingState /> : strings.Card.button.save}
      </PaddedButton>
    </FixedButtonContainer>
  );
}

CardButtons.propTypes = {
  editing: PropTypes.bool,
  cancel: PropTypes.func,
  save: PropTypes.func,
  edit: PropTypes.func,
};
