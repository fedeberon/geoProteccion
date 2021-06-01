import { makeStyles } from "@material-ui/core/styles";

const reportsRoutesStyles = makeStyles((theme) => ({
  formControlDevices: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  dataGrid: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    [theme.breakpoints.up('md')]: {
      height: '80vh',
      width: '75%', 
      paddingTop: 0,
      padding: 0
    },
  },
  noLabel: {
    marginTop: theme.spacing(3),
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

export default reportsRoutesStyles;