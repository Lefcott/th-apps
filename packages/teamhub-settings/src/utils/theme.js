/** @format */

import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      main: "#4c43db",
      light: "#DBD9F8",
    },
    secondary: { main: "#cc4c3b" },
  },
  overrides: {
    MuiOutlinedInput: {
      adornedEnd: {
        paddingRight: 0,
      },
    },
    MuiAccordion: {
      root: {
        borderRadius: 4,
        paddingLeft: "1.75rem",
        paddingRight: "1.75rem",
        border: "1px solid #e5e5e5",
      },
    },
    MuiAccordionDetails: {
      root: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    MuiAccordionSummary: {
      root: {
        padding: 0,
        flexDirection: "column",
        "& > div": {
          width: "100%",
        },
      },
      content: {
        margin: "20px 0",
      },
    },
    MuiChip: {
      root: {
        backgroundColor: "#ebebeb",
      },
      label: {
        fontSize: "14px",
        lineHeight: "21px",
        letterSpacing: ".25px",
      },
      deleteIcon: {
        fill: "rgba(0, 0, 0, 0.34)",
      },
    },
  },
  props: {
    MuiAccordion: {
      elevation: 0,
      square: true,
    },
  },
});
