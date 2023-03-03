import React, { useState, useEffect } from "react";
import { useDebounce } from "react-use";

const defaultOptions = {
  ms: 1000,
};

export default function useSearch(onSearch, options = defaultOptions) {
  const [search, setSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  async function handleSearch() {
    if (!search.match(/^\s$/)) {
      await onSearch(search);
    }
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => setInitialized(true));
  }, [])

  useEffect(() => {
    return () => clearTimeout(timeoutId)
  }, [timeoutId])

  useEffect(() => {
    if (initialized) {
      clearTimeout(timeoutId);
      setLoading(true);
      const id = setTimeout(() => {
        handleSearch();
      }, options.ms || defaultOptions.ms);
      setTimeoutId(id);
    }
  }, [search]);

  return [search, setSearch, loading];
}
