import { makeStyles } from "@material-ui/core/styles";

const groupsPageStyle = makeStyles((theme) => ({
  GroupsPageSize: {
    float: "right",
    width: "70%",
    marginRight: "10%",
    marginTop: "6%",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  container: {
    marginTop: theme.spacing(2),
    height: "60%",
  },
  containerTable: {
    width: "auto",
    height: "450px",
    overflow: "auto",
    overflowY: "scroll",
    display: "inherit",
    flexWrap: "wrap",
    [theme.breakpoints.up("md")]: {
      paddingBottom: "4%",
    },
  },
}));

export default groupsPageStyle;