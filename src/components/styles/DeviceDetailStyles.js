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
    [theme.breakpoints.up("md")]: {
      minWidth: 230,
      maxWidth: 230,
      minHeight: 240,
      maxHeight: 240,
      display: 'inline-grid',
    },
  },
  buttonsCards: {
    padding: '6px 6px !important',
    [theme.breakpoints.up("md")]: {
      display: 'inline-block',
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
    display: 'inline-block',
    // width: '360px',
    [theme.breakpoints.up("md")]: {
      width: '490px',
      display: 'block',
    },
  },
  containerdev:{
    width: "100%",
    margin: "0 auto",
    marginTop: "5%",
    padding: '0px 10px',
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
    [theme.breakpoints.up("md")]: {
      
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
    height: "100px",
    margin: "17px 37px",
    [theme.breakpoints.up("md")]: {
      height: "170px",
      margin: "10px 61px",
    },
  },
}));

export default deviceDetailStyles;