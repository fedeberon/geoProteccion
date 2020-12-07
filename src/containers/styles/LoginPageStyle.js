import { makeStyles } from "@material-ui/core";

const loginPageStyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(http://164.68.101.162:8093/img/Tesla-maps.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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