/** @format */

import React from "react";
import { Box } from "@material-ui/core";
import BaseSearchBar from "../BaseSearchBar";
import { ReactActionAreaPortal } from "@teamhub/api";
import { useIsMobile } from "./utils";

export default function BaseToolbar({
  searchable,
  searchOptions = {},
  setGlobalFilterValue,
  toolbarOptions,
  idGenerator,
}) {
  const [isMobile, theme] = useIsMobile();
  const fabBoxProps = isMobile
    ? {
        position: "fixed",
        flexDirection: "column",
        bottom: theme.spacing(3),
        right: theme.spacing(2),
        zIndex: 10,
      }
    : {};

  function renderToolbarActions(actions = []) {
    return actions.map(({ render, key }) => (
      <Box key={key}>{render({ id: idGenerator.getId(`actions-${key}`) })}</Box>
    ));
  }

  return (
    <Box
      pb={2.5}
      display={isMobile ? "block" : "flex"}
      alignItems="center"
      flexDirection={searchable ? "row" : "row-reverse"}
    >
      {searchable && (
        <Box
          mr={2}
          display={"block"}
          alignItems="center"
          flexGrow={1}
          fullwidth="true"
        >
          <BaseSearchBar
            id={idGenerator.getId("searchbar")}
            onChange={setGlobalFilterValue}
            placeholder={searchOptions.placeholder}
          />
        </Box>
      )}
      <Box
        ml={2}
        mt={isMobile ? 1 : 0}
        display="flex"
        alignItems="center"
        overflow="auto"
      >
        <ReactActionAreaPortal>
          {renderToolbarActions(
            toolbarOptions.actions.filter((action) => action.renderPortal)
          )}
        </ReactActionAreaPortal>
        {renderToolbarActions(
          toolbarOptions.actions.filter((action) => !action.renderPortal)
        )}
      </Box>
    </Box>
  );
}
