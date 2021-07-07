import { makeStyles } from "@material-ui/core/styles";

const userPageStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    paddingBottom: "15%",
    [theme.breakpoints.up("md")]: {
     paddingTop: "4%",  
     paddingBottom: 0,   
    },
  },
  rootSnack: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  snackbar: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  formControl: {
    margin: "13px 0px",
    // minWidth: '90%',
  },
  formControlUser: {
    margin: "3px 0px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  rootTab: {
    flexGrow: 1,
    backgroundColor: "white",
    color: "black",
  },
  formControlType: {
    minWidth: 120,
  },
  adminButton: {
    textTransform: 'capitalize',
    fontSize: '19px',
    color: '#753aff',
    minWidth: '40px',
    padding: '5px !important',
    //background: 'darkkhaki',
    boxShadow: '0 0 11px 0 rgb(102 97 102 / 80%)',
    //backgroundImage: 'linear-gradient( 25deg, #77F9D3 0%, #5CD2F8 50%, #5A79FF 100%)',
  },
  subtitles: {
    fontSize: '19px',
    fontWeight: 600,    
    backgroundColor: "#73fbd3",
    padding: "4px",
    color: "#1c2a39",
    alignItems: 'center',
    textAlign: "center",
    display: "flow-root",
    height: "8%",
    [theme.breakpoints.up("md")]: {

    },
  },
  subtitlesAdd: {
    fontSize: '19px',
    fontWeight: 600,    
    backgroundColor: "cornflowerblue",
    borderRadius: '20px',
    padding: "4px",
    color: "#f7f7f7",
    alignItems: 'center',
    textAlign: "center",
    display: "flow-root",
    height: "8%",
    [theme.breakpoints.up("md")]: {

    },
  },
  tableContainerAdd: {
    borderRadius: '20px',
    [theme.breakpoints.up("md")]: {

    },
  },
  centerItems: {
    [theme.breakpoints.up("md")]: {
      display: '-webkit-box',
      justifyContent: 'center',
    },
  },
  UserPageSize: {
    width: "100%",
    margin: "0 auto",
    marginTop: "5%",
    marginBottom: "15%",
      [theme.breakpoints.up("md")]: {
        width: "50%",
        marginTop: "1%",
        marginBottom: "5%",
      },
  },
  buttonGroup: {
    display: "flex",
    justifyContent: 'center',
    flexDirection: "row",
    alignItems: "left",
    "& > *": {
      margin: '1px',
    },
  },
  containerDateTime: {
    display: "flex",
    flexWrap: "wrap",
    width: 170,
  },
  textFieldDateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  buttonsFooter: {
    width: "46%",
    fontSize: "12px",
    margin: "0px 10px",
    [theme.breakpoints.up("md")]: {
      bottom: 0,
      backgroundColor: "#eaeaea",
      width: "23%",      
    },
  },
  buttonsFooterContainer:{
    backgroundColor: "white",
    bottom: "8%",
    display: "flex",
    position: "absolute",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      bottom: "1%",
    },
  },
}));

export default userPageStyle;
