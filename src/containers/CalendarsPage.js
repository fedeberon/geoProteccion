import React from 'react';
import MainToolbar from '../components/MainToolbar';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import { useHistory } from 'react-router-dom';

const styles = theme => ({});

const CalendarsPage = () => {
  const history = useHistory();

  return (
    <div>
      <MainToolbar history={history} />
    </div>
  );
}

export default withWidth()(withStyles(styles)(CalendarsPage));