import React from 'react';

export const useDebounce = (value, delay = 400) => {
  const [dVal, setDVal] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDVal(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return dVal;
};
