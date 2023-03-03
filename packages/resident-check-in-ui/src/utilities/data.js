import residentAwayWhite from "../assets/icons/residentAway_white.svg";
import markReturned from "../assets/icons/markReturned.svg";

export const listItemOptions = {
  false: [
    {
      name: "Set resident away",
      alias: "setAway",
    },
  ],
  true: [
    {
      name: "Mark as returned",
      alias: "returned",
    },
  ],
};

export const swipeButtons = {
  false: [
    {
      name: "Set Away",
      alias: "setAway",
      position: "right",
      icon: residentAwayWhite,
      style: {
        background: "#5bc0de",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "bold",
        paddingTop: "14px",
        width: "160px",
      },
    },
  ],
  true: [
    {
      name: "Mark Returned",
      alias: "returned",
      position: "right",
      icon: markReturned,
      style: {
        background: "#7e8484",
        color: "#ffffff",
        fontSize: "9px",
        fontWeight: "bold",
        paddingTop: "15px",
        width: "80px",
      },
    },
  ],
};
