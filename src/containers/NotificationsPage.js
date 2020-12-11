import React, { useEffect, useState } from "react";
import * as service from "../utils/serviceManager";
import { useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import t from "../common/localization";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { DeleteTwoTone, Label } from "@material-ui/icons";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import notificationsPageStyle from "./styles/NotificationsPageStyle";

const useStyles = notificationsPageStyle;

const styles = (theme) => ({
  rootNotification: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

export default function NotificationsPage() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const userId = useSelector((state) => state.session.user.id);
  const [notifications, setNotifications] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [always, setAlways] = useState(false);
  const [notificators, setNotificators] = useState("");
  const [availableTypes, setAvailableTypes] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [objectNotification, setObjectNotification] = useState("");

  // const typesList = [
  //   `${t('eventDeviceUnknown')}`,
  //   `${t('eventDeviceOnline')}`,
  //   `${t('eventTextMessage')}`,
  //   `${t('eventDeviceFuelDrop')}`,
  //   `${t('eventDeviceOverspeed')}`,
  //   `${t('eventGeofenceEnter')}`,
  //   `${t('eventGeofenceExit')}`,
  //   `${t('eventCommandResult')}`,
  //   `${t('eventMaintenance')}`,
  //   `${t('eventDriverChanged')}`,
  //   `${t('eventDeviceOffline')}`,
  //   `${t('eventIgnitionOff')}`,
  //   `${t('eventIgnitionOn')}`,
  //   `${t('eventDeviceMoving')}`,
  //   `${t('eventDeviceStopped')}`,
  //   `${t('eventAlarm')}`,
  // ]

  const typesValues = [
    "deviceUnknown",
    "deviceOnline",
    "textMessage",
    "deviceFuelDrop",
    "deviceOverspeed",
    "geofenceEnter",
    "geofenceExit",
    "commandResult",
    "maintenance",
    "driverChanged",
    "deviceOffline",
    "ignitionOff",
    "ignitionOn",
    "deviceMoving",
    "deviceStopped",
    "alarm",
  ];

  const handleChangeRadio = () => {
    setAlways(!always);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeChannel = (event) => {
    setNotificators(event.target.value);
  };

  const handleOpenNotification = () => {
    setOpen(true);
  };

  const handleCloseNotification = () => {
    setOpen(false);
  };

  const handleOpenEdit = (notification) => {
    setOpenEdit(true);
    setObjectNotification(notification);
    setType(notification.type);
    setAlways(notification.always);
    setNotificators(notification.notificators);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setType("");
    setAlways(false);
    setNotificators("");
    setObjectNotification("");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getNotifications(userId);
  }, []);

  const getNotifications = async (userId) => {
    const response = await service.getNotificationsByUserId(userId);
    setNotifications(response);
  };

  const getAvailableTypes = async () => {
    const response = await service.getAvailableTypes();
    setAvailableTypes(response);
  };

  const postNotifications = () => {
    const addNotification = {};
    addNotification.type = type;
    addNotification.always = always;
    addNotification.notificators = notificators;

    fetch(`api/notifications?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(addNotification),
    }).then((response) => {
      if (response.ok) {
        getNotifications(userId);
      }
    });
    handleCloseNotification();
  };

  const putNotifications = () => {
    const putNotification = {};
    putNotification.id = objectNotification.id;
    putNotification.type = type ? type : objectNotification.type;
    putNotification.always = always;
    putNotification.notificators = notificators
      ? notificators
      : objectNotification.notificators;

    fetch(`api/notifications/${putNotification.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(putNotification),
    }).then((response) => {
      if (response.ok) {
        getNotifications(userId);
      }
    });
    handleCloseEdit();
  };

  const removeNotification = (id) => {
    let option = confirm(`${t("sharedRemoveConfirm")}`);
    if (option) {
      fetch(`api/notifications/${id}`, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            getNotifications(userId);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div style={{ marginTop: "5%" }} className="title-section">
          <h2>{t("sharedNotifications")}</h2>
          <Divider />
        </div>
        <Container>
          <Button
            style={{ margin: "10px 0px" }}
            type="button"
            color="primary"
            variant="outlined"
            onClick={handleOpenNotification}
          >
            <AddIcon color="primary" />
            {t("sharedAdd")}
          </Button>
        </Container>
        {/*<TabPanel value={value} index={0}>*/}
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">{t("notificationType")}</TableCell>
                  <TableCell align="center">
                    {t("notificationAlways")}
                  </TableCell>
                  <TableCell align="center">{t("eventAlarm")}</TableCell>
                  <TableCell align="center">
                    {t("notificationNotificators")}
                  </TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {t(`${notification.type}`)}
                    </TableCell>
                    <TableCell align="center">
                      {t(`${Boolean(notification.always)}`)}
                    </TableCell>
                    <TableCell align="center" />
                    <TableCell align="center">
                      {notification.notificators}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        title={t("sharedEdit")}
                        onClick={() => handleOpenEdit(notification)}
                      >
                        <EditTwoToneIcon />
                      </Button>
                      <Button
                        title={t("sharedRemove")}
                        onClick={() => removeNotification(notification.id)}
                      >
                        <DeleteTwoTone />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*Modal Add New Notification*/}
        <div>
          <Dialog
            onClose={handleCloseNotification}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={handleCloseNotification}
            >
              {t("sharedAdd")}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleCloseNotification}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <form
                className={classes.rootNotification}
                noValidate
                autoComplete="off"
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t("sharedType")}:</TableCell>
                      <TableCell>
                        <FormControl
                          variant="outlined"
                          className={classes.formControlType}
                        >
                          <Select
                            native
                            value={type}
                            onChange={handleChangeType}
                          >
                            <option aria-label="None" value="" />
                            {typesValues.map((type, index) => (
                              <option key={index} value={type}>
                                {t(`${type}`)}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("notificationAlways")}:</TableCell>
                      <TableCell>
                        <Radio
                          checked={always === true}
                          onClick={handleChangeRadio}
                          color="primary"
                          value={true}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "A" }}
                        />{" "}
                        {t("reportYes")}
                        <Radio
                          checked={always === false}
                          onChange={handleChangeRadio}
                          color="primary"
                          value={false}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "B" }}
                        />{" "}
                        {t("reportNo")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("notificationNotificators")}:</TableCell>
                      <TableCell>
                        <FormControl
                          variant="outlined"
                          className={classes.formControlType}
                        >
                          <Select
                            native
                            value={notificators}
                            onChange={handleChangeChannel}
                          >
                            <option aria-label="None" value="" />
                            <option value="web">{t("notificatorWeb")}</option>
                            <option value="correo">
                              {t("notificatorMail")}
                            </option>
                            <option value="sms">{t("notificatorSms")}</option>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseNotification}
                autoFocus
                color="primary"
              >
                {t("sharedCancel")}
              </Button>
              <Button onClick={postNotifications} autoFocus color="primary">
                {t("sharedSave")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/*Modal PUT Notification*/}
        <div>
          <Dialog
            onClose={handleCloseEdit}
            aria-labelledby="customized-dialog-title"
            open={openEdit}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleCloseEdit}>
              {t("sharedEdit")}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleCloseEdit}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <form
                className={classes.rootNotification}
                noValidate
                autoComplete="off"
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>{t("sharedType")}:</TableCell>
                      <TableCell>
                        <FormControl
                          variant="outlined"
                          className={classes.formControlType}
                        >
                          <Select
                            native
                            value={type}
                            onChange={handleChangeType}
                          >
                            <option aria-label="None" value="" />
                            {typesValues.map((types, index) => (
                              <option key={index} value={types}>
                                {t(`${types}`)}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("notificationAlways")}:</TableCell>
                      <TableCell>
                        <Radio
                          checked={always === true}
                          onClick={handleChangeRadio}
                          color="primary"
                          value={true}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "A" }}
                        />{" "}
                        {t('reportYes')}
                        <Radio
                          checked={always === false}
                          onChange={handleChangeRadio}
                          color="primary"
                          value={false}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "B" }}
                        />{" "}
                        {t('reportNo')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t("notificationNotificators")}:</TableCell>
                      <TableCell>
                        <FormControl
                          variant="outlined"
                          className={classes.formControlType}
                        >
                          <Select
                            native
                            value={notificators}
                            onChange={handleChangeChannel}
                          >
                            <option aria-label="None" value="" />
                            <option value="web">{t("notificatorWeb")}</option>
                            <option value="correo">
                              {t("notificatorMail")}
                            </option>
                            <option value="sms">{t("notificatorSms")}</option>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit} autoFocus color="primary">
                {t("sharedCancel")}
              </Button>
              <Button onClick={putNotifications} autoFocus color="primary">
                {t("sharedSave")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}
