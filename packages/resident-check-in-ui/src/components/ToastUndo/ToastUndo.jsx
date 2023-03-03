import React from 'react';
import PropTypes from 'prop-types';
import styles from './ToastUndo.module.css';
import { Button, Grid } from '@material-ui/core';

const ToastUndo = ({ message, undoOnClick }) => (
  <Grid container>
    <Grid item xs={9}>
      {message}
    </Grid>
    <Grid item className={styles.btnWrapper} xs={3}>
      <Button className={styles.undoBtn} onClick={undoOnClick}>Undo</Button>
    </Grid>
  </Grid>
);

ToastUndo.propTypes = {
  message: PropTypes.string,
  undoOnClick: PropTypes.func,
};

export default ToastUndo;
