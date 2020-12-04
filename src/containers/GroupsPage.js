import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import withWidth from "@material-ui/core/withWidth";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import t from "../common/localization";
import groupsPageStyle from "./styles/GroupsPageStyle";

const styles = (theme) => ({});

const useStyles = groupsPageStyle;

function createData(field, userData) {
  return { field, userData };
}

const rows = [
  createData("Id:", ""),
  createData("Name:", ""),
  createData("Groupid:", ""),
  createData("Attributes", ""),
];

const GroupsPage = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.GroupsPageSize}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow></TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.field}>
                  <TableCell component="th" scope="row">
                    {row.field}
                  </TableCell>
                  <TableCell align="left">{row.userData}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default withWidth()(withStyles(styles)(GroupsPage));
