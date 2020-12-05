import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ReportsConfig from "./ReportsConfig";
import * as service from "../utils/serviceManager";
import { devices } from "./ReportsConfig";
import reportsRouteStyles from "./styles/ReportsRouteStyles";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const useStyles = reportsRouteStyles;

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiAccordionDetails);

export default function ReportsRoute({
  getDevices,
  devicesArray,
  typeArray,
  from,
  to,
}) {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // const getReportEvents = async () => {
  //   await fetch(
  //     `api/reports/events?deviceId=${[deviceNameSelected]}&type=${[typeNameSelected]}&from=${fromDateTime}:00Z&to=${toDateTime}:00Z`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //     }})
  //     .then(response => console.log(response))
  // }

  return (
    <div>
      {/*<Button onClick={() => getSomething()}>GET</Button>*/}
      <div>
        <ReportsConfig />
      </div>
      <div style={{ marginTop: "1%" }}>
        {devices.map((device, index) => (
          <Accordion
            square
            expanded={expanded === `panel${index + 1}`}
            onChange={handleChange(`panel${index + 1}`)}
          >
            <AccordionSummary
              aria-controls={`panel${index + 1}d-content`}
              id={`panel${index + 1}d-header`}
            >
              <Typography>
                <strong>{/*#{device.id} - {device.name}*/}</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Container>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha y Hora</TableCell>
                      <TableCell>Tipo de Notificación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Container>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
