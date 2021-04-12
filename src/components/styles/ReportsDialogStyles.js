import { makeStyles } from "@material-ui/core/styles";

const reportsDialogStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formControlReportType: {
    margin: "4px",
    minWidth: 150,
    
    [theme.breakpoints.up("md")]: {
      marginLeft: '15px',
    },
  },
  buttonsConfig: {

    [theme.breakpoints.up("md")]: {
      margin: "16px 8px",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 2000,
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: 0,
    color: theme.palette.grey[500],
  },
  graphic: {
    top: "15%",
    left: "12%",
    height: "50%",
    margin: "3% !important",
    display: "flex",
    padding: "25px",
    position: "absolute",
  },
  miniature: {
    width: "25%",
    height: "30%",
    position: "absolute",
    right: 0,
    bottom: 0,
    transition: "width 0.5s, height 0.5s",
    zIndex: 10000,
  },
  positionButton: {
    width: "100%",
    //justifyContent: "center",    
    position: "absolute",
    display: "inline-grid",
    top: "8%",
    [theme.breakpoints.up("md")]: {
      top: "10%",
      display: "flex",
    },
  },
  tableReports: {
    top: "20%",
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "75%",
    overflowY: "auto",
    paddingBottom: "2.5%",
  },
  fullscreen: {
    width: "100%",
    height: "100%",
    position: "absolute",
    right: 0,
    bottom: 0,
    transition: "width 0.5s, height 0.5s",
    zIndex: 10000,
  },
  hidden: {
    height: "30px !important",
  },
  fullscreenToggler: {
    position: "absolute",
    left: "10px",
    top: "10px",
    zIndex: 1,
    cursor: "pointer",
  },
  miniatureToggler: {
    position: "absolute",
    right: "10px",
    top: "10px",
    zIndex: 1,
    cursor: "pointer",
  },
  overflowHidden: {
    overflow: "hidden",
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "auto",
  },
  row: {
    padding: "3px",
    fontSize: "13px",
    "&:hover": {
      background: "#ccc",
      cursor: "pointer",
    },
  },
}));

export default reportsDialogStyles;