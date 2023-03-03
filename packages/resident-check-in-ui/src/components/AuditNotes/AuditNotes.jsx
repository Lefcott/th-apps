import React from 'react';
import styles from './AuditNotes.module.css';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { NotesPlaceholder } from '../../assets/placeholders/placeholders';
import AlertsApi from '../../apis/alertsApi';

const defaultTimezone = 'America/New_York';

export default function AuditNotes(props) {
  const [state, setState] = React.useState({
    notes: null,
    user: null,
    date: null,
    show: false,
    loading: true,
  });

  const {
    notes, user, date, show, loading,
  } = state;

  // update audit notes whenever a new alert passes through
  // or the current alert has changed
  React.useEffect(() => {
    const { id, } = props.alert;
    let cancelled = false;

    const getAlerts = async () => {
      try {
        const res = await AlertsApi.getAudits(id);
        if (res !== 'error' && !cancelled) {
          const [audit] = res.AlertsAudits;
          if (!audit || audit.user === null || audit.notes === null) {
            setState({ ...state, show: false, });
            return;
          }
          const { user, } = audit;
          const timezone = user && user.timezone ? user.timezone : defaultTimezone;
          const date = moment.tz(audit.date, timezone).format('MMM D, h:mm A');
          if (!cancelled) {
            setState({
              show: true, notes: audit.notes, user: user.email, date,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      getAlerts();
    }

    return () => {
      cancelled = true;
    };
  }, [props.alert, props.resident]);

  if (show) {
    return (
      <div>
        {loading ? <NotesPlaceholder />
          : (
            <div className={styles.audit}>
              <div className={styles.audit_notes}>{notes}</div>
              <div className={styles.audit_user}>{user} - {date}</div>
            </div>
          )
        }
      </div>
    );
  }
  return null;
}

AuditNotes.propTypes = {
  alert: PropTypes.object,
};
