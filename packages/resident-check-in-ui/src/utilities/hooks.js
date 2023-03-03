import { useState, useEffect, useRef } from 'react'

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// utilized from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// used because of the inherent problems of the closure with setInterval inside useEffect
export function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let interval = setInterval(tick, delay);
      return () => clearInterval(interval)
    }
  }, [delay])
}
