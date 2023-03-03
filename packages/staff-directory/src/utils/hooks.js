/** @format */
import React, { useState, useEffect } from 'react';

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
