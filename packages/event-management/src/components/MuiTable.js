/** @format */

import React from 'react';
import MaterialTable, { MTableAction } from 'material-table';
import { cloneDeep } from 'lodash';
import {
  Edit,
  CancelOutlined,
  Remove,
  FilterList,
  DeleteOutline,
  Add,
  Check,
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
  SaveAlt,
  Search,
} from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const AddAction = ({ tableRef, ...props }) => {
  const handleClick = (event) => {
    props.action.onClick(event, props.data);

    tableRef.current.tableContainerDiv.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <IconButton onClick={handleClick}>
      <Add />
    </IconButton>
  );
};

const Action = (props) => {
  if (props.action.tooltip === 'Add') {
    return <AddAction {...props} />;
  }

  return <MTableAction {...props} />;
};

const MuiTable = (props) => {
  const tableRef = React.useRef(null);
  const components = props.components || {};

  return (
    <MaterialTable
      {...props}
      tableRef={tableRef}
      // make an explicit copy of the data
      data={cloneDeep(props.data)}
      style={tableStyle}
      components={{
        ...components,
        Action: (props) => <Action {...props} tableRef={tableRef} />,
      }}
      icons={{
        Delete: DeleteOutline,
        Check: Check,
        Clear: CancelOutlined,
        Cancel: CancelOutlined,
        Edit: Edit,
        DetailPanel: ChevronRight,
        Export: SaveAlt,
        Filter: FilterList,
        FirstPage: FirstPage,
        LastPage: LastPage,
        NextPage: ChevronRight,
        PreviousPage: ChevronLeft,
        ResetSearch: CancelOutlined,
        Search: Search,
        ThirdStateCheck: Remove,
      }}
      options={{
        showTitle: false,
        headerStyle: { backgroundColor: '#f0f0f7' },
        searchFieldAlignment: 'left',
        toolbarButtonAlignment: 'right',
        addRowPosition: 'first',
        actionsColumnIndex: 10,
        paging: false,
        sorting: false,
        draggable: false,
        ...props.options,
      }}
    />
  );
};

const tableStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexFlow: 'column',
  boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.16)',
};

export default MuiTable;
