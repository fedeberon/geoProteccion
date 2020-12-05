import { makeStyles } from "@material-ui/core/styles";

const menuStyles = makeStyles((theme) => ({
  speedDial: {
    position: "absolute",
    bottom: "1%",
    left: "50vw",
    right: "50vw",
    [theme.breakpoints.up("md")]: {
      top: "47%",
      left: "1%",
      right: "auto",
      bottom: "auto",
    },
  },
}));

export default menuStyles;