import { makeStyles } from "@material-ui/core/styles";

const reportsConfigStyles = makeStyles((theme) => ({
  formControlDevices: {
    margin: theme.spacing(1),
    minWidth: 200,
    maxWidth: 200,
  },
  formControlReportType: {
    margin: "4px",
    minWidth: 200,
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

export default reportsConfigStyles;