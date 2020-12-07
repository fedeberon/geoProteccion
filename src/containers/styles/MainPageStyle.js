import { makeStyles } from "@material-ui/core";

const mainPageStyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column-reverse",
    },
  },
  drawerPaper: {
    position: "right",
    margin: 30,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    borderRadius: 5,
    height: "96%",

    [theme.breakpoints.up("sm")]: {
      width: 350,
    },
    [theme.breakpoints.down("xs")]: {
      height: 250,
    },
  },
  mapContainer: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

export default mainPageStyle;