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
  rootSearch: {
    height: '33px',
    margin: '5px auto',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    [theme.breakpoints.up("md")]: {
      width: 400,
    },
  },
  inputSearch: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchButton: {
    padding: "10px !important",
    textAlign: "center",
    width: "100%",
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default deviceConfigFullStyles;