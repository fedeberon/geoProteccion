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
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
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


const AttributesDialog = ({open, close, savingAttributes, data}) => {

    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [attributes, setAttributes] = useState({}); 
    const [title, setTitle] = useState(`${t('sharedAdd')}`);
    const [editRow, setEditRow] = useState(false); 
    const [newAttribute, setNewAttribute] = useState({
      name: '',
      value: ''
    }); 

    useEffect(()=>{
     setOpenDialog(open);
    },[open]);

    const handleClose = () => {
     setEditRow(false);
     setNewAttribute({name: '', value: ''});
     close();
    };   
    
    const handleCloseAttributes = () => {
      close();
    }

    useEffect(()=> {
      setAttributes(data);
    },[data])

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

    //Send attributes to parent component
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
                onClick={handleCloseAttributes}
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
                        autoComplete="off"
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
                        autoComplete="off"
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
                      backgroundColor: 'rgb(135 137 220)', 
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
                  }}>{t('sharedCancel')}</Button>
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
                {attributes && Object.entries(attributes).map((attribute, index) => (
                  <TableRow key={attribute[0]} >
                  <TableCell title={`${t('sharedEdit')}`} style={{cursor: attribute[0] === 'circuitBreaker' || attribute[0] === 'alarm' ? '' : 'pointer'}}
                  onClick={() => {
                    if(!(attribute[0] === 'circuitBreaker' || attribute[0] === 'alarm'))
                    handleEdit(attribute)}
                  }>
                    {attribute[0]}
                    {/* {t(`${attribute[0]}`)} */}
                  </TableCell>
                  <TableCell title={`${t('sharedEdit')}`} style={{cursor: attribute[0] === 'circuitBreaker' || attribute[0] === 'alarm' ? '' : 'pointer'}}
                  onClick={() => {
                    if(!(attribute[0] === 'circuitBreaker' || attribute[0] === 'alarm'))
                    handleEdit(attribute)}
                  }>
                    {attribute[1]}
                    {/* {t(`${attribute[1]}`)} */}
                  </TableCell>
                  <TableCell align="right">
                    <Button title={t('sharedRemove')} disabled={attribute[0] === 'circuitBreaker' || attribute[0] === 'alarm'}>
                      <DeleteTwoTone title={`${t('sharedRemove')}`} 
                      id="rmv-button"
                      onClick={() => {
                        if(!(attribute[0] === 'circuitBreaker' || attribute[0] === 'alarm'))
                        removeAttribute(attribute)}
                      }
                      />
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

export default AttributesDialog;