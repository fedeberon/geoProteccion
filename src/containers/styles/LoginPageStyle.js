import { makeStyles } from "@material-ui/core";

const loginPageStyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
    flexWrap: "nowrap",
    justifyContent: "center",
  },
  image: {
    backgroundImage: "url(images/fondologin.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: "0 10%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bottom: "12%",
    position: "absolute",
    [theme.breakpoints.up("md")]: {
      bottom: "2%",
    }, 
  },
  passwordTextField: {
    margin: "7% 0% 2% 0%",
    [theme.breakpoints.up("md")]: {
      margin: "7% 0% 2% 0%",
    }, 
  },
  rememberForm: {
    color: "white",
    marginLeft: "0 !important",
    margin: "15px 0px",
    [theme.breakpoints.up("md")]: {
      margin: "5px 0px",
    }, 
  },
  copyrightString: {
    position: "fixed",
    justifyContent: "center",
    width: "80%",
    bottom: 0,
    color: "white",
  },
  imageRight: {
    backgroundImage: "url(images/loginapp.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    margin: "0 0",
    boxShadow: "1px 1px 5px 9px rgb(0 0 0 / 20%), 1px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 16px 0px rgb(0 0 0 / 12%)",
    [theme.breakpoints.up("md")]: {
      height: "85%",
      margin: "4% 0",
    }, 
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  checkBoxIcon: {
    color: "aqua !important",
  },
  inputLogin: {
    backgroundColor: "#22303D !important",
    border: "1px solid",
    borderColor: "#869ab0",
    borderRadius: "20px",
  },
  submit: {
    // margin: theme.spacing(3, 0, 2),
    backgroundImage: "linear-gradient(25deg, #77F9D3 0%, #5CD2F8 50%, #5A79FF 100%)",
    padding: "3px 16px !important",
    borderRadius: "20px",
    margin: "0 auto",
    display: "block",
    height: "29px",
    color: "black",
    fontSize: "12px",
  },
  registerTitle: {
    fontFamily: "sans-serif",
    color: "#5CD2F8",
    fontWeight: 600,
    fontSize: "18px",
  },
  faIcons: {
    fontSize: "20px",
    color: "rgb(90 165 173)",
    padding: "0px 10px",
    bottom: "32%",
    right: "-1%",
    position: "absolute",
  },
}));

export default loginPageStyle;