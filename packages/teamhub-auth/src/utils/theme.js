/** @format */

import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: { main: '#4c43db' },
    secondary: { main: '#cc4c3b' },
    error: { main: 'rgba(198, 40, 40, 1)' },
  },
});

export default theme;
