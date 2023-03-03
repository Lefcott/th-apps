/** @format */

import { useState, useEffect } from 'react';
import { includes, replace } from 'lodash';
import DesignPlaceholder from './images/DesignPlaceholder.svg';
import PdfPlaceholder from './images/PdfPlaceholder.svg';
import PhotoPlaceholder from './images/PhotoPlaceholder.svg';

export const useDebounce = (value, delay = 400) => {
  const [dVal, setDVal] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDVal(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return dVal;
};

export const getUrlThumb = (image) => {
  if (includes(image, '.jpg')) image = replace(image, '.jpg', '.thumb.jpg');
  if (includes(image, '.png')) image = replace(image, '.png', '.thumb.png');
  return image;
};

export const getPlaceholderImg = (uploadType) => {
  switch (uploadType) {
    case 'design':
      return DesignPlaceholder;
    case 'photo':
      return PhotoPlaceholder;
    case 'document':
      return PdfPlaceholder;
  }
};
