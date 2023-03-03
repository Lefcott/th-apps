/** @format */

import React, { useState } from 'react';
import ManagerApi from '../api/managerApi';
import { remove } from 'lodash';
import {
  Dialog,
  FormHelperText,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import phone from '../assets/icons/phone.svg';
import errorImg from '../assets/images/errorRocket.svg';

export const HelperText = (props) => {
  const helperText = props.helperText;
  const error = props.error;
  const disabled = props.disabled;
  if (props.helperText && helperText.length) {
    return (
      <FormHelperText error={error} disabled={disabled}>
        {helperText}
      </FormHelperText>
    );
  }
  return null;
};
