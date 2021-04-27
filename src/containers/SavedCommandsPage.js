import React, { useEffect, useState } from "react";
import * as service from "../utils/serviceManager";
import { useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import t from "../common/localization";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { DeleteTwoTone, Label } from "@material-ui/icons";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import SC from "../common/SavedCommandsTypes.json";
import SavedCommands from '../components/SavedCommands';
import notificationsPageStyle from "./styles/NotificationsPageStyle";

const useStyles = notificationsPageStyle;

const styles = (theme) => ({
  rootNotification: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

const SavedCommandsPage = () => {
  const classes = useStyles();
  const userId = useSelector((state) => state.session.user.id);
  const [ savedCommands, setSavedCommands ] = useState([]);
  const [ openModalCommand, setOpenModalCommand ] = useState(false);
  const [ commandData, setCommandData ] = useState(undefined);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [objectId, setObjectId] = useState('');

  const handleOpenRemoveDialog = (objectId) => {
    setOpenRemoveDialog(true);
    setObjectId(objectId)
  };

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
  };

  const getSavedCommands = async () => {
    const response = await service.getCommands();
    setSavedCommands(response);
  };

  useEffect(()=> {
    getSavedCommands();
  },[]);

  const handleOpenCommandModal = (object) => {
    setOpenModalCommand(true);
    if(object && object.id >= 0){
      setCommandData(object);
    } else {
      setCommandData();
    }
  };

  const handleCloseCommandModal = (response) => {
    setOpenModalCommand(false);
    if(response !== undefined){
      setTimeout(()=> {
        getSavedCommands();
      },1500);      
    }
  };

  const removeSavedCommands = () => {
      fetch(`api/commands/${objectId}`, {
        method: 'DELETE',
      }).then(response => {
        if(response.status === 204){
          getSavedCommands();
        } else {          
          alert('error');
        }
      })
      handleCloseRemoveDialog();
  };

  const getCommandTypeName = (type) => {
    let object = SC.SC.find((elem) => elem.type === type);
    if(object)
    return object.name
  }

  return (
    <>
      <div className={classes.root}>
        <div className="title-section">
          <h2>{t("sharedSavedCommands")}</h2>
          <Divider />
        </div>
        <Container>
          <Button
            style={{ margin: "10px 0px" }}
            type="button"
            color="primary"
            variant="outlined"
            onClick={handleOpenCommandModal}>
            <AddIcon color="primary" />
            {t("sharedAdd")}
          </Button>
        </Container>
        <div>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>{t("sharedDescription")}</TableCell>
                <TableCell>{t("sharedType")}</TableCell>
                <TableCell>{t("commandSendSms")}</TableCell>
                <TableCell align="center"/>
                </TableRow>
              </TableHead>
              <TableBody>
               {savedCommands.sort((f,s) => {
                 return f.id - s.id
               }).map((object,index) => (
                <TableRow key={index}>
                  <TableCell>{object.description}</TableCell>
                  <TableCell>{t(`${getCommandTypeName(object.type)}`)}</TableCell>
                  <TableCell>{t(`${object.textChannel}`)}</TableCell>
                  <TableCell style={{display: 'flex', justifyContent: 'center'}} align="center">
                          <Button title={t('sharedEdit')}
                                  onClick={() => handleOpenCommandModal(object)}
                                  >
                          <EditTwoToneIcon 
                          style={{fontSize: window.innerWidth > 767 ? '19px' : ''}}
                          />
                          </Button>
                          <Button title={t('sharedRemove')}
                                  onClick={() => handleOpenRemoveDialog(object.id)}
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
                <Button onClick={removeSavedCommands} color="primary" autoFocus>
                {t('sharedRemove')}
                </Button>
            </DialogActions>
            </Dialog>
        </div>

      
        {/*SAVED COMMANDS MODAL-COMPONENT*/}
        <div>
            <SavedCommands 
            open={openModalCommand} 
            data={commandData} 
            handleCloseModal={handleCloseCommandModal}
            />
         </div>
      </div>
    </>
  );
}

export default SavedCommandsPage;