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
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import * as service from "../utils/serviceManager";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import {DeleteTwoTone} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
        container: {
        marginTop: theme.spacing(2),
        height: "60%",
    },
        formControlAttribute: {
        width: '38%', 
        marginLeft: '10px',
        [theme.breakpoints.up("md")]: {
            width: '42%', 
        },
    },
}))


const GroupsAttributesDialog = ({open, close, savingAttributes}) => {

    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [newAttribute, setNewAttribute] = useState({}); 
    const [attributes, setAttributes] = useState({}); 
    const [title, setTitle] = useState(`${t('sharedAdd')}`);
    const [editRow, setEditRow] = useState(false); 

    useEffect(()=>{
     setOpenDialog(open);
    },[open]);

    const handleClose = () => {
     setEditRow(false);
     setNewAttribute({name: '', value: ''});
     setAttributes({});
     close();
    };    

    useEffect(()=> {
      console.log(attributes);
    },[newAttribute])

    const handleEdit = (attribute) => {
      setNewAttribute({name: attribute[0], value: attribute[1]});
      setTitle(`${t('sharedEdit')}`);
      setEditRow(true);
    }
    
    const removeAttribute = (dato) => {    
      const copy = {...attributes}
      delete copy[dato[0]];
      setAttributes(copy);
    }

    const callFunction = () => {      
      setAttributes({
        ...attributes,
        [newAttribute.name]: newAttribute.value,
      });
      setTitle(`${t('sharedAdd')}`);
      setEditRow(false);
      setNewAttribute({name: '', value: ''});      
    }

    const handleSetAttributes = () => {
      savingAttributes(attributes);
      close();
    }

    return (
      
        <div>          
          <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{t('sharedAttributes')}
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
              <div style={{display: 'inline-block'}}>            
                <div style={{marginBottom: '25px', maxHeight: '200px'}}> 
                  <form style={{borderBottomStyle: 'inset', borderTopStyle: 'outset'}}>
                    <FormControl                    
                      variant="outlined"
                      fullWidth={true}
                      className={classes.formControlAttribute}
                    >
                      <TextField
                        style={{marginTop: '5px', marginBottom: '5px'}}                        
                        id="outlined-margin-dense-name"
                        margin="dense"
                        variant="outlined"
                        value={newAttribute.name}
                        placeholder={`${editRow ? `${newAttribute.name}` : `${t('sharedName')}`}`}
                        disabled={editRow}
                        name="name"
                        onChange={(e) =>
                          setNewAttribute({
                            ...newAttribute,
                            name: e.target.value })
                        }                        
                      />                  
                    </FormControl>
                    <FormControl
                      style={{marginRight: '5px'}}
                      variant="outlined"
                      fullWidth={true}
                      className={classes.formControlAttribute}
                    >
                      <TextField
                        style={{marginTop: '5px', marginBottom: '5px'}}
                        placeholder={t('stateValue')}
                        id="outlined-margin-dense-value"
                        margin="dense"
                        variant="outlined"
                        value={newAttribute.value}
                        name="value"
                        onChange={(e) =>
                          setNewAttribute({
                            ...newAttribute,
                            value: e.target.value })
                        }                    
                      />                  
                    </FormControl>
                    <Button  
                      onClick={() => callFunction()}
                      title={title}
                      disabled={!newAttribute.name || !newAttribute.value}
                      style={{
                      backgroundColor: '#82f582', 
                      minWidth: '40px', 
                      display: 'inline-block', 
                      margin: '7px 2px'
                      }}
                      variant="outlined"
                    >
                      <i style={{fontSize: '17px', color: 'white'}} className="fas fa-plus"></i>
                    </Button>
                        
                  </form>
                </div>    
                <div style={{display: `${editRow ? 'flex' : 'none'}`}}>
                  <Button variant="outlined" size="small" color="primary"
                   style={{margin: '0 auto'}} onClick={function() {
                    setEditRow(false);
                    setNewAttribute({name: '', value: ''});
                  }}>Cancelar Edicion</Button>
                </div>      
            </div>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('sharedName')}</TableCell>
                  <TableCell>{t('stateValue')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>                
                {Object.entries(attributes).map((attribute, index) => (
                  <TableRow key={attribute[0]}>
                  <TableCell title={`${t('sharedEdit')}`} style={{cursor: 'pointer'}}
                  onClick={() => handleEdit(attribute)}
                  >{attribute[0]}
                  </TableCell>
                  <TableCell title={`${t('sharedEdit')}`} style={{cursor: 'pointer'}}
                  onClick={() => handleEdit(attribute)}
                  >{attribute[1]}
                  </TableCell>
                  <TableCell align="right">
                    <Button title={t('sharedRemove')}
                            // className={classes.buttonFunctions} onClick={() => handleRemove(el.id)} title={t('sharedRemove')}
                            >
                      <DeleteTwoTone title={`${t('sharedRemove')}`} 
                      id="rmv-button"onClick={() => removeAttribute(attribute)}/>
                    </Button> 
                  </TableCell>
                </TableRow>
                ))}                      
             </TableBody>       
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('sharedCancel')}
          </Button>
          <Button onClick={handleSetAttributes} color="primary" autoFocus>
            {t('sharedSave')}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
}

export default GroupsAttributesDialog;