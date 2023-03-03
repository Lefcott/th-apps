import React from "react";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Close, Help } from "@material-ui/icons";
import { generateIdFn } from '@shared/utils';

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

const useDialogTitleStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const useDialogContentStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.spacing(2),
  },
}));

const useHelpIconStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.spacing(6),
  },
}));

const useTooltipStyles = makeStyles((theme) => ({
  popper: {
    fontSize: theme.spacing(2),
  },
}));

const useIconButtonStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(-1),
    right: theme.spacing(-2),
    color: theme.palette.common.white,
  },
}));

const useDialogActionsStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
}));

const useButtonStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
}));

export default function ({ unmountSelf, parcelData }) {
  const genId = generateIdFn("NavigateAwayModal")
  const dialogClasses = useDialogStyles();
  const dialogTitleClasses = useDialogTitleStyles();
  const dialogContentClasses = useDialogContentStyles();
  const helpIconClasses = useHelpIconStyles();
  const tooltipClasses = useTooltipStyles();
  const iconButtonClasses = useIconButtonStyles();
  const dialogActionsClasses = useDialogActionsStyles();
  const buttonClasses = useButtonStyles();

  const { onSaveAndExit, onExit, onCancel } = parcelData;

  function unmountBefore(next) {
    return () => {
      next();
      unmountSelf();
    };
  }

  return (
    <Dialog classes={dialogClasses} open={true}>
      <DialogTitle classes={dialogTitleClasses}>
        Back to Team Hub
        <Tooltip
          classes={tooltipClasses}
          title="Close dialog"
          placement="right"
        >
          <IconButton
            id={genId('close-modal')}
            aria-label="close-modal"
            classes={iconButtonClasses}
            onClick={unmountBefore(onCancel)}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent classes={dialogContentClasses}>
        <Box display="flex">
          <Box>
            <Help color="disabled" classes={helpIconClasses} />
          </Box>
          <Box ml={1} display="flex" flex={1} alignItems="center">
            Do you want to save your work before returning to the Team Hub?
          </Box>
        </Box>
      </DialogContent>
      <DialogActions classes={dialogActionsClasses}>
        <Button id={genId('save-and-exit')} onClick={unmountBefore(onSaveAndExit)} classes={buttonClasses}>
          Save & Exit
        </Button>
        <Button id={genId('exit-without-saving')} onClick={unmountBefore(onExit)} classes={buttonClasses}>
          Exit without Saving
        </Button>
      </DialogActions>
    </Dialog>
  );
}
