import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { includes, replace } from 'lodash';
import PdfPlaceholder from '../utils/images/PdfPlaceholder.svg';
import DesignPlaceholder from '../utils/images/DesignPlaceholder.svg';
import PhotoPlaceholder from '../utils/images/PhotoPlaceholder.svg';

// trying to avoid having a bajillion divs with style="flex"
// maybe we can turn this into a configurable flexContainer without constantly rewriting most props
export const FlexContainer = styled.div`
  display: flex;
  direction: ${(props) => (props.direction ? props.direction : 'column')};
  width: 100%;
`;

export const StyledButton = styled(Button)`
  && {
    margin-left: ${(props) => (props.margin ? '15px' : 0)};
    font-size: 14px;
    padding: 5px 25px;
  }
`;

export const getPlaceholderIcon = (type) => {
  switch (type) {
    case 'design':
      return DesignPlaceholder;
    case 'photo':
      return PhotoPlaceholder;
    case 'document':
      return PdfPlaceholder;
  }
};

export const getUrlThumb = (image) => {
  if (includes(image, 'published-content')) return image;

  if (includes(image, '.jpg')) image = replace(image, '.jpg', '.thumb.jpg');
  if (includes(image, '.png')) image = replace(image, '.png', '.thumb.png');
  return image;
};
