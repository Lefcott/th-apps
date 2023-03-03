import React from 'react';
import styled from '@emotion/styled';
import { upperFirst } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Button, useMediaQuery } from '@material-ui/core';

const Header = styled.span`
  font-size: ${(props) => (props.isTitle ? '30px' : '24px')};
  font-weight: ${(props) => (props.isTitle ? 'bold' : 'normal')};
  color: #474848;
`;

const SubHeader = styled.div`
  font-size: 14px;
  color: #474848;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${(props) => (props.isTitle ? 0 : '20px')};
`;

const ExpandButton = styled(Button)`
  && {
    font-size: 16px;
    text-transform: none;
  }
`;

function SectionHeader(props) {
  const { data, expandable, isTitle, path } = props;
  const isMobile = useMediaQuery('(max-width:960px)');
  const history = useHistory();

  return (
    <HeaderContainer isTitle={isTitle}>
      <div>
        <Header isTitle={isTitle}>{upperFirst(data.name)}</Header>
        {!isMobile && <SubHeader>{data.description}</SubHeader>}
      </div>
      {expandable && (
        <ExpandButton
          id={`CL_library-seeAll-${data.name}`}
          color="primary"
          onClick={() => history.push(path)}
        >
          See all
        </ExpandButton>
      )}
    </HeaderContainer>
  );
}

export default SectionHeader;
