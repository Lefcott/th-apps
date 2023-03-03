import React, { Component } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@material-ui/core';
import DateSelector from '../DateSelector';
import styles from './Reports.module.css';
import Reports from '../../apis/reportsApi';
import Table from './ReportTable';
import moment from 'moment-timezone';
import { rowNumber, contactInfo, alertDescription, alertNotes } from './formatFields';
import { getUrl } from '../../utilities/url';
import Dialog from '../Dialog';
import { getAlerts } from './utils';
import { isSafari, safariPrintHandler } from '../../utilities/safariPrintUtil';

/**
 * Styles for non-safari page printing
 */
const pageStyle = `
  @page { 
    margin: 15px 50px 50px;
    size: auto;
  }
  @page :first {
    margin: 0 50px 50px
  }
  
  @media print {
    html, body {
      height: initial !important;
      overflow: initial !important;
      -webkit-print-color-adjust: exact;
    }
  }
`;

export default function TimeRangeReport(props) {
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = React.useState();
  const [[startDate, endDate], setDates] = React.useState([moment().startOf('day').toDate(), moment().endOf('day').toDate()])
  const printRef = React.useRef();
  const handlePrint = useReactToPrint({
    onAfterPrint: () => {
      setOpen(false); 
      props.onClose()
    },
    pageStyle: pageStyle,
    content: () => printRef.current,
  });
  const { communityName, } = getUrl();

  const safariPrinter = () => {
    safariPrintHandler(printRef, 'Alert Activity Report', pageStyle);
    setOpen(false);
    props.onClose();
  }

  /**
   * Initial action for printing.
   */
  const hitPrint = async () => {
    const reportAudit = await Reports.getReportAudit({ startDate: startDate.toISOString(), endDate: endDate.toISOString() })
    setUserData(reportAudit);
    if (isSafari()) {
      return safariPrinter();
    }
    return handlePrint()
  }

  return (
    <>
      <Button 
        fullWidth 
        size='small'
        disabled={open}
        style={{ padding: '8px 16px', justifyContent: 'flex-start' }} 
        onClick={() => setOpen(true)}>
        Alert Activity Report
      </Button>

      <Dialog
        title={(
          <span>Set a Date Range for Report</span>
        )}
        open={open}
        onClose={() => setOpen(false)}
        content={(
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            handler={(dates) => setDates(dates)}
          />
        )}
        actions={(
          <>
            <Button color="primary" variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={hitPrint}>Generate Report</Button>
          </>
        )}
      />

      {
        (userData
          && (
            <div id="printarea-parent" style={{ display: 'none' }}>
              <PrintArea
                ref={printRef}
                data={userData}
                communityName={communityName}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )
        )
      }
    </>
  )
}

// ReactToPrint requires a class component ooop
const PrintArea = React.forwardRef((props, ref) => {
    const { data, startDate, endDate, communityName } = props;
    return (
      <div ref={ref}>
        <div id="print-area" style={{ margin: '0 25px' }}>
          <div className={styles["communityName"]}>
            <span>{communityName}</span>
            <span style={{ float: 'right' }}>K4Community</span>
          </div>

          <div className={styles["header"]}>
            <div className={styles["header--title"]}>Alert Activity Report</div>
            <div className={styles["header--date"]}>Report from {moment(startDate).format('MMM D, h:mm A')} - {moment(endDate).format('MMM D, h:mm A')}</div>
            <div className={styles["header--subLabel"]}>This report shows all activity on alerts generated within the time window shown above.</div>
          </div>

          <div className={styles["subHeader"]}>
            <span>UNRESOLVED ALERTS</span>
          </div>

          <Table
            columns={[
              {
                name: '', render: rowNumber, width: '3%'
              },
              { name: 'Name', render: contactInfo, width: '20%' },
              { name: 'Alert Description', render: alertDescription, width: '30%' },
              { name: 'Notes', render: alertNotes, width: '47%' }
            ]}
            data={getAlerts(data, 'active')} />


          <div className={styles["subHeader"]}>
            <span>RESOLVED ALERTS</span>
          </div>

          <Table columns={[
            {
              name: '', render: rowNumber, width: '3%'
            },
            { name: 'Name', render: contactInfo, width: '20%' },
            { name: 'Alert Description', render: alertDescription, width: '30%' },
            { name: 'Notes', render: alertNotes, width: '47%' }
          ]}
            data={getAlerts(data, 'cleared')} />
        </div>
      </div>
    )
  }
)
