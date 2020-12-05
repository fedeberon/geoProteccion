import { makeStyles } from "@material-ui/core/styles";

const deviceListStyles = makeStyles((theme) => ({
  list: {
    maxHeight: "100%",
    overflow: "auto",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fab_close: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
  root: {
    padding: "4px 4px",
    display: "flex",
    alignItems: "center",
    width: "94%",
    marginLeft: "3%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

export default deviceListStyles;