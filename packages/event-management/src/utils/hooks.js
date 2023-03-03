/** @format */

import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { useDebounce as useDebounced } from 'use-debounce';

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useDeepCompareMemoize(value) {
  const ref = React.useRef();

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDebouncedEffect(effect, deps, timer) {
  const [debouncedDeps] = useDebounced(deps, timer, {
    equalityFn: isEqual,
  });

  // eslint-disable-next-line
  React.useEffect(effect, useDeepCompareMemoize(debouncedDeps));
}
