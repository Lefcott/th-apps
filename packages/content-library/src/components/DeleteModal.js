import React from 'react';
import {
  Dialog,
  DialogTitle,
  MenuItem,
  Typography,
  DialogActions,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  Box,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { GET_POSTS_BY_CONTENT_ID } from '../graphql/feed';
import { DELETE_CONTENT, GET_CONTENTS } from '../graphql/content';
import { DateTime } from 'luxon';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { get as _get } from 'lodash';
import { showToast } from '@teamhub/toast';
import { getCommunityId } from '@teamhub/api';

const formattedAudiences = {
  Resident: { name: 'Resident App', abbrev: 'Res App', value: 'Resident' },
  Family: { name: 'Friends & Family App', abbrev: 'F&F App', value: 'Family' },
  ResidentVoice: {
    name: 'Resident Voice',
    abbrev: 'Res Voice',
    value: 'ResidentVoice',
  },
  Signage: {
    name: 'Signage',
    abbrev: 'Signage',
    value: 'Signage',
  },
};

const sortedAudiences = ['Resident', 'Family', 'ResidentVoice', 'Signage'];

const sortAudiences = (audiences) => {
  const copy = [...audiences];
  copy.sort((a, b) => sortedAudiences.indexOf(a) - sortedAudiences.indexOf(b));
  return copy;
};

const getAbbrevs = (audiences) =>
  sortAudiences(audiences).map((aud) => formattedAudiences[aud].abbrev);

const NoWrapCell = withStyles((theme) => ({
  root: {
    whiteSpace: 'nowrap',
    width: 'calc(100% - 26px)',
    color: 'rgba(0,0,0, 0.6)',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    padding: '10px',
    paddingLeft: '16px',
    borderBottom: 'none',
  },
}))(TableCell);

export default function DeleteModal(props) {
  const { contentId, docType, refetch, closeDropdown } = props;
  const communityId = getCommunityId();
  const [open, setOpen] = React.useState(false);
  const { data, loading, error } = useQuery(GET_POSTS_BY_CONTENT_ID, {
    variables: { communityId, contentIds: [contentId] },
    skip: !contentId,
  });

  const [deleteContent] = useMutation(DELETE_CONTENT, {
    update(cache, { data }) {
      const contentId = data.community.content.delete._id;
      cache.modify({
        fields: {
          community(community, { readField }) {
            const copy = {
              ...community,
            };
            for (const key in copy) {
              if (key.match(/contents(.*)/)) {
                copy[key] = copy[key].filter((n) => {
                  return readField('_id', n) !== contentId;
                });
              }
            }

            return copy;
          },
        },
      });
    },
  });
  const posts = _get(data, 'community.feedItemsByContentId', []);
  const convertTypeToDisplay = (contentType) => {
    switch (contentType) {
      case 'design':
        return 'Design';
      case 'document':
        return 'PDF';
      case 'photo':
        return 'Photo';
      default:
        return 'content';
    }
  };

  const submitDelete = async () => {
    try {
      await deleteContent({
        variables: { communityId, contentId },
      });

      showToast('Your content was successfully deleted');
    } catch (err) {
      console.warn(err);
    }
    setOpen(false);
    closeDropdown();
  };

  return (
    <>
      <MenuItem
        key="delete"
        className={`CL_card-menuList-listItem CL_card-menuList-delete`}
        data-testid="CL_card-menuList-delete"
        onClick={() => setOpen(true)}
      >
        Delete
      </MenuItem>
      {!loading && (
        <Dialog
          onClose={() => setOpen(false)}
          open={open}
          maxWidth={posts.length > 0 ? 'sm' : 'xs'}
          data-testid="CL-delete-modal"
        >
          <DialogTitle
            data-testid="CL-delete-modal-title"
            style={{ paddingBottom: 0 }}
          >
            {`Delete ${convertTypeToDisplay(docType)} from library${
              posts.length > 0 ? ' and posts?' : '?'
            }`}
          </DialogTitle>
          <DialogContent>
            {posts.length === 0 ? (
              <Typography style={{ color: 'rgba(0,0,0, 0.6)' }} variant="body1">
                Deleting permanently removes this{' '}
                {convertTypeToDisplay(docType)} from the Content Library
              </Typography>
            ) : (
              <>
                <Typography
                  style={{ color: 'rgba(0,0,0, 0.6)', paddingBottom: '20px' }}
                  variant="body1"
                >
                  Deleting permanently removes this{' '}
                  {convertTypeToDisplay(docType)} from the K4Community App and
                  Content Library. There{' '}
                  {posts.length < 1
                    ? `is one post`
                    : `are ${posts.length} posts`}{' '}
                  that contain this content.
                </Typography>
                <TableContainer
                  component={Box}
                  style={{
                    width: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: '240px',
                  }}
                >
                  <Table style={{ maxWidth: '100%', tableLayout: 'fixed' }}>
                    <TableHead
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                    >
                      <TableRow>
                        <TableCell
                          style={{ width: '50%', color: 'rgba(0,0,0, 0.6)' }}
                        >
                          <strong>Title</strong>
                        </TableCell>
                        <TableCell
                          style={{ width: '20%', color: 'rgba(0,0,0, 0.6)' }}
                        >
                          <strong>Post Date</strong>
                        </TableCell>
                        <TableCell
                          style={{ width: '30%', color: 'rgba(0,0,0, 0.6)' }}
                        >
                          <strong>Audience</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody data-testid="CL-delete-modal-table-body">
                      {posts.map((post) => (
                        <TableRow key={post._id}>
                          <NoWrapCell>{post.title}</NoWrapCell>
                          <NoWrapCell>
                            {DateTime.fromISO(post.startDate).toFormat(
                              'MMM dd, yyyy'
                            )}
                          </NoWrapCell>
                          <NoWrapCell>
                            {getAbbrevs(post.audiences || []).join(', ')}
                          </NoWrapCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              data-testid="CL-delete-modal-cancel"
              id="CL-delete-modal-cancel"
              onClick={() => {
                closeDropdown();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={submitDelete}
              data-testid="CL-delete-modal-submit"
              id="CL-delete-modal-submit"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
