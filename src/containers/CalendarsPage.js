import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as service from "../utils/serviceManager";
import { TableContainer } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import { DeleteTwoTone } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import calendarsPageStyle from "./styles/CalendarsPageStyle";

const useStyles = calendarsPageStyle;

const CalendarsPage = () => {
  const classes = useStyles();
  const userId = useSelector((state) => state.session.user.id);
  const [calendars, setCalendars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const fileInput = React.createRef();
  const [selectedFile, setSelectedFile] = useState("");

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleCancelEdit = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    getCalendars(userId);
  }, []);

  const getCalendars = async (userId) => {
    const response = await service.getCalendarsByUserId(userId);
    setCalendars(response);
  };

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handlePost = () => {
    alert("ADDED");
  };

  const handleEdit = () => {
    alert("EDITED");
  };

  const handleRemove = () => {
    alert("REMOVED");
  };

  useEffect(() => {
    const handleSubmit = (event) => {
      event.preventDefault();
      setSelectedFile(`${fileInput.current.files[0].name}`);
    };
  }, [fileInput]);

  return (
    <div className={classes.root}>
      <div style={{ marginTop: "5%" }} className="title-section">
        <h2>{t("sharedCalendars")}</h2>
        <Divider />
      </div>
      <div>
        <Button
          onClick={() => handleShowModal()}
          style={{ margin: "15px" }}
          variant="outlined"
          color="primary"
        >
          {t("sharedAdd")}
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {calendars.map((el, index) => (
              <TableRow key={el.id}>
                <TableCell>{el.name}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleShowModal(el)}
                    title="Editar Mantenimiento"
                  >
                    <EditTwoToneIcon />
                  </Button>
                  <Button
                    onClick={() => handleRemove(el.id)}
                    title="Eliminar Mantenimiento"
                  >
                    <DeleteTwoTone />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*MODAL ADD*/}
      <div>
        <Dialog
          open={showModal}
          onClose={handleShowModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleCancelEdit}>
            {t("sharedAdd")}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCancelEdit}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form>
              <Table>
                <TableRow>
                  <TableCell>
                    <TextField
                      id="outlined-basic"
                      value={name}
                      name="name"
                      label={`${t("sharedName")}`}
                      variant="outlined"
                      inputProps={{
                        name: "name",
                        shrink: true,
                      }}
                      onChange={handleChangeName}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <input type="file" ref={fileInput} />
                  </TableCell>
                </TableRow>
              </Table>
            </form>
          </DialogContent>
          <br />

          {/*{!elem ?*/}
          <DialogActions>
            <Button
              style={{
                display: "flex",
                position: "absolute",
                left: "7%",
              }}
              // onClick={() => handleShowAttributes()} variant="outlined"
              color="primary"
            >
              ATTRIBUTES
            </Button>
            <Button onClick={handleShowModal} color="primary">
              Cancelar
            </Button>
            <Button onClick={handlePost} color="primary" autoFocus>
              Guardar
            </Button>
          </DialogActions>
          {/*:*/}
          {/*<DialogActions>*/}
          {/*  <Button style={{*/}
          {/*    display: 'flex',*/}
          {/*    position: 'absolute',*/}
          {/*    left: '7%',*/}
          {/*    bottom: '2%'*/}
          {/*  }}*/}
          {/*          // onClick={() => handleShowAttributes()} variant="outlined"*/}
          {/*          color="primary">*/}
          {/*    ATTRIBUTES*/}
          {/*  </Button>*/}
          {/*  <Button onClick={handleCancelEdit} color="primary">*/}
          {/*    Cancelar*/}
          {/*  </Button>*/}
          {/*  <Button onClick={() => handleEdit()} color="primary" autoFocus>*/}
          {/*    Editar*/}
          {/*  </Button>*/}
          {/*</DialogActions>*/}
          {/*}*/}
        </Dialog>
      </div>
    </div>
  );
};

export default CalendarsPage;
