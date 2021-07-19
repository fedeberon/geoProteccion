import { makeStyles } from "@material-ui/core/styles";

const deviceConfigFullStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    textAlign: "center",
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    height: "auto",
  },
  table: {
    minWidth: "auto",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#eaeaea',
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default deviceConfigFullStyles;