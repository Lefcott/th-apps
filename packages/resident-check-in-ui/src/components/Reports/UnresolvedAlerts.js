import React from 'react';
import styles from './Reports.module.css';
import moment from 'moment-timezone';
import Table from './ReportTable';
import { Button } from '@material-ui/core';
import { useReactToPrint } from 'react-to-print';
import { ResidentContext } from '../ResidentProvider';
import { getUrl } from '../../utilities/url';
import { contactInfo, rowNumber } from './formatFields';
import { getAlerts } from './utils';
import { isSafari, safariPrintHandler } from '../../utilities/safariPrintUtil';

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

export default function UnresolvedAlerts(props) {
  const context = React.useContext(ResidentContext);
  const [{ userData }] = context;
  const printRef = React.useRef(null);
  const [ isLoading, setIsLoading ] = React.useState(false) 
  const unresolvedAlerts = getAlerts(userData, 'active', false);
  
  const { communityName } = getUrl();
  const currentDate = moment().format('MMM D, h:mm A');

  const handlePrint = useReactToPrint({
    onAfterPrint: () => {
      setIsLoading(false);
      props.onClose();
    },
    onPrintError: () => setIsLoading(false),
    content: () => printRef.current,
    pageStyle: pageStyle,
  })
  
  const safariPrinter = () => {
    safariPrintHandler(printRef, 'Alert Activity Report', pageStyle);
    setIsLoading(false);
    props.onClose();
  }

  /**
   * Initial action for printing.
   */
  const hitPrint = async () => {
    setIsLoading(true)
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
        disabled={isLoading}
        style={{ padding: '8px 16px', justifyContent: 'flex-start' }}
        onClick={hitPrint}>
        Unresolved Alerts
      </Button>
      <div style={{ display: 'none', }}>
        <PrintArea
          ref={printRef}
          data={unresolvedAlerts}
          communityName={communityName}
          currentDate={currentDate}
        />
      </div>
    </>
  )
}

const PrintArea = React.forwardRef((props, ref) => {
  const { data, currentDate, communityName } = props;

  const descriptionFormat = (data) => <><div style={{ whiteSpace: "normal" }}>{data.alert.description}</div><br /></>;
  const dateFormat = data => <><div>{moment(data.alert.createdAt).format('M/DD/YYYY')}</div><br /></>;
  const timeFormat = data => <><div>{moment(data.alert.createdAt).format('h:mm A')}</div><br /></>;

  return (
    <div ref={ref}>
      <div style={{ margin: '0 25px 25px 25px' }}>
        <div className={styles["communityName"]}>
          <span>{communityName}</span>
          <span style={{ float: 'right', }}>K4Community</span>
        </div>

        <div className={styles["header"]}>
          <div className={styles["header--title"]}>Unresolved Alerts</div>
          <div className={styles["header--date"]}>{currentDate}</div>
        </div>

        <Table columns={[
          {
            name: '', render: rowNumber, width: '3%'
          },
          { name: 'Name', field: 'fullName', render: contactInfo, width: '22%' },
          { name: 'Alert Description', render: descriptionFormat, width: '50%' },
          { name: 'Date', render: dateFormat, width: '10%' },
          { name: 'Time', render: timeFormat, width: '15%' }
        ]}
          data={data} />
      </div>
    </div>
  )
})
