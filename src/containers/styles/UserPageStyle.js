import { makeStyles } from "@material-ui/core/styles";

const userPageStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    paddingTop: "5%",
    overflowY: "auto",
  },
  formControl: {
    margin: "13px 0px",
    // minWidth: '90%',
  },
  rootTab: {
    flexGrow: 1,
    backgroundColor: "white",
    color: "black",
  },
  formControlType: {
    minWidth: 120,
  },
  subtitles: {
    backgroundColor: "lavender",
    padding: "4px",
    color: "currentColor",
    display: "flow-root",
  },
  UserPageSize: {
    float: "right",
    width: "70%",
    marginRight: "10%",
    marginTop: "6%",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "left",
    "& > *": {
      margin: theme.spacing(1),
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