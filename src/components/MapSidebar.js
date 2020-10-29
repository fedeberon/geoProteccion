import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import t from '../common/localization';

const useStyles = makeStyles(theme => ({
}));

const MapSidebar = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(undefined);
    const handleClose = () => {
        setAnchorEl(undefined);
      };

const classes = useStyles();


  return (
    <div>
      <Menu
        open={props.open}
        id="simple-menu"
        keepMounted
        open={Boolean(anchorEl)}
        onClose={props.handleMenu}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
export default MapSidebar;
