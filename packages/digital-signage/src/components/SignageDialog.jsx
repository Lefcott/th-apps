/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import signageImg from '../assets/images/noSignage.svg';

// TODO figure this ish out
const SignageDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  // useEffect(() => onClick(isOpen), [isOpen]);

  return (
    <Dialog open={open} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle style={titleStyle}>
        <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
          Publish content to Common Area Televisions, an In-Room TV Channel, or
          both!
        </span>
        <IconButton
          onClick={() => setOpen(false)}
          style={{ position: 'absolute', top: '5px', right: '5px' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={contentStyle}>
        <img src={signageImg} alt="signage" />
        <Summary>
          Publish the same content you're showing on the App to the rest of your
          community with the industry's first wireless digital signage solution.
          With HD publishing, modern templates, and time-saving scheduler,
          you'll ensure everyone knows the latest at your community.
        </Summary>
      </DialogContent>
      <DialogActions style={actionsStyle}>
        <Label> Want to know more? </Label>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={() => requestInfo()}
          style={buttonStyle}
        >
          REQUEST MORE INFORMATION
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const requestInfo = () =>
  (window.location.href =
    'mailto:info@k4connect.com?subject=Digital Signage Inquiry');

const titleStyle = {
  borderBottom: '1px solid #e3e5e5',
  padding: '25px 50px',
  textAlign: 'center',
};

const contentStyle = {
  textAlign: 'center',
  paddingBottom: '10px',
};

const Summary = styled.div`
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.6);
`;

const actionsStyle = {
  display: 'grid',
  justifyContent: 'center',
  paddingBottom: '15px',
};

const Label = styled.div`
  color: #cc4c3b;
  font-size: 18px;
  font-weight: 600;
  margin: 10px !important;
  text-align: center;
  letter-spacing: 2px;
`;

const buttonStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '5px',
};

SignageDialog.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default SignageDialog;
