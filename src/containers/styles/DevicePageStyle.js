import { makeStyles } from "@material-ui/core/styles";

const devicePageStyle = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    height: "60%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-evenly",
    "& > *": {
      flexBasis: "33%",
    },
  },
  buttonAddNewDevice: {
    position: "inherit",
    display: 'flex',
    margin: '10px auto',
    [theme.breakpoints.up("md")]: {
      left: "2%",
      position: "absolute",
      margin: "10px 0px",
    }, 
  },
  showAddressButton: {
    fontSize: '12px',
    color: 'cadetblue',
    display: 'contents',
    textTransform: 'inherit',
    [theme.breakpoints.up("md")]: {
      
    },    
  },
  rootList: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demoList: {
    backgroundColor: theme.palette.background.paper,
  },
  DivicePageSize: {
    float: "right",
    width: "70%",
    marginRight: "10%",
    marginTop: "6%",
  },
  table: {
    minWidth: 700,
  },
  tablerow: {
    height: "20px",

    [theme.breakpoints.up("md")]: {},
  },
  devicesTable: {
    width: "auto",
    height: "100%",
    overflow: "auto",
    marginLeft: "5%",
    overflowY: "scroll",
    display: "inherit",
    flexWrap: "wrap",
    paddingBottom: "50%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
      paddingBottom: "20%",
    },
  },
  root: {
    width: "95%",
    height: "auto",
    display: "grid",
    borderRadius: "30px",
    margin: "3% 0 3% 1%",
    boxShadow: "0px 0px 10px 1px rgba(102, 97, 102, 0.8)",
    mozBoxShadow: "0px 0px 10px 1px rgba(102, 97, 102, 0.8)",
    webkitBoxShadow: "0px 0px 10px 1px rgba(102, 97, 102, 0.8)",
    [theme.breakpoints.up("md")]: {
      width: "29%",
      display: "inline-grid",
      height: "auto",
      margin: "2%",
    },
  },
  formControlAttribute: {
    width: '38%', 
    marginLeft: '10px',
    [theme.breakpoints.up("md")]: {
      width: '42%', 
    },
  },
  media: {
    height: "160px",
    display: "list-item",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#e4efea",
  },
  devicesPage: {
    width: "100%",
    textAlign: "left",
    marginLeft: "6%",
    padding: "1%",
    [theme.breakpoints.up("md")]: {
      marginLeft: "16%",
    },
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    maxHeight: "170px",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  MuiHeaderRoot: {
    padding: "10px",
  },
  MuiContentRoot: {
    padding: "0",
    overflowY: "scroll",
  },
  cardItemText: {
    color: "black",
    fontSize: "12px",
    [theme.breakpoints.up("md")]: {
      fontSize: "13px",
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  rootSearch: {
    height: '42px',
    marginTop: '10px',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up("md")]: {
      width: 400,
    },
  },
  inputSearch: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButtonSearch: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default devicePageStyle;