/** @format */

import React from 'react';
import { getAbbrevs } from '../utils/audiences';
import {
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Divider,
  MenuItem,
  Menu,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableLoader from './TableLoader';
import styled from '@emotion/styled';
import Highlighter from 'react-highlight-words';
import blankState from '../utils/images/no-posts-blank.svg';

import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import {} from 'date-fns';

import { escapeRegExp } from 'lodash';
import { getCommunityId } from '@teamhub/api';
import { MoreVert } from '@material-ui/icons';

const TagChip = styled(Chip)`
  && {
    background-color: rgba(76, 67, 219, 0.08);
    color: #4c43db;
    margin: 0px 4px;
    padding-left: 0;
    border: none;
  }
`;

const useStyles = makeStyles({
  tooltip: {
    fontSize: '14px',
  },
  cellNoPadding: {
    padding: '10px',
  },
  rowWithLeftPadding: {
    '&:first-child': {
      paddingLeft: '36px',
    },
  },
  redColor: {
    color: 'red',
  },
});

const LargeFontToolTip = withStyles(() => ({
  tooltip: {
    fontSize: '14px',
  },
}))(Tooltip);

const NoWrapCell = withStyles((theme) => ({
  root: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    padding: '10px',
    [theme.breakpoints.down('sm')]: {
      // this is mainly to handle cases where pages don't have any endDates
      minWidth: '126px',
    },
  },
}))(TableCell);

export default function FeedTableBody({
  posts,
  loading,
  handleEndPost,
  statusFilter,
  classes,
  search,
  ...props
}) {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={12}>
          <TableLoader />
        </TableCell>
      </TableRow>
    );
  }

  if (posts.length > 0 && !loading) {
    return posts.map((post) => (
      <TableRow key={post._id} className="AP_feedItem">
        <LargeFontToolTip placement="top-start" title={post.title}>
          <NoWrapCell
            style={{ paddingLeft: '36px', width: 'calc(100% - 26px)' }}
            className="AP_feedItem-title"
          >
            <Highlighter
              highlightClassName="search-highlighter-class"
              searchWords={[escapeRegExp(search)]}
              textToHighlight={post.title}
            />
          </NoWrapCell>
        </LargeFontToolTip>
        <NoWrapCell className="AP_feedItem-start">
          {post.startDate
            ? formatInTimeZone(post.startDate, props.timezone, 'MMM dd, yyyy')
            : ''}
        </NoWrapCell>
        <NoWrapCell
          style={{ color: 'rgba(0,0,0, 0.38)' }}
          className="AP_feedItem-end"
        >
          {post.endDate
            ? formatInTimeZone(
                new Date(post.endDate),
                props.timezone,
                'MMM dd, yyyy'
              )
            : ''}
        </NoWrapCell>
        <NoWrapCell className="AP_feedItem-audience">
          {getAbbrevs(post.audiences).join(', ')}
        </NoWrapCell>
        <NoWrapCell className="AP_feedItem-category">
          {post.category}
        </NoWrapCell>
        <ChipsCell tags={post.tags} className="AP_feedItem-tags" />
        <TableCell className={classes.cellNoPadding}>
          <ItemOptions
            postId={post._id}
            handleEndPost={handleEndPost}
            statusFilter={statusFilter}
          />
        </TableCell>
      </TableRow>
    ));
  } else if (posts.length === 0 && search.length > 0) {
    return (
      <TableRow data-testid="AP_feedItem-noResults" id="AP_feedItem-noResults">
        <TableCell
          style={{
            padding: '12px',
          }}
          colSpan={12}
        >{`No matches for "${search}"`}</TableCell>
      </TableRow>
    );
  } else if (posts.length === 0 && !search) {
    return (
      <TableRow id="AP_feedItem-noPosts" data-testid="AP_feedItem-noPosts">
        <TableCell colSpan={12}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '45px 0px',
            }}
          >
            <Typography variant="h6">
              <strong>{`There are no ${statusFilter.toLowerCase()} posts`}</strong>
            </Typography>
            <img
              src={blankState}
              style={{
                objectFit: 'contain',
                height: '195px',
                width: '215',
              }}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  }
}

function ChipsCell(props) {
  const { tags = [] } = props;
  const [cellWidth, setCellWidth] = React.useState(0);
  const measuredRef = React.useCallback((node) => {
    if (node !== null) {
      setCellWidth(node.clientWidth);
    }
  }, []);

  return (
    <TableCell
      style={{ overflowX: 'hidden', whiteSpace: 'nowrap', padding: '10px' }}
      ref={measuredRef}
    >
      {cellWidth ? <TagsDisplayArea tags={tags} cellWidth={cellWidth} /> : null}
    </TableCell>
  );
}

function TagsDisplayArea(props) {
  const classes = useStyles();
  const { cellWidth, tags } = props;
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  const measuredRef = React.useCallback((node) => {
    if (node !== null) {
      setMeasuredWidth(node.getBoundingClientRect().width);
    }
  }, []);
  const tagsCopy = [...tags];
  let chips = tagsCopy
    .sort((a, b) => a.length - b.length)
    .slice(0, 2)
    .map((tag) => (
      <TagChip
        key={tag}
        label={tag}
        size="small"
        style={{ maxWidth: '100%' }}
      />
    ));

  if (chips.length > 1 && cellWidth - measuredWidth < 0) {
    chips.pop();
  }

  return (
    <div
      ref={measuredRef}
      style={{
        display: 'inline-block',
        maxWidth: chips.length === 1 ? '100%' : null,
      }}
    >
      {chips}
      {tagsCopy.length > chips.length && (
        <LargeFontToolTip
          className={classes.tooltip}
          // we use tagsCopy because it's been sorted!
          title={tagsCopy.slice(chips.length).join(', ')}
          placement="top-start"
        >
          <Typography variant="caption" color="primary">
            +{tags.length - chips.length} more
          </Typography>
        </LargeFontToolTip>
      )}
    </div>
  );
}

function ItemOptions(props) {
  const { postId, handleEndPost, statusFilter } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const communityId = getCommunityId();
  const handleCloseMenu = () => setAnchorEl(null);

  const openEndPostModal = () => {
    setOpen(true);
    handleCloseMenu();
  };
  const closeEndPostModal = () => setOpen(false);

  const confirmEndPost = () => {
    handleEndPost(postId);
    closeEndPostModal();
  };

  const menuChildren = [
    <MenuItem
      key="edit"
      onClick={handleCloseMenu}
      component={Link}
      to={{
        pathname: `/feed/post/${postId}`,
        search: `?communityId=${communityId}`,
      }}
      className="AP_feedItem-edit"
      id="AP_feedItem-viewEditPost"
    >
      View and Edit
    </MenuItem>,
    <Divider key="divider" />,
    <MenuItem
      key="end"
      style={{ color: 'red' }}
      onClick={openEndPostModal}
      id="AP_feedItem-endPost" //what's using this? It shouldn't be an ID
      className="AP_feedItem-endPost"
    >
      End Post
    </MenuItem>,
  ];

  return (
    <>
      <IconButton
        onClick={handleClick}
        className="AP_feedItem-more"
        data-testid="AP_feedItem-more"
      >
        <MoreVert fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {statusFilter.toLowerCase() === 'active'
          ? menuChildren.map((child) => child)
          : menuChildren.slice(0, 1).map((child) => child)}
      </Menu>
      <Dialog
        open={open}
        onClose={closeEndPostModal}
        disableBackdropClick
        maxWidth="xs"
      >
        <DialogTitle>End Post?</DialogTitle>
        <DialogContent style={{ maxWidth: '340px' }}>
          <DialogContentText>
            Ending the post will remove it from the K4Community Application.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeEndPostModal}
            className="AP_endPost-endPostCancelBtn"
          >
            CANCEL
          </Button>
          <Button
            onClick={confirmEndPost}
            className={`AP_endPost-endPostBtn ${classes.redColor}`}
          >
            END POST
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
