import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import * as service from "../utils/serviceManager";
import { devices } from "./ReportsConfig";
import reportsRouteStyles from "./styles/ReportsRouteStyles";



const useStyles = reportsRouteStyles;



const ReportsTrips = ({data}) => {
  
  const [trips, setTrips] = useState([]);


  return (
    <div>
    
     
    </div>
  );
}

export default ReportsTrips;
