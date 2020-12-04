import { makeStyles } from "@material-ui/core/styles";

const calendarsPageStyle = makeStyles((theme) => ({
  root: {
    overflowY: "scroll",
    height: "100%",
    overflowX: "hidden",
    paddingBottom: "5%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      height: "100%",
      overflowY: "scroll",
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
  formControl: {
    width: "229px",
    minWidth: 120,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default calendarsPageStyle;