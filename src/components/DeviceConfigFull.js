import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import t from "../common/localization";
import * as service from "../utils/serviceManager";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    textAlign: "center",
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    height: "auto",
  },
  table: {
    minWidth: "auto",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCellssharedGeofences = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedName")}`,
  },
];

const headCellssharedNotifications = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("notificationType")}`,
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: `${t("notificationAlways")}`,
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: `${t("notificationNotificators")}`,
  },
];

const headCellssharedComputedAttributes = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedDescription")}`,
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: `${t("sharedAttribute")}`,
  },
];
const headCellssharedSavedCommands = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedDescription")}`,
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: `${t("sharedType")}`,
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: `${t("commandSendSms")}`,
  },
];
const headCellssharedMaintenance = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: `${t("sharedName")}`,
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: `${t("sharedType")}`,
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: `${t("maintenanceStart")}`,
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: `${t("maintenancePeriod")}`,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeviceConfigFull = ({ open, close, type }) => {
  const classes = useStyles();
  const userId = useSelector((state) => state.session.user.id);
  const [openFull, setOpenFull] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [tableNumber, setTableNumber] = useState(0);
  const [geozones, setGeozones] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [computedAttributes, setComputedAttributes] = useState([]);
  const [savedCommands, setSavedCommands] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [arrayToMap, setArrayToMap] = useState([]);

  useEffect(() => {
    const getGeozones = async (userId) => {
      const response = await service.getGeozonesByUserId(userId);
      setGeozones(response);
    };
    getGeozones(userId);
  }, [tableNumber === 1]);

  useEffect(() => {
    const getNotifications = async (userId) => {
      const response = await service.getNotificationsByUserId(userId);
      setNotifications(response);
    };
    getNotifications(userId);
  }, [tableNumber === 2]);

  // useEffect(()=> {
  //   const getComputedAttributes = async (deviceId) => {
  //     const response = await service.getComputedAttributesById(deviceId);
  //     setComputedAttributes(response)
  //   }
  //   getComputedAttributes(deviceId);
  // },[tableNumber===3])

  // useEffect(()=> {
  //   const getCommands = async (deviceId) => {
  //     const response = await service.getCommandsByDeviceId(deviceId);
  //     setSavedCommands(response);
  //   }
  //   getCommands(deviceId);
  // },[tableNumber===4])

  // useEffect(()=> {
  //   const getMaintenance = () => {
  //     fetch (`api/maintenance`, {method: 'GET', headers: {'Accept': 'application/json'} })
  //     .then(response => {
  //       if(response.ok){
  //         setMaintenance(response);
  //       }
  //     })
  //   }
  //   getMaintenance();
  // },[tableNumber===5])

  useEffect(() => {
    if (type === "sharedGeofences") {
      setTableNumber(1);
      setArrayToMap(geozones);
    } else if (type === "sharedNotifications") {
      setTableNumber(2);
      setArrayToMap(notifications);
    } else if (type === "sharedComputedAttributes") {
      setTableNumber(3);
      // setArrayToMap(computedAttributes);
    } else if (type === "sharedSavedCommands") {
      setTableNumber(4);
      // setArrayToMap(savedCommands);
    } else if (type === "sharedMaintenance") {
      setTableNumber(5);
      // setArrayToMap(maintenance);
    }
  }, [type]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = arrayToMap.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClose = () => {
    close();
  };

  useEffect(() => {
    setOpenFull(open);
  }, [open]);

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  function EnhancedTableHead(props) {
    const {
      classes,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    switch (type) {
      case "sharedGeofences":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedGeofences" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>
              {headCellssharedGeofences.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );

      case "sharedNotifications":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedNotifications" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>

              {headCellssharedNotifications.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "sharedComputedAttributes":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedComputedAttributes"
                  ? "table-header-group"
                  : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>

              {headCellssharedComputedAttributes.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "sharedSavedCommands":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedSavedCommands" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>

              {headCellssharedSavedCommands.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      case "sharedMaintenance":
        return (
          <TableHead
            style={{
              display: `${
                type === "sharedMaintenance" ? "table-header-group" : "none"
              }`,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                />
              </TableCell>

              {headCellssharedMaintenance.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        );
      default:
        break;
    }
  }

  function EnhancedTableBody() {
    switch (type) {
      case "sharedGeofences":
        return (
          <TableBody>
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        );
      case "sharedNotifications":
        return (
          <TableBody>
            {stableSort(arrayToMap, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.type);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.type)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.type}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {t(`${row.type}`)}
                    </TableCell>
                    <TableCell align="inherit">
                      {t(`${Boolean(row.always)}`)}
                    </TableCell>
                    <TableCell align="inherit">{row.notificators}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        );
      default:
        break;
    }
  }

  return (
    <>
      <div>
        <Dialog
          fullScreen
          open={openFull}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {t("deviceTitle")}
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>

          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Toolbar>
                <Typography
                  className={classes.title}
                  align="center"
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  {t(`${type}`)}
                </Typography>
              </Toolbar>
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size="small"
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={arrayToMap.length}
                  />
                  <EnhancedTableBody />
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default DeviceConfigFull;
