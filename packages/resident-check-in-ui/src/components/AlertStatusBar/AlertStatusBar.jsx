import React from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { useResidentContext } from '../ResidentProvider';
import { flatten } from 'lodash';

const styles = {
  root: { 
    minHeight: '61px',
    borderRadius: '4px',
    lineHeight: 3.0,
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24)'
  },

  container: {
    padding: '15px 15px',
    backgroundColor: 'rgb(229, 229, 229)'
  },

  success: { 
    background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.77), rgba(255, 255, 255, 0.77)), #BFF879',
    color: '#4E6B29'
  },

  error: { 
    backgroundColor: '#FCE7E7',
    color: 'RGBA(0,0,0,.60)'
  },

  errorCount: {
    color: '#C62828',
    fontWeight: 900
  },

  icon: {
    paddingTop: '18px'
  },
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AlertCounter(props) {
  return <span class={props.className}>{props.alertCount} Alerts&nbsp;&nbsp;</span>
}

function ActiveResidentCounter({residentCount, residentTotal}) {
  return <span >{residentCount} of {residentTotal}&nbsp;</span>
}

function AlertSnackbar(props) {
  const classes = props.classes
  const context = useResidentContext();
  const residentData = context[0].userData;
  const activeResidents = residentData.filter(r => r.system && !r.away && !r.optOut)

  if(!activeResidents.length) {
    return null;
  }

  return (
      <div className={classes.container}>

        { activeResidents.filter(r => r.alerts.length).length ? 

          //alert
          <Alert severity="error" icon={<FontAwesomeIcon icon={faExclamationCircle} className={classes.errorCount} />} classes={{root: classes.root, icon: classes.icon, filledError: classes.error}} >
            <AlertCounter className={classes.errorCount} alertCount={flatten(activeResidents.map(r => r.alerts)).length}/>
            <ActiveResidentCounter residentCount={activeResidents.filter(r => !r.alerts.length).length} residentTotal={activeResidents.length}/>
            active residents checked in
            &nbsp;
            <Tooltip title="Residents set as away or opted out of RCI are not included in the active resident total" arrow>
              <span>
              <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
            </Tooltip>
          </Alert>

          :
          //no alert
          <Alert severity="success" icon={<FontAwesomeIcon icon={faCheckCircle} className={classes.success} />} classes={{root: classes.root, icon: classes.icon, filledSuccess: classes.success}} >
            <ActiveResidentCounter residentCount={activeResidents.length} residentTotal={activeResidents.length}/>
            active residents checked in
            &nbsp;
            <Tooltip title="Residents set as away or opted out of RCI are not included in the active resident total" arrow>
              <span>
              <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
            </Tooltip>
          </Alert>

        }
      </div>


  )
}

AlertSnackbar.propTypes = {
  style: PropTypes.object
}

export default withStyles(styles)(AlertSnackbar);
