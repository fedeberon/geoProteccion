import { makeStyles } from "@material-ui/core/styles";

const deviceDetailStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 150,
    minHeight: 210,
    maxHeight: 210,
    borderRadius: "20px",
    border: "1px solid",
    borderColor: "gainsboro",
    margin: "2px 1px",
    display: 'inline-grid',
    minHeight: 185,
    maxHeight: 185,
    minWidth: 145,
    maxWidth: 145,
    [theme.breakpoints.up("md")]: {
      minWidth: 230,
      maxWidth: 230,
      minHeight: 240,
      maxHeight: 240,
      display: 'inline-grid',
    },
  },
  actionsButtons: {
    justifyContent: 'space-between',
    display: 'flex',
    padding: '10px 20px',
    [theme.breakpoints.up("md")]: {
      
    },
  },
  buttonsRemoteControl: {
    backgroundColor: '#b4b0d8 !important',
    width: '100px !important',
    padding: '10px !important',
    color: 'white',
    border: '1px solid #ecf1eb !important',
    [theme.breakpoints.up("md")]: {
      
    },
  },
  buttonsCards: {
    padding: '6px 12px !important',
    [theme.breakpoints.up("md")]: {
      display: 'inline-block',
      padding: '6px 6px !important',
    },
  },
  buttonTypogra: {
    textAlign: 'center',
    fontSize: '12px',
    margin: '16px 0px',
    [theme.breakpoints.up("md")]: {
      margin: '20px 0px',
      fontSize: '15px',
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  rootContainer: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  divCards:{
    width: '100%',
    display: 'inline-block',
    textAlign: 'center',
    [theme.breakpoints.up("md")]: {
      width: '490px',
      display: 'block',
    },
  },
  containerdev:{
    width: "100%",
    margin: "0 auto",
    paddingBottom: '15%',
      [theme.breakpoints.up("md")]: {
        width: "39%",
        marginTop: "5%",
        paddingBottom: '5%',
      },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  messageCard: {
    display: "inline",    
    color: "burlywood",
    border: "1px solid",
    borderRadius: "4px",
    marginLeft: "1%",
    padding: "2px",
    fontSize: '12px',
    [theme.breakpoints.up("md")]: {
      marginLeft: "10%",
    },
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 1,
    fontSize: '11px',
    color: 'black',
    display: 'flex',
    bottom: '10%',
    position: 'absolute',
    justifyContent: 'center',
    width: '70%',
    [theme.breakpoints.up("md")]: {
      width: '85%',
    },
  },
  container: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "center",
      overflowY: "auto",
    },
  },
  dashImg: {
    height: "105px",
    margin: "15px 37px",
    [theme.breakpoints.up("md")]: {
      height: "170px",
      margin: "10px 61px",
    },
  },
}));

export default deviceDetailStyles;