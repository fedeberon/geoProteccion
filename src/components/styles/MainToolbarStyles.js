import { makeStyles } from "@material-ui/core/styles";

const mainToolbarStyles = makeStyles((theme) => ({
  flex: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  list: {
    width: 200,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menu: {
    margin: 30,
  },
  titlePage: {
    backgroundColor: "cadetblue",
    backgroundImage:
      "linear-gradient(25deg, #77F9D3 0%, #5CD2F8 50%, #5A79FF 100%);",
    boxShadow: "rgba(102, 97, 102, 0.8) 0px 0px 15px 5px",
    display: "inline-flex",
    justifyContent: "space-between",
    position: "absolute",
    bottom: "0",
    zIndex: "2",
    width: "100%",
    padding: "2%",
    [theme.breakpoints.up("md")]: {
      top: 0,
      height: "fit-content",
      padding: "10px",
    },
  },
}));

export default mainToolbarStyles;