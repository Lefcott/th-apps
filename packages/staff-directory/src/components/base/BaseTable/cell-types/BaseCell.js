/** @format */

import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Highlighter from 'react-highlight-words';

const useBaseCellStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
}));

export default function BaseCell({ children }) {
  const classes = useBaseCellStyles();

  return (
    <Typography classes={classes} component="div">
      {children}
    </Typography>
  );
}

const useBoxStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
}));

const useTypographyStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.grey[800],
    whiteSpace: 'nowrap',
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
  },
  body1: {
    flexDirection: ({ reverse }) => (reverse ? 'row-reverse' : 'row'),
    fontWeight: 'normal',
    fontSize: theme.spacing(1.75),
  },
}));

const useTooltipStyles = makeStyles((theme) => ({
  popper: {
    top: `${theme.spacing(1.5)}px !important`,
    left: `${-theme.spacing(1)}px !important`,
  },
  tooltip: {
    fontSize: theme.spacing(1.75),
    maxWidth: '90vw !important',
  },
}));

const DEFAULT_CALCULATION_DELAY_MS = 500;
export function BaseCellValue({ children, reverse, searchWords = '' }) {
  const [initialContentWidth, setInitialContentWidth] = useState(0);
  const [isOverflow, setIsOverflow] = useState(false);

  const boxClasses = useBoxStyles();
  const tooltipClasses = useTooltipStyles();
  const typographyClasses = useTypographyStyles({ isOverflow, reverse });

  const containerRef = useRef();
  const contentRef = useRef();

  const defaultHighlightStyles = {
    background: '#ffe4d1',
  };

  useEffect(() => {
    const contentWidth = contentRef?.current?.clientWidth;

    if (contentWidth && !initialContentWidth) {
      setTimeout(() => {
        setInitialContentWidth(contentWidth);
      }, DEFAULT_CALCULATION_DELAY_MS);
    }
  }, [contentRef, initialContentWidth]);

  useEffect(() => {
    const containerWidth = containerRef?.current?.clientWidth;

    const id = setTimeout(() => {
      setIsOverflow(containerWidth <= initialContentWidth);
    }, DEFAULT_CALCULATION_DELAY_MS);

    return () => clearTimeout(id);
  }, [containerRef, initialContentWidth]);

  return (
    <Box ref={containerRef} classes={boxClasses}>
      <Tooltip
        interactive
        title={children || ''}
        placement="top-start"
        classes={tooltipClasses}
        disableTouchListener={!isOverflow}
        disableFocusListener={!isOverflow}
        disableHoverListener={!isOverflow}
      >
        <Typography
          component="span"
          ref={contentRef}
          classes={typographyClasses}
          noWrap={true}
        >
          <Highlighter
            autoEscape={true}
            highlightStyle={defaultHighlightStyles}
            searchWords={[searchWords]}
            textToHighlight={children || ''}
          ></Highlighter>
        </Typography>
      </Tooltip>
    </Box>
  );
}
