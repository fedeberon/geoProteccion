import { makeStyles } from "@material-ui/core/styles";

const reportsRouteStyles = makeStyles((theme) => ({
  formControlDevices: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  dataGrid: {
    width: "100%",
    height: "85vh",
    paddingTop: "1%",
    backgroundColor: "white",
    [theme.breakpoints.up('md')]: {
      height: '80vh',
      width: '100%', 
      margin: '0 auto',
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

export default reportsRouteStyles;