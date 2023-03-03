import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      main: "#4C43DB",
    },
    secondary: {
      main: "#CE4B35",
    },
    background: {
      default: "#FAFAFA",
    },
  },
  overrides: {
    MuiAvatar: {
      img: {
        objectFit: "scale-down",
        height: "100%",
      },
    },
  },
});
