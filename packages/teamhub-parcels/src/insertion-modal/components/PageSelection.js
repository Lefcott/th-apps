import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogContent,
  Divider,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { get } from "lodash";
import { generateIdFn } from "@shared/utils";
import { CardList } from "@shared/components";

const useTextButtonStyles = makeStyles((theme) => ({
  root: {
    textTransform: "none",
  },
}));

const useDialogContentStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[300],
  },
}));

export default function PageSelection({
  selectedPages,
  onPageSelect,
  onDesignSelect,
  currentDesign,
}) {
  const dialogContentClasses = useDialogContentStyles();
  const textButtonClasses = useTextButtonStyles();
  const genId = generateIdFn("PhotoSelection");
  const pages = get(currentDesign, "images", []);

  function onPageSelectionCancel() {
    onDesignSelect(null);
  }

  function getPageCounts() {
    return `${selectedPages.length} pages selected`;
  }

  function handlePageSelect(url, index) {
    return onPageSelect(url, index, currentDesign);
  }

  function isPageSelected(url, selections) {
    return selections.find((page) => page.url === url);
  }

  function getPageState() {
    return (
      <CardList
        multiselect
        name="Pages"
        selected={selectedPages}
        data={pages}
        idFn={isPageSelected}
        dataMapper={{
          id: (data, index) => data,
          image: (data) => data,
          title: (data, index) => `Page ${index + 1}`,
        }}
        onItemSelect={handlePageSelect}
      />
    );
  }

  return (
    <>
      <DialogContent>
        <Box mb={1} minHeight={56} display="flex" alignItems="center">
          <Box flex={1}>
            <Button
              color="secondary"
              variant="text"
              id={genId("back")}
              onClick={onPageSelectionCancel}
              startIcon={<ArrowBack />}
              classes={textButtonClasses}
            >
              Back to all Designs
            </Button>
          </Box>

          <Box>
            <Typography variant="h6">{currentDesign?.name}</Typography>
          </Box>

          <Box
            flex={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography>{getPageCounts()}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogContent classes={dialogContentClasses}>
        <Box height={425}>{getPageState()}</Box>
      </DialogContent>
      <Divider />
    </>
  );
}
