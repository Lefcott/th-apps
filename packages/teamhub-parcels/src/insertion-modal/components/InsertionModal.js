import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { findIndex } from "lodash";
import { generateIdFn } from "@shared/utils";
import DesignSelection from "./DesignSelection";
import PageSelection from "./PageSelection";

const useActionStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(16),
    marginLeft: theme.spacing(1),
  },
}));

const useDialogTitleStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 0,
  },
}));

export default function InsertionModal({ unmountSelf, parcelData }) {
  const genId = generateIdFn("PhotoModal");
  const { onSubmit, documentId } = parcelData;

  const [selectedPages, setSelectedPages] = useState([]);
  const [currentDesign, setCurrentDesign] = useState(null);

  const actionClasses = useActionStyles();
  const dialogTitleClasses = useDialogTitleStyles();

  function handleSubmit() {
    onSubmit(selectedPages);
    unmountSelf();
  }

  function onDesignSelect(design) {
    setCurrentDesign(design);
  }

  function onPageSelect(url, pageIndex, document) {
    const foundIndex = findIndex(
      selectedPages,
      (selectedPage) => selectedPage.url === url
    );
    if (foundIndex === -1) {
      const page = {
        url,
        data: {
          document: document._id,
          page: pageIndex,
        },
      };
      setSelectedPages((pages) => [...pages, page]);
    } else {
      const filtered = selectedPages.filter((_, index) => index !== foundIndex);
      setSelectedPages(() => [...filtered]);
    }
  }

  function getTitle() {
    return currentDesign ? "Choose Page" : "Choose Design";
  }

  function getTotalPages() {
    return `Add ${selectedPages.length} ${
      selectedPages.length === 1 ? "Page" : "Pages"
    }`;
  }

  return (
    <Dialog fullWidth maxWidth="md" open={true}>
      <DialogTitle classes={dialogTitleClasses}>{getTitle()}</DialogTitle>
      <Box display={currentDesign ? "block" : "none"}>
        <PageSelection
          onPageSelect={onPageSelect}
          onDesignSelect={onDesignSelect}
          currentDesign={currentDesign}
          selectedPages={selectedPages}
        />
      </Box>
      <Box display={currentDesign ? "none" : "block"}>
        <DesignSelection
          documentId={documentId}
          selectedPages={selectedPages}
          onDesignSelect={onDesignSelect}
        />
      </Box>
      <Divider />
      <DialogActions disableSpacing={true}>
        <Box mx={2} my={2} display="flex" justifyContent="flex-end">
          <Button
            id={genId("cancel")}
            classes={actionClasses}
            onClick={unmountSelf}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedPages.length}
            id={genId("submit")}
            classes={actionClasses}
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
          >
            {getTotalPages()}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
