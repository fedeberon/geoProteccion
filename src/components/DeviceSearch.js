import { IconButton, InputBase, makeStyles, Paper } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "4px 4px",
    display: "flex",
    alignItems: "center",
    width: '76%',
    height: '50px',
    marginTop: '3%',
    marginLeft: '3%',
    position: 'fixed',
    left: '0px',
    [theme.breakpoints.up('md')]: {
      position: 'unset',
      marginTop: '1%',
    },
  },
  iconButton: {
    padding: 10
  },
}));

function DeviceSearch() {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.paper}>
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Buscar"
        inputProps={{ "aria-label": "search google maps" }}
      />
    </Paper>
  );
}

export default DeviceSearch;
