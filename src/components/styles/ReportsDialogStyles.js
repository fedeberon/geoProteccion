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
    display: "inline-block",
    margin: "4px",
    minWidth: 150,
    maxWidth: 150,
    [theme.breakpoints.up("md")]: {
      marginLeft: '15px',
    },
  },
  dataGrid: {
    width: "100%",
    height: "80%",
    margin: "0px 40px",
    padding: "0px 29px",
    paddingTop: "1%",
    backgroundColor: "white",
    [theme.breakpoints.up('md')]: {
      height: '86%',
      width: '100%', 
      margin: '0 auto',
      paddingTop: 0,
      padding: 0
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
    width: "100%",
    height: "50%",
    margin: "5px -17px !important",
    padding: "15px 0px",
    display: "block",
    [theme.breakpoints.up("md")]: {
      top: "15%",
      width: "75%",
      height: "50%",
      margin: "40px 0px !important",
      padding: "25px",
    },
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
    // position: "absolute",
    display: "inline-block",
    top: "8%",
    [theme.breakpoints.up("md")]: {
      top: "10%",
      display: "flex",
    },
  },
  tableReports: {
    top: "20%",
    position: "absolute",
    width: "75%",
    height: "80%",
    overflowY: "auto",
    paddingBottom: "2.5%",
  },
  tableTripsReports: {
    top: "20%",
    width: "100%",
    height: "80%",
    position: "absolute",
    overflowY: "auto",
    paddingBottom: "2.5%",
  },
  tableEventsReports: {
    top: "20%",
    position: "absolute",
    width: "100%",
    height: "80%",
    overflowY: "auto",
    paddingBottom: "2.5%",
  },
  tableReportsState: {
    top: "19.5%",
    borderTop: 'outset',
    justifyContent: "end",
    right: 0,
    position: "absolute",
    width: "25%",
    height: "50%",
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