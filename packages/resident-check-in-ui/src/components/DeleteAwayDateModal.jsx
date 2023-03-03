import React from "react";
import { Button, useMediaQuery } from "@material-ui/core";
import { NotificationsOff } from "@material-ui/icons";
import { sendPendoEvent } from "@teamhub/api";
import { useMutation } from "@teamhub/apollo-config";
import { showToast } from "@teamhub/toast";
import { REMOVE_AWAY_STATUS } from "../graphql/residents";
import { useResidentContext } from "./ResidentProvider";
import { getOneSearchParam } from "../utilities/url";
import Dialog from "./Dialog";

const DeleteAwayDateModal = ({
  resident,
  awayStatus,
  close,
  refetch,
  isOpen,
}) => {
  const communityId = getOneSearchParam("communityId", "2476");
  const [loading, setLoading] = React.useState(false);
  const [, , , refetchResidents] = useResidentContext();
  const [removeAwayStatus] = useMutation(REMOVE_AWAY_STATUS, {
    async onCompleted(data) {
      await onDeleteSuccess(data);
    },
    onError(err) {
      onDeleteError(err);
    },
  });

  const handleCancel = () => {
    close();
    setLoading(false);
    sendPendoEvent("checkin_delete_away_date_cancel");
  };

  const handleConfirm = () => {
    sendPendoEvent("checkin_delete_away_date_confirm");
    setLoading(true);
    removeAwayStatus({
      variables: {
        communityId,
        id: awayStatus.id,
        residentId: resident.guid,
      },
    });
  };

  const onDeleteSuccess = async () => {
    await Promise.all([refetch(), refetchResidents()]);
    showToast("The away date has been deleted successfully.");
    setLoading(false);
    close();
  };

  const onDeleteError = () => {
    setLoading(false);
  };

  return (
    <Dialog
      fullScreen={useMediaQuery("(max-width: 960px)")}
      disableBackdropClick={loading}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <NotificationsOff color="primary" />
          <span>Delete {resident.firstName}'s Away Date</span>
        </div>
      }
      content={<>Deleting this away date will permanently remove it.</>}
      onClose={handleCancel}
      open={isOpen}
      actions={
        <>
          <Button color="primary" variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
          >
            Confirm
          </Button>
        </>
      }
    />
  );
};

export default DeleteAwayDateModal;
