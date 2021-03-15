import { makeStyles } from "@material-ui/core/styles";

const userPageStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    [theme.breakpoints.up("md")]: {
     paddingTop: "3%",
         },
  },
  rootSnack: {
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
    fontSize: '10px',
    color: 'white',
    background: 'darkkhaki',
    boxShadow: '0 0 11px 0 rgb(102 97 102 / 80%)',
    backgroundImage: 'linear-gradient( 25deg, #77F9D3 0%, #5CD2F8 50%, #5A79FF 100%)',
  },
  subtitles: {
    fontSize: '19px',
    fontWeight: 600,    
    backgroundColor: "lavender",
    padding: "4px",
    color: "cadetblue",
    alignItems: 'center',
    textAlign: "center",
    display: "flow-root",
    height: "8%",
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
      },
  },
  buttonGroup: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "left",
    "& > *": {
      margin: '1px',
    },
  },
  containerDateTime: {
    display: "flex",
    flexWrap: "wrap",
  },
  textFieldDateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default userPageStyle;
