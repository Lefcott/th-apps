import React from 'react';
import styled from '@emotion/styled';
import { TextField, MenuItem } from '@material-ui/core';

const ViewField = styled(TextField)`
  && {
    min-width: 200px;
    margin-bottom: 25px;

    @media (max-width: 960px) {
      width: 100%;
    }
  }
`;

function ViewFilter(props) {
  const { value, onChange } = props;

  return (
    <ViewField
      className="CL_viewFilter"
      select
      label="View"
      value={value}
      onChange={({ target }) => onChange(target.value)}
      style={{ minWidth: 200, marginBottom: 25 }}
      InputLabelProps={{ shrink: true }}
    >
      <MenuItem className="CL_viewFilter-all" value="communityContent">
        Community Content
      </MenuItem>
      <MenuItem className="CL_viewFilter-mine" value="myContent">
        My Content
      </MenuItem>
    </ViewField>
  );
}

export default ViewFilter;
