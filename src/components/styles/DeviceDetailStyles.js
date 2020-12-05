import { makeStyles } from "@material-ui/core/styles";

const deviceDetailStyles = makeStyles((theme) => ({
  root: {
    minWidth: 150,
    borderRadius: "20px",
    border: "1px solid",
    borderColor: "gainsboro",
    margin: "2px 8px",
    [theme.breakpoints.up("md")]: {
      minWidth: 275,
    },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 1,
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