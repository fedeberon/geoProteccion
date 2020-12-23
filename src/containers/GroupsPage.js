import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import t from "../common/localization";
import * as service from "../utils/serviceManager";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import groupsPageStyle from "./styles/GroupsPageStyle";
import AddIcon from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import GroupsAttributesDialog from '../components/GroupsAttributesDialog';
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import {DeleteTwoTone} from "@material-ui/icons";

const useStyles = groupsPageStyle;

const GroupsPage = () => {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [dialogAttributes, setDialogAttributes] = useState(false);
  const [newGroup, setNewGroup] = useState({
    id: '',
    name: '',
    groupId: '',
    attributes: {},
  })

  const handleOpenDialog = (group) => {
    setOpenAddGroup(true);
    if(group){
      setNewGroup(group);
    } else {
      setNewGroup({id: '',
      name: '',
      groupId: '',
      attributes: {},
    });
    }
  };

  const handleOpenDialogAttributes = () => {
    setDialogAttributes(true);
  }
  const handleCloseDialogAttributes = () => {
    setDialogAttributes(false);
  }

  const handleCloseAddGroup = () => {
    setOpenAddGroup(false);
  };

  const getGroups = async () => {
    let response = await service.getGroups();
    setGroups(response);
  };

  useEffect(() => {    
    getGroups();
  }, []);

  const showExtraData = () => {
    setExtraData(!extraData);
  };

  const savingAttributes = (objeto) => {
    setNewGroup({
      ...newGroup,
      attributes: objeto,
    })
  }

  const handleSaveGroup = async() => {
    const object = {};
    if(newGroup.id){
    object.id = newGroup.id;}
    object.name = newGroup.name;
    object.groupId = newGroup.groupId;
    object.attributes = newGroup.attributes;

    console.log(object)

    if(newGroup.id){
      await fetch(`api/groups/${newGroup.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
                  'Accept': 'application/json'},
        body: JSON.stringify(object)
        }).then(response => response.json())
        .then(data => console.log(data))
    } else {
      await fetch(`api/groups`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Accept': 'application/json'},
        body: JSON.stringify(object)
        }).then(response => response.json())
        .then(data => console.log(data))
    }    
    getGroups();
    setOpenAddGroup(false);
  }

  const handleRemove = (id) => {
    let option = confirm(`¿${t('sharedRemove')} id ${id}?`);
    if(option){
      fetch(`api/groups/${id}`, {method: 'DELETE'})
        .then(response => {
          if(response.ok){
            getGroups();
          }
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <div>
      <div className="title-section">
        <h2>{t("settingsGroups")}</h2>
        <Divider />
      </div>
      <Container>
        <Button
          style={{ margin: "10px 0px" }}
          type="button"
          color="primary"
          variant="outlined"
          onClick={() => handleOpenDialog()}
        >
          <AddIcon color="primary" />
          {t("sharedAdd")}
        </Button>
        <Divider />
      </Container>
      <div className={classes.containerTable}>
        <TableContainer component={Paper}>        
          <Table >
            <TableHead>
              <TableRow>
                <TableCell>{t('sharedName')}</TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group, index)=> (
                <TableRow key={index} hover>
                  <TableCell>{group.name}</TableCell>
                  <TableCell align="right">
                  <Button className={classes.buttonFunctions} 
                  onClick={() => handleOpenDialog(group)}
                  title={t('sharedEdit')}
                  >
                    <EditTwoToneIcon/>
                  </Button>
                  <Button className={classes.buttonFunctions} 
                  onClick={() => handleRemove(group.id)} title={t('sharedRemove')}
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

      {/*Dialog Add Group*/}
      <div>
      <Dialog
        open={openAddGroup}
        onClose={handleCloseAddGroup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('settingsGroups')}
        <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleCloseAddGroup}
              >
                <CloseIcon />
              </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="xs" className={classes.container}>
                  <form>
                    <TextField
                      margin="normal"
                      fullWidth
                      value={newGroup.name}
                      onChange={(event) =>
                        setNewGroup({ ...newGroup, name: event.target.value })
                      }
                      label={t("sharedName")}
                      variant="outlined"
                    />
                  </form>
                  <Button
                  style={{ margin: "10px 0px" }}
                  onClick={() => handleOpenDialogAttributes()}
                  fullWidth={true}
                  variant="outlined"
                  color="primary"
                >
                  {t('sharedAttributes')}
                </Button>
                  <Button
                    style={{ margin: "10px 0px" }}
                    onClick={showExtraData}
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    >
                      {t('sharedExtra')}
                  </Button>
                  <form style={{ display: `${extraData ? "block" : "none"}` }}>
                    <Select
                      native
                      fullWidth
                      value={newGroup.groupId}
                      onChange={(event) =>
                        setNewGroup({
                          ...newGroup,
                          groupId: event.target.value,
                        })
                      }
                      name="groupid"
                      type="text"
                      variant="outlined"
                    >
                      <option aria-label="none" value="0" />
                      {groups.map((group, index) => (
                        <option key={index} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </Select>
                  </form>
            </Container>
          </DialogContent>
        <DialogActions>
          <Button 
          onClick={handleCloseAddGroup} color="primary">
            {t('sharedCancel')}
          </Button>
          <Button disabled={!newGroup.name}
           onClick={handleSaveGroup} color="primary" autoFocus>
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      <GroupsAttributesDialog 
      data={newGroup.attributes}
      savingAttributes={savingAttributes}
      open={dialogAttributes} 
      close={handleCloseDialogAttributes}
     />
    </div>
  );
};

export default GroupsPage;
