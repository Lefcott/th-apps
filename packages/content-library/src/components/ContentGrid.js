import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { isEqual, isEmpty, uniqBy } from 'lodash';
import { getCommunityId } from '@teamhub/api';
import ErrorImg from '../utils/images/Error.svg';
import { MenuItem, TextField } from '@material-ui/core';
import { sortOptions } from '../utils/componentData';
import { GridLoader } from '../utils/loaders';
import ContentCard from './ContentCard';
import KeywordFilter from './KeywordFilter';
import ViewFilter from './ViewFilter';
import NoResults from './NoResults';
import { useQuery } from '@teamhub/apollo-config';
import { GET_CONTENTS, CONTENT_CREATED } from '../graphql/content';

const GridContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FilterContainer = styled.div`
  margin: 0px 10px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 960px) {
    flex-flow: column;
    margin: 0 0 25px;
  }
`;

const SortField = styled(TextField)`
  && {
    min-width: 200px;
    margin-left: 25px;

    @media (max-width: 960px) {
      margin: 0 0 25px 0;
      width: 100%;
    }
  }
`;

const ErrorImage = styled.img`
  display: flex;
  margin: 25px auto;
`;

function ContentGrid(props) {
  const setPageVariables = () => {
    switch (sort) {
      case 'dateDesc':
        return { order: 'Desc', field: 'Edited' };
      case 'dateAsc':
        return { order: 'Asc', field: 'Edited' };
      case 'nameDesc':
        return { order: 'Desc', field: 'Name' };
      case 'nameAsc':
        return { order: 'Asc', field: 'Name' };
    }
  };

  const { section, viewFilter, setViewFilter, ownerId, scrolledBottom } = props;
  const onlyMine = isEqual(viewFilter, 'myContent');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('dateDesc');
  const {
    loading,
    data,
    error,
    refetch: refetchContent,
    subscribeToMore,
    fetchMore,
  } = useQuery(GET_CONTENTS, {
    variables: {
      communityId: getCommunityId(),
      page: {
        limit: 100,
        ...setPageVariables(),
      },
      filters: {
        onlyMine,
        search: isEmpty(keyword.trim()) ? undefined : keyword.trim(),
        docType: section.name,
      },
    },
  });

  useEffect(() => {
    if (scrolledBottom && data) {
      const {
        community: { contents },
      } = data;
      const offset = contents.length + 1;
      fetchMore({
        variables: {
          communityId: getCommunityId(),
          page: {
            limit: 100,
            ...setPageVariables(),
            offset: offset,
          },
          filters: {
            onlyMine,
            search: isEmpty(keyword.trim()) ? undefined : keyword.trim(),
            docType: section.name,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const {
            community: { contents },
          } = fetchMoreResult;

          return Object.assign({}, prev, {
            community: {
              __typename: 'Community',
              contents: uniqBy(
                [...prev.community.contents, ...contents],
                '_id'
              ),
            },
          });
        },
      });
    }
  }, [scrolledBottom]);

  React.useEffect(() => {
    subscribeToMore({
      document: CONTENT_CREATED,
      variables: {
        communityId: getCommunityId(),
        docType: [section.name],
        owner: ownerId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          data: { contentCreated },
        } = subscriptionData;

        return Object.assign({}, prev, {
          community: {
            __typename: 'Community',
            contents: [contentCreated, ...prev.community.contents],
          },
        });
      },
    });
  }, []);

  const sortOnChange = ({ target }) => setSort(target.value);

  if (error) return <ErrorImage src={ErrorImg} />;

  return (
    <>
      <FilterContainer>
        <div>
          <ViewFilter value={viewFilter} onChange={setViewFilter} />
          <SortField
            id="CL_grid-sort"
            select
            label="Sort"
            value={sort}
            onChange={sortOnChange}
            InputLabelProps={{ shrink: true }}
          >
            {sortOptions.map((opt) => (
              <MenuItem
                key={opt.name}
                id={`CL_sort-${opt.value}`}
                value={opt.value}
              >
                {opt.name}
              </MenuItem>
            ))}
          </SortField>
        </div>
        <KeywordFilter keyword={keyword} setKeyword={setKeyword} />
      </FilterContainer>

      {!data || loading ? (
        <GridLoader id="CL_contentGrid-loader" />
      ) : isEmpty(data.community.contents) ? (
        <NoResults
          id="CL_contentGrid-noResults"
          viewFilter={viewFilter}
          search={keyword}
        />
      ) : (
        <GridContainer id="CL_contentGrid-content">
          {data.community.contents.map((content) => (
            <ContentCard
              key={content._id}
              data={content}
              refetch={refetchContent}
            />
          ))}
        </GridContainer>
      )}
    </>
  );
}

export default ContentGrid;
