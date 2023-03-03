import React from 'react';
import styled from '@emotion/styled';
import { isEqual, isEmpty } from 'lodash';

const Wrapper = styled.div`
  text-align: center;
`;

const Header = styled.div`
  font-style: italic;
`;

const Filter = styled.span`
  font-weight: bold;
`;

function NoResults(props) {
  const { viewFilter, search } = props;

  const viewDisplay = () => {
    return isEqual(viewFilter, 'myContent')
      ? 'My Content'
      : 'Community Content';
  };

  return (
    <Wrapper id="CL_noResults">
      <Header>We couldn't find anything matching</Header>
      <br />
      <div>
        View: <Filter>{viewDisplay()}</Filter>
      </div>
      {!isEmpty(search) && (
        <div>
          Search: <Filter>{search}</Filter>
        </div>
      )}
    </Wrapper>
  );
}

export default NoResults;
