/** @format */

import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: { main: '#4c43db' },
    secondary: { main: '#cc4c3b' },
    text: {
      primary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  overrides: {
    MuiSnackbar: {
      root: {
        '& button': { color: '#c3bfff !important' },
      },
    },
  },
});
