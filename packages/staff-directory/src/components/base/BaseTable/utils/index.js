/** @format */

import { ActionCell } from '../cell-types';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

export function useIsMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return [isMobile, theme];
}

class IdGenerator {
  constructor(prefix) {
    this.prefix = prefix;
  }

  createWithAppendedPrefix(id) {
    return new IdGenerator(`${this.prefix}-${id.toLowerCase()}`);
  }

  getId(id) {
    return `${this.prefix}-${id.toLowerCase()}`;
  }
}

export function createIdGenerator(prefix) {
  return new IdGenerator(prefix);
}
