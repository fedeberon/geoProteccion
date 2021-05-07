import { makeStyles } from '@material-ui/core/styles';

const deviceSearchStyles = makeStyles((theme) => ({
  paper: {
    padding: "4px 4px",
    display: "grid",
    alignItems: "center",
    width: "74%",
    height: "auto",
    margin: "17px 8px",
    position: "fixed",
    left: "0px",
    borderRadius: "28px",
    webkitBoxShadow: "0px 0px 20px 1px rgba(102, 97, 102, 0.8)",
    mozBoxShadow: "0px 0px 20px 1px rgba(102, 97, 102, 0.8)",
    boxShadow: "0px 0px 20px 1px rgba(102, 97, 102, 0.8)",
    [theme.breakpoints.up("md")]: {
      position: "unset",
      margin: "0px 15px 0px 10px",
      height: "fit-content",
      width: "75%",
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
    maxHeight: "75px",
    fontSize: "10px",
    [theme.breakpoints.up("md")]: {
      maxHeight: "80px",
    },
  },
  MuiAvatarRoot: {
    width: "28px",
    height: "28px",
    fontSize: "12px",
    display: "inline-flex",
    left: "-10px",
    [theme.breakpoints.up("md")]: {
      width: "33px",
      height: "33px",
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

export default deviceSearchStyles;