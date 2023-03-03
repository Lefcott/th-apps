/** @format */

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import {
  Box,
  Paper,
  Button,
  Divider,
  Typography,
  ClickAwayListener,
  CircularProgress,
} from '@material-ui/core';
import { getOneSearchParam } from '../utils/url';
import { useLazyQuery } from '@teamhub/apollo-config';
import { GET_CONTENTS } from '../graphql/content';
import ErrorImg from '../utils/images/Error.svg';
import SearchFilter from './SearchFilter';
import ContentPreview from './ContentPreview';

const PopperContainer = styled.div`
  margin-top: 5px;
  padding: 10px;
  width: 504px;
  @media (max-width: 960px) {
    width: auto;
  }
`;

const ErrorImage = styled.img`
  display: flex;
  margin: 25px auto;
`;

const LoadWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 25px 0;
`;

const NoDataWrapper = styled.div`
  font-style: italic;
  margin-top: 10px;
  text-align: center;
`;

const GridContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  height: 300px;
  overflow: auto;
  margin-top: 10px;
`;

function ContentPicker(props) {
  const { setDesignPickerOpen, onClick } = props;
  const [keyword, setKeyword] = useState('');
  const [getDesigns, { data, loading, error }] = useLazyQuery(GET_CONTENTS);

  function getSearchQuery(keyword) {
    const query = keyword.trim();
    if (isEmpty(query)) return null;

    return query;
  }

  useEffect(() => {
    getDesigns({
      variables: {
        communityId: getOneSearchParam('communityId', '2476'),
        page: {
          limit: 27,
          field: 'Edited',
          order: 'Desc',
        },
        filters: {
          search: getSearchQuery(keyword),
          docType: 'design',
        },
      },
    });
  }, [keyword]);

  const displayState = () => {
    if (error) return <ErrorImage role="errorimage" src={ErrorImg} />;
    if (!data || loading)
      return (
        <LoadWrapper>
          <CircularProgress />
        </LoadWrapper>
      );
    if (data && isEmpty(data.community.contents))
      return <NoDataWrapper>No results found</NoDataWrapper>;

    return (
      <GridContainer>
        {data.community.contents.map((content) => (
          <ContentPreview key={content._id} data={content} onClick={onClick} />
        ))}
      </GridContainer>
    );
  };

  return (
    <Paper test-dataid="AP_postmodal-content-picker">
      <ClickAwayListener onClickAway={() => setDesignPickerOpen(false)}>
        <Box pt={1} px={1}>
          <PopperContainer>
            <Box mb={1.5}>
              <Typography variant="h6" pl={0} id="form-dialog-title">
                Add Design
              </Typography>
            </Box>
            <SearchFilter
              keyword={keyword}
              setKeyword={setKeyword}
              disabled={!!error}
            />
            {displayState()}
            <Divider />
          </PopperContainer>
          <Box mr={1} mb={1} display="flex" justifyContent="flex-end">
            <Button onClick={() => setDesignPickerOpen(false)}>CANCEL</Button>
          </Box>
        </Box>
      </ClickAwayListener>
    </Paper>
  );
}

export default ContentPicker;
