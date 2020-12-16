import { makeStyles } from '@material-ui/core/styles';

const notificationListStyles = makeStyles((theme) => ({
  paper: {
    padding: "4px 4px",
    display: "grid",
    alignItems: "center",
    width: "73%",
    height: "auto",
    margin: "17px 8px",
    position: "absolute",
    top: "10%",
    left: "1%",
    maxHeight: "200px",
    overflowY: "scroll",
    borderRadius: "15px",
    webkitBoxShadow: "0px 0px 20px 1px rgba(102, 97, 102, 0.8)",
    mozBoxShadow: "0px 0px 20px 1px rgba(102, 97, 102, 0.8)",
    boxShadow: "0px 0px 20px 1px rgba(102, 97, 102, 0.8)",
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      margin: "0px 15px 0px 10px",
      width: "35%",
      top: "9%",
      left: "11%",
    },        
  },
  iconButton: {
    padding: 8,
  },
  div: {
    paddingLeft: "5%",
    display: "flex",
  },
  input: {
    [theme.breakpoints.up("md")]: {
      width: "460px",
      height: "37px,",
    },
  },
  listItem: {
    maxHeight: "45px",
    fontSize: "10px",
    [theme.breakpoints.up("md")]: {
      maxHeight: "37px",
    },
  },
  MuiAvatarRoot: {
    width: "25px",
    height: "25px",
    fontSize: "12px",
    display: "inline-flex",
    left: "-10px",
    [theme.breakpoints.up("md")]: {
      width: "40px",
      height: "40px",
      fontSize: "1.25rem",
      display: "flex",
    },
  },

  devsearchSpeed: {
    display: "grid",
    [theme.breakpoints.up("md")]: {
      display: "contents",
    },
  },

  devsearchSpeedP: {
    fontSize: "10px",
    display: "contents",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      fontSize: "15px",
      padding: "0 5px 0 0",
    },
  },

  devsearchSt: {
    fontSize: "8px",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
      fontSize: "12px",
    },
  },
  devsearchStP: {
    fontSize: "12px",
    margin: "3px 0",
    [theme.breakpoints.up("md")]: {
      fontSize: "15px",
      margin: 0,
    },
  },

  devsearchSd: {
    [theme.breakpoints.up("md")]: {
      display: "inline-flex",
    },
  },

  devsearchSdP: {
    margin: "3px 0",
    fontSize: "10px",
    [theme.breakpoints.up("md")]: {
      paddingLeft: "10px",
      margin: 0,
    },
  },
}));

export default notificationListStyles;
