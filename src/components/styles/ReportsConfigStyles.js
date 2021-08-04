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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  inputSearch: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  textFieldDateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  itemsReportsMenu: {

    [theme.breakpoints.up("md")]: {
      minWidth: 'auto !important', 
    },
  },
}));

export default reportsConfigStyles;