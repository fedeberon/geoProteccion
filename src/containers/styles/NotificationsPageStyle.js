import { makeStyles } from "@material-ui/core/styles";

const notificationsPageStyle = makeStyles((theme) => ({
  root: {
    overflowY: "scroll",
    height: "100%",
    overflowX: "hidden",
    paddingBottom: "15%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      height: "100%",
      overflowY: "scroll",
      paddingBottom: "5%",
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
  // table: {
  //   minWidth: 650,
  // },
  formControlType: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  buttonFunctions: {
    minWidth: '48px !important',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chipsTypes: {
    display: "flex",
    flexWrap: "wrap",
  },
  chipTypes: {
    margin: 2,
  },
  noLabelTypes: {
    marginTop: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default notificationsPageStyle;