import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { AlertTitle } from "@material-ui/lab";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { useResidentContext } from '../ResidentProvider';
import ActivityData from '../../apis/activityDataApi';
import Reports from '../../apis/reportsApi';
import { useCommunityContext } from "../../contexts/CommunityContext";
import {
  ListPlaceholder,
} from "../../assets/placeholders/placeholders";

const styles = {
  root: { 
    display: 'flex',
    backgroundColor: 'transparent',
    zIndex: 2,
    textAlign: 'left',
    marginBottom: '100px',
  },

  container: {
    margin: '20px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 20%)',
    flex: '1 1 auto',
    fontFamily: 'Roboto',
    fontStyle: 'Regular',
    fontSize: '16px',
    lineHeight: '29px',
    letterSpacing: '0.15px',
    fontWeight: 400,
  },

  historyLabel: {
    padding: '20px'
  },

  event: {
    color: 'black',
    fontWeight: 400,
    textAlign: 'left'
  },

  priorityEvent: {
    fontWeight: 900
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
    fontWeight: 400
  },

  icon: {
    paddingTop: '18px'
  },

  dayOfWeek: {
    color: 'RGBA(0,0,0,.60)',
    fontSize: '14px',
    textAlign: 'right',
    paddingRight: '15px'
  },
  time: {
    color: 'RGBA(0,0,0,.60)',
    fontSize: '14px',
    textAlign: 'left'
  }
};

const uniqueEvents = {
  'No Activity Detected': 'No Activity Detected'
}

function calculateDisplayDate(current, last) {
  if(!new moment(current).isSame(new moment(last)) && new moment(current).format('dddd') === new moment(last).format('dddd')) {
    return '';
  }

  if(new moment(current).isBefore(new moment().subtract('1', 'week'))) {
    return new moment(current).format('MMMM Do')
  }

  return new moment(current).format('dddd');
}


function ActivityHistory(props) {
  const [activityData, setActivityData] = useState(null);
  const [sortedData, setSortedData] = useState(null);
  const classes = props.classes
  const context = useResidentContext();
  const selectedResident = context[0] && context[0].selectedResident;
 
  const { 
    loadingCommunity,
    community
  } = useCommunityContext();

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(selectedResident) {
      async function getActivityData(sysId, userId) {
        setLoading(true)
        const activityData = await ActivityData.getCheckinActivity({ user: userId })
        const reportAudit = await Reports.getReportAudit({ startDate: new moment().subtract('1', 'week'), endDate: new moment() })
        let filteredAudit = reportAudit.filter(r => r.guid === userId && r.alerts && r.alerts.length)

        const clearedAlerts = filteredAudit[0] ? filteredAudit[0].alerts.filter(f => f.status === "cleared").map(f => {
          let action;
          let auditItems = f.AlertsAudits.sort((a, b) => new Date(b.date) - new Date(a.date));

          try {
            let communityActions = JSON.parse(auditItems[0].actions);
            for (const [key, value] of Object.entries(communityActions)) {
              if(value == true) {
                action = key;
              }
            }
          } catch(e) {
            console.log('could not parse audit actions')
          }
          return {
            date: new Date(f.resolved).getTime(),
            description: `Manual Checkin: ${action}`
          }
        }) : []

        setLoading(false)
        setActivityData(activityData.concat(clearedAlerts).sort((a, b) => moment(b.date) - moment(a.date)));
      }
      getActivityData(selectedResident.system, selectedResident.guid);
      
    }
  }, [selectedResident])

  const hideDeviceHistoryForOptedOutFlag = community?.settings?.hideDeviceHistoryForOptedOutEnabled;
  const showDeviceHistory = (!hideDeviceHistoryForOptedOutFlag || !selectedResident?.optOut) && !loadingCommunity;


  const eventData = activityData;


  const renderData = () => {
    if(!activityData || !activityData.length || !showDeviceHistory) {
      return <AlertTitle style={{ fontWeight: "bold", fontSize: "12px" }}>There is no recent check-in history for this resident.</AlertTitle>
    }
    const renderedOutput = eventData.map((data, index) => 
      (
        <>
          <Grid item xs={2} className={classes.dayOfWeek}>{calculateDisplayDate(data.date, eventData[(index === 0 ? index : index - 1)].date)}</Grid>
          <Grid item xs={3} className={classes.time}> {new moment(data.date).format('hh:mm a')}</Grid>
          <Grid item xs={7} className={`${classes.event} ${data.description === uniqueEvents['No Activity Detected'] ? classes.priorityEvent : ''}`} > 
          {data.description === uniqueEvents['No Activity Detected'] ?
            <span><FontAwesomeIcon icon={faExclamationCircle} className={classes.event}/> </span>: ''
          }
          {data.description}</Grid>
        </>
      ))
    return renderedOutput
  }

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={12} className={classes.historyLabel}>
          <div>
          Check-in History
              &nbsp;
              <Tooltip title="A resident is checked in when activity is detected, shown below at the time it occurred" arrow>
                <span>
                <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
              </Tooltip>
          </div>

        </Grid>
        {loading 
          ? <ListPlaceholder height='300' width='300'/>
          : (renderData())
        }
        
      </Grid>

    </div>

  )
}

ActivityHistory.propTypes = {
  style: PropTypes.object
}

export default withStyles(styles)(ActivityHistory);
