import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import t from "../common/localization";
import Container from "@material-ui/core/Container";
import * as service from "../utils/serviceManager";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { DeleteTwoTone } from "@material-ui/icons";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import List from "@material-ui/core/List";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import DrawableMap from "../components/DrawableMap";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { CirclePicker } from "react-color";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Popover from "@material-ui/core/Popover";
import geozonesPageStyle from "./styles/GeozonesPageStyle";

const useStyles = geozonesPageStyle;

const styles = (theme) => ({
  root2: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function GeozonesPages() {
  const classes = useStyles();
  const [ geozones, setGeozones ] = useState([]);
  const theme = useTheme();
  const userId = useSelector((state) => state.session.user.id);
  const [ open, setOpen ] = useState(false);
  const [ openEditModal, setOpenEditModal ] = useState(false);
  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop
  );
  const [ openModalMap, setOpenModalMap ] = useState(false);
  const [ geozoneType, setGeozoneType ] = useState("0");
  const [ color, setColor ] = useState("#000000");
  const [ openPer, setOpenPer ] = React.useState(true);
  const [ geozone, setGeozone ] = useState({
    
    name: "",
    description: "",
    area: "",
    attributes: {},
  });
  const [objectId, setObjectId] = useState('');
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

  const handleOpenRemoveDialog = (objectId) => {
    setOpenRemoveDialog(true);
    setObjectId(objectId)
  };

  const handleDrawerShow = () => {
    setOpenPer(!openPer);
  };

  const handleChangeGeozoneType = (event) => {
    setGeozoneType(event.target.value);
  };

  const handleClickOpenModalMap = () => {
    setOpenModalMap(true);
  };

  const handleCloseModalMap = () => {
    setOpenModalMap(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setGeozone({
      name: "",
      description: "",
      area: "",
      attributes: {},
    });
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false);
  };

  const handleClickOpenEditModal = (geozone) => {
    setOpenEditModal(true);
    setGeozone({
      id: geozone.id,
      name: geozone.name,
      description: geozone.description,
      area: geozone.area,
      attributes: geozone.attributes,
    });
  };

  useEffect(() => {
    const getGeozones = async (userId) => {
      const response = await service.getGeozonesByUserId(userId);
      setGeozones(response);
    };
    getGeozones(userId);
  }, [userId]);

  const handleAdd = () => {
    fetch(`api/geofences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: geozone.name,
        description: geozone.description,
        area: geozone.area,
        attributes: geozone.attributes,
      }),
    }).then((response) => {
      if (response.ok) {
        const getGeozones = async (userId) => {
          const response = await service.getGeozonesByUserId(userId);
          setGeozones(response);
        };
        getGeozones(userId);
      }
    });
    handleClose();
  };

  const handleEdit = (id) => {
    fetch(`/api/geofences/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: geozone.id,
        name: geozone.name,
        description: geozone.description,
        area: geozone.area,
        attributes: geozone.attributes,
      }),
    }).then((response) => {
      if (response.ok) {
        const getGeozones = async (userId) => {
          const response = await service.getGeozonesByUserId(userId);
          setGeozones(response);
        };
        getGeozones(userId);
      }
    });
    handleCloseModalMap();
    handleClose();
  };

  const handleRemove = () => {
    fetch(`/api/geofences/${objectId}`, { method: "DELETE" }).then((response) => {
      if (response.ok) {
        const getGeozones = async (userId) => {
          const response = await service.getGeozonesByUserId(userId);
          setGeozones(response);
        };
        getGeozones(userId);
      }
    });
    handleCloseRemoveDialog();
  };

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
    setObjectId('');
  };

  const handleGeozoneProperties = (property, data, attribute = false) => {
    let geozoneCopy = { ...geozone };
    if (attribute) {
      geozoneCopy.attributes[property] = data;
    } else {
      geozoneCopy[property] = data;
    }
    setGeozone(geozoneCopy);
  };

  return (
    <div className={classes.root}>
      <div className="title-section">
        <h2>{t("sharedGeofences")}</h2>
        <Divider />
      </div>

      <Container>
        <Button
          style={{ margin: "10px 0px" }}
          type="button"
          color="primary"
          variant="outlined"
          onClick={handleClickOpen}
        >
          <AddIcon color="primary" />
          {t("sharedAdd")}
        </Button>
        <Divider />
      </Container>
      <div className={classes.geozonesContainer}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>{t("sharedName")}</TableCell>
                <TableCell>{t("sharedDescription")}</TableCell>
                <TableCell align="center"/>
                </TableRow>
              </TableHead>
              <TableBody>
              {geozones.sort((f,s) => {
                 return f.id - s.id
               }).map((geozone, index) => (
                <TableRow key={index}>
                  <TableCell>{geozone.name}</TableCell>
                  <TableCell>{`${geozone.description ? geozone.description : "Undefined"}`}</TableCell>
                  <TableCell style={{display: 'flex', justifyContent: 'center'}} align="center">
                          <Button title={t('sharedEdit')}
                                  onClick={() => handleClickOpenEditModal(geozone)}
                                  >
                          <EditTwoToneIcon 
                          style={{fontSize: window.innerWidth > 767 ? '19px' : ''}}
                          />
                          </Button>
                          <Button title={t('sharedRemove')}
                                  onClick={() => handleOpenRemoveDialog(geozone.id)}                                  
                                  >
                          <DeleteTwoTone 
                          style={{fontSize: window.innerWidth > 767 ? '19px' : ''}}
                          />
                          </Button>
                  </TableCell>
                </TableRow>                 
               ))}
              </TableBody>
            </Table>
        </div>

      {/*Modal Add New Geozone*/}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {` Agregar nueva Geozona `}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form className={classes.rootmodal} noValidate autoComplete="off">
            <TextField
              style={{display: 'none'}}
              id="outlined-basic"
              value={`${geozones.length + 1}`}
              label="Id"
              name="id"
              variant="outlined"
              disabled
            />
            <br />
            <TextField
              id="outlined-basic"
              value={geozone.name}
              name="name"
              label={t("sharedName")}
              variant="outlined"
              onChange={(event) =>
                handleGeozoneProperties("name", event.target.value)
              }
            />
            <br />
            <TextField
              id="outline)d-basic"
              value={geozone.description}
              name="description"
              label={t("sharedDescription")}
              variant="outlined"
              onChange={(event) =>
                handleGeozoneProperties("description", event.target.value)
              }
            />
            <br />
            <Button
              variant="outlined"
              color="default"
              onClick={handleClickOpenModalMap}
            >
              {t("sharedArea")}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAdd}
            disabled={geozone.name !== "" && geozone.area !== "" ? false : true}
            autoFocus
            color="primary"
          >
            {t("sharedSave")}
          </Button>
        </DialogActions>
      </Dialog>

      {/*Modal Edit Geozone*/}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openEditModal}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {t("sharedEdit")}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form className={classes.rootmodal} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              value={geozone.name}
              name="name"
              label={t("sharedName")}
              variant="outlined"
              onChange={(event) =>
                handleGeozoneProperties("name", event.target.value)
              }
            />
            <br />
            <TextField
              id="outline)d-basic"
              value={geozone.description}
              name="description"
              label={t("sharedDescription")}
              variant="outlined"
              onChange={(event) =>
                handleGeozoneProperties("description", event.target.value)
              }
            />
            <br />
            <Button
              variant="outlined"
              color="default"
              onClick={handleClickOpenModalMap}
            >
              {t("sharedArea")}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleEdit(geozone.id)}
            autoFocus
            color="primary"
          >
            {t("sharedEdit")}
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <Dialog
          fullScreen
          open={openModalMap}
          onClose={handleCloseModalMap}
          TransitionComponent={Transition}
        >
          <div>
            <div className={classes.rootMap}>
              <CssBaseline />
              {isViewportDesktop ? (
                <div>
                  <AppBar position="fixed" className={classes.appBarMap}>
                    <Toolbar>
                      <Typography variant="h6" className={classes.title}>
                        {t("sharedArea")}
                      </Typography>
                      <Button
                        autoFocus
                        style={{ flex: "1" }}
                        color="inherit"
                        onClick={handleCloseModalMap}
                      >
                        {t("sharedSave")}
                      </Button>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseModalMap}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                  <Drawer
                    className={classes.drawerMap}
                    variant="permanent"
                    classes={{
                      paper: classes.drawerPaperMap,
                    }}
                  >
                    <Toolbar />
                    <div className={classes.drawerContainerMap}>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          {t("reportChartType")}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={geozoneType}
                          onChange={handleChangeGeozoneType}
                          label={t("reportChartType")}
                        >
                          <MenuItem value={"0"}>{t("mapShapeCircle")}</MenuItem>
                          <MenuItem value={"1"}>
                            {t("mapShapePolygon")}
                          </MenuItem>
                          <MenuItem value={"2"}>
                            {t("mapShapePolyline")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <Divider />
                      <List>
                        <ListItem
                          style={{ fontSize: "20px", color: "cadetblue" }}
                        >
                          <strong>Attributes</strong>
                        </ListItem>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <InputLabel
                            style={{ top: `${color === "" ? "" : "-11%"}` }}
                            id="demo-simple-select-outlined-label"
                          >
                            {t("attributeColor")}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={color}
                            style={{ backgroundColor: color + "88" }}
                            label={t("attributeColor")}
                            defaultValue={"#000000"}
                          >
                            <MenuItem>
                              <CirclePicker
                                width="220px"
                                colors={["#000000", "#993300", "#333300", "#003300",
                                  "#003366", "#000080", "#333399", "#333333", "#FF6600",
                                  "#808000", "#008000", "#008080", "#0000FF", "#666699",
                                  "#808080", "#FF0000", "#FF9900", "#99CC00", "#33CCCC",
                                  "#3366FF", "#800080", "#969696", "#FF00FF", "#FFCC00",
                                  "#FFFF00", "#00FF00", "#00FFFF", "#00CCFF", "#993366",
                                  "#C0C0C0", "#FF99CC", "#FFCC99", "#FFFF99",
                                ]}
                                colorSize={35}
                                onChangeComplete={(color) => {
                                  setColor(color.hex);
                                  handleGeozoneProperties(
                                    "color",
                                    color.hex,
                                    true
                                  );
                                }}
                              />
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          style={{ width: "187px" }}
                          className={classes.formControl}
                          id="outlined-number"
                          label={t("attributeSpeedLimit")}
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          onChange={(event) =>
                            handleGeozoneProperties(
                              "speedLimit",
                              Number(event.target.value),
                              true
                            )
                          }
                        />
                        <TextField
                          style={{ width: "187px" }}
                          className={classes.formControl}
                          id="outlined-number"
                          label={t("attributePolylineDistance")}
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(event) =>
                            handleGeozoneProperties(
                              "polylineDistance",
                              Number(event.target.value),
                              true
                            )
                          }
                          variant="outlined"
                        />
                      </List>
                    </div>
                  </Drawer>
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <AppBar
                    position="fixed"
                    className={clsx(classes.appBarPersistent, {
                      [classes.appBarShift]: openPer,
                    })}
                  >
                    <Toolbar>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerShow}
                        edge="start"
                        className={clsx(
                          classes.menuButton,
                          openPer && classes.hide
                        )}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography
                        style={{ display: `${openPer ? "none" : "block"}` }}
                        variant="h6"
                        noWrap
                      >
                        {t("sharedArea")}
                      </Typography>
                      <Button
                        autoFocus
                        style={{ flex: "1" }}
                        color="inherit"
                        onClick={handleCloseModalMap}
                      >
                        {openPer ? "" : `${t("sharedSave")}`}
                      </Button>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseModalMap}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>

                  <Drawer
                    className={classes.drawerMap}
                    variant="persistent"
                    anchor="left"
                    open={openPer}
                    classes={{
                      paper: classes.drawerPaperMap,
                    }}
                  >
                    <div className={classes.drawerHeader}>
                      <IconButton onClick={handleDrawerShow}>
                        {theme.direction === "ltr" ? (
                          <ChevronLeftIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </IconButton>
                      <Divider />
                    </div>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        {t("reportChartType")}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={geozoneType}
                        onChange={handleChangeGeozoneType}
                        label={t("reportChartType")}
                      >
                        <MenuItem value={"0"}>{t("mapShapeCircle")}</MenuItem>
                        <MenuItem value={"1"}>{t("mapShapePolygon")}</MenuItem>
                        <MenuItem value={"2"}>{t("mapShapePolyline")}</MenuItem>
                      </Select>
                    </FormControl>
                    <Divider />
                    <List>
                      <ListItem
                        style={{ fontSize: "20px", color: "cadetblue" }}
                      >
                        <strong>Attributes</strong>
                      </ListItem>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel
                          style={{ top: `${color === "" ? "" : "-11%"}` }}
                          id="demo-simple-select-outlined-label"
                        >
                          Color
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={color}
                          style={{ backgroundColor: color + "88" }}
                          label={t("attributeColor")}
                          defaultValue={"#000000"}
                        >
                          <MenuItem>
                            <CirclePicker
                              width="220px"
                              colors={[
                                "#000000",
                                "#993300",
                                "#333300",
                                "#003300",
                                "#003366",
                                "#000080",
                                "#333399",
                                "#333333",
                                "#800000",
                                "#FF6600",
                                "#808000",
                                "#008000",
                                "#008080",
                                "#0000FF",
                                "#666699",
                                "#808080",
                                "#FF0000",
                                "#FF9900",
                                "#99CC00",
                                "#339966",
                                "#33CCCC",
                                "#3366FF",
                                "#800080",
                                "#969696",
                                "#FF00FF",
                                "#FFCC00",
                                "#FFFF00",
                                "#00FF00",
                                "#00FFFF",
                                "#00CCFF",
                                "#993366",
                                "#C0C0C0",
                                "#FF99CC",
                                "#FFCC99",
                                "#FFFF99",
                              ]}
                              colorSize={35}
                              onChangeComplete={(color) => {
                                setColor(color.hex);
                              }}
                            />
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        style={{ width: "187px" }}
                        className={classes.formControl}
                        id="outlined-number"
                        label={t("attributeSpeedLimit")}
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                      />
                      <TextField
                        style={{ width: "187px" }}
                        className={classes.formControl}
                        id="outlined-number"
                        label={t("attributePolylineDistance")}
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                      />
                    </List>
                  </Drawer>
                </div>
              )}

              {isViewportDesktop ? (
                <main className={classes.contentMap}>
                  {geozoneType && (
                    <DrawableMap
                      geozoneType={geozoneType}
                      color={color}
                      addGeozoneProperty={handleGeozoneProperties}
                      geozone={geozone}
                    />
                  )}
                </main>
              ) : (
                <div style={{ display: "flex" }}>
                  <main
                    className={clsx(classes.contentPer, {
                      [classes.contentShift]: openPer,
                    })}
                  >
                    {/*<div className={classes.drawerHeader}/>*/}
                    {geozoneType && (
                      <DrawableMap
                        geozoneType={geozoneType}
                        color={color}
                        addGeozoneProperty={handleGeozoneProperties}
                        geozone={geozone}
                      />
                    )}
                  </main>
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </div>
      <div>
            <Dialog
            open={openRemoveDialog}
            onClose={handleCloseRemoveDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-remove-user">{t('settingsUser')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {t('sharedRemoveConfirm')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseRemoveDialog} color="primary">
                {t('sharedCancel')}
                </Button>
                <Button onClick={handleRemove} color="primary" autoFocus>
                {t('sharedRemove')}
                </Button>
            </DialogActions>
            </Dialog>
      </div>
    </div>
  );
}
