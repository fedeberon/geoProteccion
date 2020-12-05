import { makeStyles } from "@material-ui/core/styles";

const shortcutsMenuStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "3%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      top: "3%",
      right: "1%",
      left: "auto",
      flexDirection: "unset",
    },
  },
  speedDial: {},
  [theme.breakpoints.up("md")]: {
    marginLeft: "8px",
  },
  speedDialOpen: {
    marginLeft: "8px",
    opacity: "60%",
  },
  badge: {},
  [theme.breakpoints.up("md")]: {
    marginLeft: "8px",
  },
}));

export default shortcutsMenuStyles;