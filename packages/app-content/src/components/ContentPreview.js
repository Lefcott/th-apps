/** @format */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getUrlThumb } from '../utils/hooks';
import { CircularProgress } from '@material-ui/core';
import DesignPlaceholder from '../utils/images/DesignPlaceholder.svg';

const Wrapper = styled.div`
  position: relative;
  box-shadow: rgb(179, 179, 179) 0px 0px 3px 1px;
  width: 150px;
  height: 100px;
  margin: 5px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: scale-down;
`;

const Spinner = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  bottom: 50%;
  margin-left: -10px;
`;

function ContentPreview(props) {
  const { data, onClick } = props;
  const [loaded, setLoaded] = useState(false);
  const preview = data.images[0];

  return (
    <Wrapper
      data-testid="AP_postmodal-content-preview"
      className="AP_picker-content"
      onClick={() => onClick(data)}
    >
      {!loaded && <Spinner size={20} />}
      <Image
        src={getUrlThumb(preview) || DesignPlaceholder}
        onLoad={() => setLoaded(true)}
        onError={({ target }) => (target.src = DesignPlaceholder)}
      />
    </Wrapper>
  );
}

export default ContentPreview;
