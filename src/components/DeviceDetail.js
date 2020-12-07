import React, { useEffect, useLayoutEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as service from "../utils/serviceManager";
import t from "../common/localization";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import deviceDetailStyles from "./styles/DeviceDetailStyles";

const useStyles = deviceDetailStyles;

const DeviceDetail = (props) => {
  let { id } = useParams();
  const devices = useSelector(
    (state) => Object.values(state.devices.items),
    shallowEqual
  );
  const positions = useSelector((state) => state.positions.items, shallowEqual);
  const classes = useStyles();
  const [deviceFound, setDeviceFound] = useState({});

  useEffect(() => {
    const result = devices.find((el) => el.id === parseInt(id));
    setDeviceFound(result);
  }, [devices]);

  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm" style={{ top: "10%", position: "relative" }}>
          <div className="title-section">
            <h2>{t("sharedDevice")}</h2>
            <Divider />
          </div>
          <div>
            <img
              className={classes.dashImg}
              alt=""
              src="https://i.pinimg.com/originals/ef/f2/91/eff29127abbf0d8e5e99cda29401fa7f.png"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "14px", color: "darkgray" }}>
              {t("deviceStatus")}:{" "}
              <span className={`status-${deviceFound.status}`}>
                {deviceFound.status}
              </span>
            </p>
            <p style={{ fontSize: "14px", color: "darkgray" }}>
              Car Type:
              <span style={{ color: "Black" }} className={classes.pos}>
                &nbsp;{deviceFound.name}
              </span>
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Car Informations</h3>
            <Button>View All</Button>
          </div>
          <div style={{ display: "flex" }}>
            <Card
              className={classes.root}
              variant="outlined"
              style={{ backgroundColor: "#5f85ca" }}
            >
              <CardContent>
                <IconButton style={{ backgroundColor: "cornflowerblue" }}>
                  <i
                    style={{ color: "whitesmoke" }}
                    className="fas fa-car-battery"
                  />
                </IconButton>
                <Typography
                  style={{ marginTop: "20px", color: "white" }}
                  variant="h5"
                  component="h2"
                >
                  219 {t("sharedVoltAbbreviation")}
                </Typography>
                <Typography
                  style={{ color: "white" }}
                  className={classes.pos}
                  color="textSecondary"
                >
                  Voltaje
                </Typography>
              </CardContent>
            </Card>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <IconButton style={{ backgroundColor: "cornflowerblue" }}>
                  <i
                    style={{ color: "whitesmoke" }}
                    className="fas fa-tachometer-alt"
                  />
                </IconButton>
                <Typography
                  style={{ marginTop: "20px" }}
                  variant="h5"
                  component="h2"
                >
                  {positions && positions[deviceFound.id]
                    ? positions[deviceFound.id].speed.toFixed(0)
                    : "0"}{" "}
                  Km/h
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  {t("positionSpeed")}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Container>
      </React.Fragment>
    </>
  );
};
export default DeviceDetail;
