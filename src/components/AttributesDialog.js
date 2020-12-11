import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import t from "../common/localization";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

export default function AttributesDialog({open, handleClose}) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);

  useEffect(()=>{
    setOpenDialog(open);
  },[open])

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialog}
        onClose={() => handleClose()}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">
            {t('sharedAttributes')}
            <IconButton aria-label="close" className={classes.closeButton}
                        onClick={handleShowComputedAttribute}
                        >
              <CloseIcon/>
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <div>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <Button>Agregar</Button>
                <Button>Editar</Button>
                <Button>Eliminar</Button>
            </ButtonGroup>
            </div>
            <div>
                <Container component={Paper}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Valor</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/*Funcion*/}
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>                    
                </Container>
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Close
          </Button>
          <Button onClick={() => handleClose()} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}