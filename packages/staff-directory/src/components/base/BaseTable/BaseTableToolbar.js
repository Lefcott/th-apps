/** @format */

import React from 'react';
import { Box } from '@material-ui/core';
import BaseSearchBar from '../BaseSearchBar';
import { ReactActionAreaPortal } from '@teamhub/api';
import { useIsMobile } from './utils';

export default function BaseToolbar({
  searchable,
  searchOptions = {},
  setGlobalFilterValue,
  globalFilterValue,
  toolbarOptions,
  idGenerator,
}) {
  const [isMobile, theme] = useIsMobile();
  const fabBoxProps = isMobile
    ? {
        position: 'fixed',
        flexDirection: 'column',
        bottom: theme.spacing(3),
        right: theme.spacing(2),
        zIndex: 10,
      }
    : {};

  function renderToolbarActions() {
    if (!toolbarOptions.actions) return;

    return toolbarOptions.actions.map(({ render, key }) => (
      <Box key={key}>{render({ id: idGenerator.getId(`actions-${key}`) })}</Box>
    ));
  }

  return (
    <Box
      pb={2.5}
      display="flex"
      alignItems="center"
      flexDirection={searchable ? 'row' : 'row-reverse'}
    >
      {searchable && (
        <BaseSearchBar
          id={idGenerator.getId('searchbar')}
          onChange={setGlobalFilterValue}
          initialValue={globalFilterValue}
          placeholder={searchOptions.placeholder}
        />
      )}
      {toolbarOptions.renderPortal && !isMobile ? (
        <ReactActionAreaPortal>{renderToolbarActions()}</ReactActionAreaPortal>
      ) : (
        <Box pl={8} display="flex" {...fabBoxProps}>
          {renderToolbarActions()}
        </Box>
      )}
    </Box>
  );
}
