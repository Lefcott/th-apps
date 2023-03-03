/** @format */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Button, Fab, Box } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { get, identity, pickBy, isNumber } from 'lodash';
import FeedToolbar from './FeedToolbar';
import FeedTable from './FeedTable';
import { useQuery, useMutation } from '@teamhub/apollo-config';
import { GET_FEED, END_POST } from '../graphql/feed';
import FeedErrorBoundary from './FeedErrorBoundary';
import { getOneSearchParam } from '../utils/url';
import { ReactActionAreaPortal } from '@teamhub/api';

const ResponsiveContainer = withStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      padding: '0px',
    },
  },
}))(Container);

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    borderRadius: '4px',
    width: 'auto',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function FeedContainer(props) {
  const { isMobile } = props;
  const location = useLocation();
  const [filters, setFilters] = React.useReducer(
    (oldState, newState) => ({ ...oldState, ...newState }),
    {
      search: '',
      audiences: ['ResidentVoice', 'Resident', 'Family'],
      status: 'Active',
      anchoredAt: new Date(Date.now()).toISOString(),
    }
  );

  const communityId = getOneSearchParam('communityId', '2476');
  const [endPost] = useMutation(END_POST);
  const { data, loading, fetchMore } = useQuery(GET_FEED, {
    variables: {
      communityId,
      page: {
        limit: 10,
        page: 0,
        sort: {
          field: 'startDate',
          order: filters.status === 'Scheduled' ? 'Asc' : 'Desc',
        },
      },
      filters: pickBy({ ...filters }, identity),
    },
    skip: !communityId,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const { posts, pageInfo } = get(data, 'community.feed', {
    posts: [],
    pageInfo: {},
  });

  useEffect(() => {
    if (isNumber(pageInfo.currentPage)) {
      handleRefetch(pageInfo.currentPage);
    }
  }, [location.pathname]);

  const classes = useStyles();

  async function handleRefetch(page) {
    try {
      const variables = {
        communityId,
        page: { limit: 10, page },
        filters: pickBy(filters, identity),
      };
      await fetchMore({
        variables,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleEndPost(id) {
    await endPost({ variables: { communityId, postId: id } });
    // refetch this page
    handleRefetch(pageInfo.currentPage);
  }
  return (
    <ResponsiveContainer data-testid="AP_feed-container">
      <FeedErrorBoundary data-testid="AP_error-boundary">
        {!isMobile && (
          <ReactActionAreaPortal>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to={{
                pathname: '/feed/post',
                search: `?communityId=${communityId}`,
              }}
              id="AP_newPost"
            >
              New Post
            </Button>
          </ReactActionAreaPortal>
        )}
        <Box mb={isMobile ? 11 : 0} mt={3}>
          <FeedToolbar
            filters={filters}
            setFilters={setFilters}
            isMobile={isMobile}
            loading={loading}
          />
          <div style={props.isMobile ? { overflowX: 'auto' } : {}}>
            <FeedTable
              timezone={props.timezone}
              posts={posts}
              handleEndPost={handleEndPost}
              lastPage={pageInfo.lastPage}
              total={pageInfo.total}
              loading={loading}
              page={pageInfo.currentPage}
              onChangePage={handleRefetch}
              statusFilter={filters.status}
              search={filters.search}
            />
          </div>
        </Box>
        <Fab
          className={classes.fab}
          color="primary"
          variant="circular"
          component={Link}
          to={{
            pathname: '/feed/post',
            search: `?communityId=${communityId}`,
          }}
        >
          New Post
        </Fab>
      </FeedErrorBoundary>
    </ResponsiveContainer>
  );
}
