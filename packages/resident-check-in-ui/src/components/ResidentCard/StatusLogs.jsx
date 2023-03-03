import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment-timezone";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import AddCircle from "@material-ui/icons/AddCircleOutlineOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { sendPendoEvent } from "@teamhub/api";
import AwayModal from "../AwayModal";
import DeleteAwayDateModal from "../DeleteAwayDateModal";
import { isEmpty } from "lodash";
import CustomAlert from "../CustomAlert";
import { AlertTitle } from "@material-ui/lab";
import { Box, Grid, Typography } from "@material-ui/core";
import { getAwayReasonLabel } from "../../utilities/helper";
import { useAwayStatusesContext } from "../AwayStatusProvider";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    zIndex: 2,
    margin: 20,
    boxShadow:
      "0px 15px 12px rgba(0, 0, 0, 0.22), 0px 19px 38px rgba(0, 0, 0, 0.3)",
  },
  tableHead: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const StatusLogs = ({ resident }) => {
  const classes = useStyles();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedAwayStatus, setSelectedAwayStatus] = React.useState(null);
  const [editingAwayDate, setEditingAwayDate] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState();
  const {
    fetchAwayStatuses,
    loadingAwayStatuses,
    awayStatuses,
    refetchAwayStatuses,
  } = useAwayStatusesContext();

  const handleCloseDeleteModal = () => {
    setSelectedAwayStatus(null);
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    sendPendoEvent("checkin_edit_away_date");
    setAnchorEl(null);
    setEditingAwayDate(true);
    setIsEditModalOpen(true);
  };

  const handleDelete = (awayStatus) => {
    sendPendoEvent("checkin_delete_away_date");
    setAnchorEl(null);
    setSelectedAwayStatus(awayStatus);
    setIsDeleteModalOpen(true);
  };

  const handleAddAway = () => {
    setSelectedAwayStatus(null);
    setEditingAwayDate(false);
    setIsEditModalOpen(true);
  };

  const handleClickMoreOptions = (event, awayStatus) => {
    setAnchorEl(event.currentTarget);
    setSelectedAwayStatus(awayStatus);
  };

  React.useEffect(() => {
    fetchAwayStatuses(resident.guid);
  }, [resident.guid]);

  if (loadingAwayStatuses) {
    return <></>;
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
        position="relative"
        zIndex={1}
        pr={3}
        mb={isEmpty(awayStatuses) ? 1 : 0}
      >
        <Button
          startIcon={<AddCircle fontSize="small" />}
          onClick={handleAddAway}
          disabled={!isEmpty(resident.alerts) || isEmpty(resident.system)}
          variant="text"
          color="primary"
        >
          <Typography variant="caption" style={{ textTransform: "none" }}>
            Add away dates
          </Typography>
        </Button>
      </Box>

      {!isEmpty(awayStatuses) ? (
        <Paper className={classes.tableContainer}>
          <Table aria-label="simple table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {awayStatuses?.map((awayStatus) => (
                <TableRow key={awayStatus.id}>
                  <TableCell component="th" scope="row">
                    {moment
                      .tz(awayStatus.startDate, resident.timezone)
                      .format("MMMM Do, YYYY")}
                  </TableCell>
                  <TableCell>
                    {awayStatus.endDate
                      ? moment
                          .tz(awayStatus.endDate, resident.timezone)
                          .format("MMMM Do, YYYY")
                      : null}
                  </TableCell>
                  <TableCell>{getAwayReasonLabel(awayStatus.reason)}</TableCell>
                  <TableCell>{awayStatus.notes}</TableCell>
                  <TableCell>
                    <MoreVertIcon
                      onClick={(event) =>
                        handleClickMoreOptions(event, awayStatus)
                      }
                      cursor="pointer"
                    />
                    <Menu
                      anchorEl={anchorEl}
                      open={
                        !!anchorEl && selectedAwayStatus?.id === awayStatus.id
                      }
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem
                        onClick={() => handleEdit()}
                        disabled={!isEmpty(resident.alerts)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(awayStatus)}
                        disabled={!isEmpty(resident.alerts)}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DeleteAwayDateModal
            resident={resident}
            isOpen={isDeleteModalOpen}
            awayStatus={selectedAwayStatus}
            close={handleCloseDeleteModal}
            refetch={refetchAwayStatuses}
          />
        </Paper>
      ) : (
        <Grid container>
          <CustomAlert color="success" severity="success">
            <AlertTitle style={{ fontWeight: "bold", fontSize: "12px" }}>
              There are no away dates for this resident.
            </AlertTitle>
          </CustomAlert>
        </Grid>
      )}
      {isEditModalOpen && (
        <AwayModal
          resident={resident}
          awayStatus={selectedAwayStatus}
          isOpen={isEditModalOpen}
          editing={editingAwayDate}
          close={() => setIsEditModalOpen(false)}
          refetch={refetchAwayStatuses}
          awayStatuses={awayStatuses}
        />
      )}
    </>
  );
};

export default StatusLogs;
