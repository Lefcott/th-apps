import React, { useState } from "react";
import { getCommunityId } from "@teamhub/api";
import { useMutation } from "@teamhub/apollo-config";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  Typography,
  List,
  Box,
  CircularProgress,
} from "@material-ui/core";
import MatchItem from "./PosMatchItem";
import { LINK_RES_TO_POS } from "../graphql/residents";
import { showToast } from "@teamhub/toast";

const useModalStyles = makeStyles((theme) => ({
  typography: {
    fontWeight: 500,
    paddingTop: "10px",
    paddingBottom: "5px",
  },
}));

export default function PosMatchModal(props) {
  const { open, close, resident } = props;
  const { typography } = useModalStyles();
  const [checkedValue, setCheckedValue] = useState(null);
  const communityId = getCommunityId();

  const cancel = () => {
    close();
    setCheckedValue(null);
  };

  const [linkRedToPos, { loading }] = useMutation(LINK_RES_TO_POS, {
    onCompleted() {
      showToast(
        `${resident.firstName} ${resident.lastName} has been successfully matched`
      );
    },
  });

  const submit = async () => {
    const variables = {
      ...checkedValue,
      communityId,
    };

    await linkRedToPos({ variables });
  };

  return (
    <Dialog
      fullWidth
      fullScreen={useMediaQuery("(max-width:960px)")}
      open={open}
      onClose={close}
      style={{ minHeight: "540px" }}
    >
      <DialogTitle style={{ paddingBottom: "0px" }}>
        {`${resident.matches.length} Potential ID
        ${resident.matches.length > 1 ? "s" : ""} for
        ${resident.fullName}`}
      </DialogTitle>
      <DialogContent style={{ paddingBottom: "20px" }}>
        <DialogContentText>
          Select the correct record to match this resident's Fullcount account
        </DialogContentText>
        <Typography variant="body1" className={typography}>
          K4Community Team Hub record
        </Typography>
        <List>
          <MatchItem id={resident._id} resident={resident} variant="outlined" />
        </List>
        <Typography variant="body1" className={typography}>
          Potential IDs
        </Typography>
        {resident.matches.map((match) => {
          const {
            vendorProperties,
            vendorId,
            vendorIdKey,
            matchedUserGuid,
          } = match;
          return (
            <MatchItem
              key={matchedUserGuid}
              id={vendorId}
              residentId={matchedUserGuid}
              vendorId={vendorId}
              vendorIdKey={vendorIdKey}
              resident={vendorProperties}
              elevation={3}
              variant="elevation"
              checked={Boolean(checkedValue)}
              setCheckedValue={setCheckedValue}
            />
          );
        })}
      </DialogContent>
      <DialogActions style={{ paddingTop: "40px", paddingRight: "2rem" }}>
        <Button disabled={loading} onClick={cancel} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!checkedValue || loading}
          onClick={submit}
          color="primary"
        >
          {loading ? <CircularProgress color="primary" size={20} /> : "Match"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
