import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import _ from "lodash";
import axios from "axios";
import copy from "copy-to-clipboard";
import generateFormsURL from "../util/index";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

import {
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  Divider,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { formId, jwt, communityId, forceFormsUpdate } from "../recoil/atoms";

function FormRow(props) {
  const history = useHistory();
  const row = props.row;

  const [currentFormId, setFormId] = useRecoilState(formId);
  const [currentCommunityId, setCommunityId] = useRecoilState(communityId);
  const [currentJwt, setJwt] = useRecoilState(jwt);

  const forceForms = useSetRecoilState(forceFormsUpdate);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToast = () => {
    enqueueSnackbar("Copied to clipboard");
    copy(`${generateFormsURL()}/render.html?id=${row.id}&communityId=${currentCommunityId}`);
    handleClose();
  };

  const handleEdit = () => {
    setFormId(row.id);
    history.push({ pathname: "/builder", search: `?formId=${row.id}` });
  };

  const handleDownload = () => {
    const httpHeaders = {
      Authorization: `Bearer ${currentJwt}`,
    };
    axios
      .get(
        `${generateFormsURL()}/forms/${currentCommunityId}/submissions/${
          row.id
        }?download=true`,
        {
          headers: httpHeaders,
        }
      )
      .then((response) => {
        const element = document.createElement("a");
        const file = new Blob([response.data], { type: "text/csv" });
        element.href = URL.createObjectURL(file);
        element.download = "results.csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      })
      .catch((error) => {
        console.error(error);
      });

    setAnchorEl(null);
  };

  const handleDelete = () => {
    const httpHeaders = {
      Authorization: `Bearer ${currentJwt}`,
    };
    axios
      .delete(`${generateFormsURL()}/forms/${row.id}`, {
        headers: httpHeaders,
      })
      .then(() => {
        // Weird Recoil way to force forms list to update
        forceForms((n) => n + 1);
      })
      .catch((error) => {
        console.error(error);
      });

    setAnchorEl(null);
  };

  return (
    <TableRow key={row.id}>
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell align="left">
        {new Date(row.modifiedTimestamp).toDateString()}
      </TableCell>
      <TableCell align="left">
        {JSON.parse(row.data).destination.name}
      </TableCell>
      <TableCell align="right">View</TableCell>
      <TableCell align="right">
        <MoreVertIcon onClick={handleClick} />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleToast}>Copy Link</MenuItem>
          <MenuItem onClick={handleDownload}>Download Data</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default FormRow;
