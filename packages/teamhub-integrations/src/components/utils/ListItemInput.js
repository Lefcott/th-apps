import React from "react";
import { Box, Button, TextField, CircularProgress } from "@material-ui/core";
import { Check as CheckIcon, Close as CloseIcon } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PosMatchModal from "../PosMatchModal";
import { getCommunityId } from "@teamhub/api";
import { trim } from "lodash";
import { useMutation } from "@teamhub/apollo-config";
import { LINK_RES_TO_POS, UNLINK_RESIDENT } from "../../graphql/residents";
import { showToast } from "@teamhub/toast";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
}));

const CustomIconButton = withStyles({
  root: {
    marginRight: "8px",
    padding: "6px",
    minWidth: 0,
  },
})(Button);

export default function ListItemInput({
  resident,
  integrationName,
  index,
  ...props
}) {
  const [error, setError] = React.useState(null);
  const [inputActive, setInputActive] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const classes = useStyles();
  const inputRef = React.useRef();
  const formRef = React.useRef();
  React.useEffect(() => {
    if (resident.posIdentifier) {
      setInput(resident.posIdentifier);
    }
  }, [resident.posIdentifier]);

  const [linkResToPoS, { loading: linkLoading }] = useMutation(
    LINK_RES_TO_POS,
    {
      onError: setError,
      onCompleted() {
        showToast(
          `${resident.firstName} ${resident.lastName} has been successfully matched`
        );
      },
    }
  );
  const [unlinkRes, { loading: unlinkLoading }] = useMutation(UNLINK_RESIDENT, {
    onCompleted() {
      showToast(
        `${resident.firstName} ${resident.lastName} has been successfully unmatched`
      );
    },
  });

  function goToNext() {
    document
      .querySelector(`.TI_listItemInputButton_${index + 1}_unmatched`)
      ?.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    inputRef.current?.blur();
  }

  async function onBlur(e) {
    // ignore submission if input is not active or that user clicked on cancel
    if (
      linkLoading ||
      unlinkLoading ||
      !inputActive ||
      e.relatedTarget?.type === "button"
    ) {
      setInput(resident.posIdentifier || "");
      return handleClose();
    }

    const trimmedInput = trim(input);
    if (!trimmedInput && resident.posIdentifier) {
      goToNext();
      await unlinkRes({
        variables: {
          communityId: getCommunityId(),
          residentId: resident._id,
          vendorIdKey: `${integrationName}Id`,
        },
      });
    } else if (trimmedInput) {
      goToNext();
      await linkResToPoS({
        variables: {
          communityId: getCommunityId(),
          residentId: resident._id,
          vendorId: trimmedInput,
          vendorIdKey: `${integrationName}Id`,
        },
      });
    }
    handleClose();
  }

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  function handleClose(e) {
    if (!input) {
      setError(null);
    }
    setInputActive(false);
  }

  function handleCancel(e) {
    setInput(resident.posIdentifier || "");
    handleClose(e);
  }

  function handleOpen() {
    setInputActive(true);
  }

  React.useEffect(() => {
    if (inputActive && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputActive]);

  function getDisplayText() {
    if (error) {
      return { text: "Invalid ID", color: "secondary" };
    }

    if (resident.posIdentifier) {
      return { text: String(resident.posIdentifier), color: "inherit" };
    }

    return { text: "Enter ID", color: "secondary" };
  }

  const { text, color } = getDisplayText();
  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className={classes.container}
        style={{ display: inputActive ? "flex" : "none" }}
      >
        <TextField
          onBlur={onBlur}
          inputRef={inputRef}
          autoFocus
          inputProps={{ style: { fontSize: "14px" } }}
          style={{ marginRight: "8px" }}
          value={input}
          error={!!error}
          helperText={error && "Please enter a valid ID"}
          onChange={(e) => setInput(e.target.value)}
        />
        <Box display="flex" mb={error ? 2.5 : 0}>
          {linkLoading || unlinkLoading ? (
            <Box mr={1.5} display="flex" alignItems="center">
              <CircularProgress color="primary" size={20} />
            </Box>
          ) : (
            <CustomIconButton variant="contained" color="primary" type="submit">
              <CheckIcon fontSize="small" style={{ fontSize: "12px" }} />
            </CustomIconButton>
          )}

          <CustomIconButton variant="contained" onClick={handleCancel}>
            <CloseIcon style={{ fontSize: "12px" }} onClick={handleCancel} />
          </CustomIconButton>
        </Box>
      </form>
      <div
        style={{ display: inputActive ? "none" : "flex", alignItems: "center" }}
      >
        <Button
          variant="text"
          color={color}
          className={`TI_listItemInputButton_${index}_${
            resident.posIdentifier ? "matched" : "unmatched"
          }`}
          size="small"
          id={`TI_posUserListItem-addId`}
          style={{
            paddingLeft: "0",
            fontSize: "14px",
            justifyContent: resident.posIdentifier ? "flex-start" : "center",
            marginRight: "24px",
            textTransform: "none",
            fontWeight: 400,
          }}
          onClick={handleOpen}
          onFocus={handleOpen}
        >
          {text}
        </Button>

        {resident?.matches?.length > 0 && (
          <>
            <Button
              size="small"
              variant="text"
              color="primary"
              onClick={handleModalOpen}
            >
              {resident.matches.length} Potential Id
              {resident.matches.length > 1 ? "s" : ""}
            </Button>
            <PosMatchModal
              resident={resident}
              open={modalOpen}
              close={handleModalClose}
            />
          </>
        )}
      </div>
    </>
  );
}
