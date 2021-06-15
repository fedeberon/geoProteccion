import t from "../common/localization";
import circleToPolygon from "circle-to-polygon";
import { getCourse, getDateTime, getDateTimeDevices, speedConverter } from "./functions";

const typeRegEx = /(\w*)[ ]?[(]/;
const circlePositionRegEx = /[(](.*) (.*)[,]/;
const radiusRegEx = /[,][ ](.*)[)]/;
const polygonRegEx = /[(]{2}(.*)[)]{2}/;
const polylineRegEx = /[(]{1}(.*)[)]{1}/;
const typesArray = ["circle", "polygon", "linestring"];

const getGeozoneArea = (type, coordinates, radius) => {
  let areaString = "";
  let coordinatesString = "";

  if (type === "0") {
    coordinatesString = `(${coordinates[1]} ${coordinates[0]}, ${radius})`;
    areaString = `${typesArray[
      parseInt(type)
    ].toUpperCase()} ${coordinatesString}`;
  }
  if (type === "1") {
    coordinatesString = "((";
    coordinates[0].map((element, index) => {
      coordinatesString += `${index !== 0 ? " " : ""}${element[1]} ${
        element[0]
      }${index !== coordinates[0].length - 1 ? "," : ""}`;
    });
    coordinatesString += "))";
    areaString = `${typesArray[
      parseInt(type)
    ].toUpperCase()}${coordinatesString}`;
  }
  if (type === "2") {
    coordinatesString = "(";
    coordinates.map((element, index) => {
      coordinatesString += `${index !== 0 ? " " : ""}${element[1]} ${
        element[0]
      }${index !== coordinates.length - 1 ? "," : ""}`;
    });
    coordinatesString += ")";
    areaString = `${typesArray[
      parseInt(type)
    ].toUpperCase()} ${coordinatesString}`;
  }

  return areaString;
};

const calculatePolygonCenter = (coordinates) => {
  let north = -90;
  let west = -180;
  let south = 90;
  let east = 180;

  coordinates.map((e) => {
    let lng = parseFloat(e[0]);
    let lat = parseFloat(e[1]);

    west = lng > west ? lng : west;
    east = lng < east ? lng : east;
    north = lat > north ? lat : north;
    south = lat < south ? lat : south;
  });

  return {
    lng: (west + east) / 2,
    lat: (north + south) / 2,
  };
};

const calculateFurthestPoints = (coordinates) => {
  let north = -90;
  let west = -180;
  let south = 90;
  let east = 180;

  coordinates.map((e) => {
    let lng = parseFloat(e[0]);
    let lat = parseFloat(e[1]);

    west = lng > west ? lng : west;
    east = lng < east ? lng : east;
    north = lat > north ? lat : north;
    south = lat < south ? lat : south;
  });

  return [
    [west, south],
    [east, north],
  ];
};

const createMarkers = (positions) => {
  return {
    type: "FeatureCollection",
    features: positions.map((position) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [position.attributes.lng, position.attributes.lat],
      },
      properties: { ...position.properties },
    })),
  };
};

const createCircles = (geozones) => {
  return {
    type: "FeatureCollection",
    features: geozones.map((geozone) => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: circleToPolygon(
          [geozone.attributes.lng, geozone.attributes.lat],
          geozone.attributes.radius
        ).coordinates,
      },
      properties: { ...geozone.properties },
    })),
  };
};

const createLabels = (geozones) => {
  return {
    type: "FeatureCollection",
    features: geozones.map((geozone) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [geozone.attributes.lng, geozone.attributes.lat],
      },
      properties: { ...geozone.properties },
    })),
  };
};

const createPolygon = (geozone) => {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [geozone.attributes.coordinates],
    },
    properties: { ...geozone.properties },
  };
};

const createPolyline = (geozone) => {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: geozone.attributes.coordinates,
    },
    properties: { ...geozone.properties },
  };
};

const createCircle = (geozone) => {
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: circleToPolygon(
        [geozone.attributes.lng, geozone.attributes.lat],
        geozone.attributes.radius
      ).coordinates,
    },
    properties: { ...geozone.properties },
  };
};

const getDistanceBtwnCoords = (first, second) => {
  const R = 6371e3; // metres
  const φ1 = (first.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (second.lat * Math.PI) / 180;
  const Δφ = ((second.lat - first.lat) * Math.PI) / 180;
  const Δλ = ((second.lng - first.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

const getGeozoneType = (area) => {
  return area.match(typeRegEx)[1];
};

const getCircleAttributes = (device, attributes) => {
  let attributesCopy = { ...attributes };
  attributesCopy.lat = parseFloat(device.area.match(circlePositionRegEx)[1]);
  attributesCopy.lng = parseFloat(device.area.match(circlePositionRegEx)[2]);
  attributesCopy.radius = parseFloat(device.area.match(radiusRegEx)[1]);
  attributesCopy.color = device.attributes.color
    ? device.attributes.color
    : getRandomHex();
  return attributesCopy;
};

const getPolygonAttributes = (device, attributes) => {
  let attributesCopy = { ...attributes };
  const coordinates = device.area.match(polygonRegEx)[1].split(", ");
  coordinates.map((device) => {
    const latLng = device.split(" ");
    attributesCopy.coordinates.push(latLng.reverse());
  });
  attributesCopy.color = device.attributes.color
    ? device.attributes.color
    : getRandomHex();
  return attributesCopy;
};

const getPolylineAttributes = (device, attributes) => {
  let attributesCopy = { ...attributes };
  const polylineCoordinates = device.area.match(polylineRegEx)[1].split(", ");
  polylineCoordinates.map((device) => {
    const latLng = device.split(" ");
    attributesCopy.coordinates.push(latLng.reverse());
  });
  attributesCopy.color = device.attributes.color
    ? device.attributes.color
    : getRandomHex();
  return attributesCopy;
};

const getRandomHex = () => {
  return (
    "#" +
    Math.floor(Math.random() * 2 ** 24)
      .toString(16)
      .padStart(6, "0")
  );
};

function createFeature (devices, position, isViewportDesktop, server) {
    
  const device = devices[position.deviceId] || null;
  const name = device.attributes?.carPlate;
  const model = device.attributes.model;
  const carPlate = device.attributes.carPlate;
  const brand = device.attributes.brand;
  const year = device.attributes.year;
  const status = device.status;
  const lastUpdate = device.lastUpdate;
  const protocol = position.protocol;
  const speed = position.speed;
  const kilometers = position.attributes.totalDistance;
  const desktopView = isViewportDesktop;
  const showData = '';

  return {
    deviceId: device.id,
    type: device.category,
    lastUpdate: lastUpdate,
    course: position.course,
    status: device.status,
    name: device ? `${name}` : '',
    description: `<div class="${desktopView ? 'popup-map-div' : 'popup-map-div-mobile'}">
                      <div class="popup-map-header" id="header-${device.id}">
                          <ul class="head-list">
                              <li>
                                  <p style="${desktopView ? 'font-size: 16px' : 'font-size: 17px'}"><strong  class="bold">${carPlate + '</strong> - ' + name} </p>
                              </li>
                              <li>
                                  <p>${getDateTimeDevices(device.lastUpdate)}</p>
                              </li>
                              <!--
                              <li><p>${brand + ' ' + model + ' ' + year}</p></li>
                              <li><p>${protocol}</p></li>
                              -->
                              <li>
                                  <tr>
                                      <p><strong>${t("currentAddress")+':'}</strong>
                                      <p style="display: none" id="device-${device.id}">${t("deviceStatusUnknown")}</p></p>
                                  </tr>
                                  <li>
                                      <li style="color: blue; margin: 5px 0px;" id="addressShown" onClick="showAddress(${device.id},${position.latitude},${position.longitude})">${t("sharedShowAddress")}</li>
                                      <li style="color: blue; margin: 5px 0px;" id="buttonShowMore" onClick="showDetails(${device.id})">${t(`showMore`)}</li>
                                      <i title="Update information" id="updatePopupInfo" type="button" class="fas fa-sync-alt vehicle-type"></i>
                                  </li>
                              </li>
                          </ul>
                      </div>

                      <div id="details-${device.id}" style="display: none;">
                          <table class="body-list">
                              <tr>
                                  <th>
                                      ${t("sharedHour")}
                                  </th>
                                  <td>
                                      ${new Date(device.lastUpdate).toLocaleDateString()} ${new Date(device.lastUpdate).toLocaleTimeString()}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionLatitude")}
                                  </th>
                                  <td>
                                      ${position.latitude.toFixed(6)}°
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionLongitude")}
                                  </th>
                                  <td>
                                      ${position.longitude.toFixed(6)}°
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionValid")}
                                  </th>
                                  <td>
                                      ${t(`${position.valid}`)}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionAccuracy")}
                                  </th>
                                  <td>
                                      ${Math.expm1((position.accuracy)/1000).toFixed(2) } ${server && server.attributes?.distanceUnit}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionAltitude")}
                                  </th>
                                  <td>
                                      ${position.altitude}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionSpeed")}
                                  </th>
                                  <td>
                                      ${(speed * speedConverter(server && server.attributes?.speedUnit)).toFixed(0)}  ${server && server.attributes?.speedUnit}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionCourse")}
                                  </th>
                                  <td>
                                      ${getCourse(position.course)}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionProtocol")}
                                  </th>
                                  <td>
                                      ${position.protocol}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionIgnition")}
                                  </th>
                                  <td>
                                      ${t(`${position.attributes.ignition}`)}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionStatus")}
                                  </th>
                                  <td>
                                      ${status}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionDistance")}
                                  </th>
                                  <td>
                                      ${position.attributes.distance} ${server && server.attributes?.distanceUnit}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("deviceTotalDistance")}
                                  </th>
                                  <td>
                                      ${(Math.round((position.attributes.totalDistance.toFixed(2)) / 10)) / 100} ${server && server.attributes?.distanceUnit}
                                  </td>
                              </tr>
                              <tr>
                                  <th>
                                      ${t("positionMotion")}
                                  </th>
                                  <td>
                                      ${t(`${position.attributes.motion}`)}
                                  </td>
                              </tr>
                          </table>
                      </div>

                      <div class="popup-map-body" id="main-data-${device.id}">

                          <table class="body-list">
                              <tr>
                                  <td><i class="icon-fa fas fa-key"/></td>
                                  <th>${t("deviceContact")}</th>
                                  <td>
                                      <td>
                                          <p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">
                                          ${t(`${position.attributes.ignition}`)}
                                          </p>
                                      </td>
                                  </td>
                              </tr>
                              <tr>
                                  <td><i class="icon-fa fas fa-car-alt"/></td>
                                  <th>${t("currentStatus")}</th>
                                  <td>
                                      <td>
                                          <p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">
                                          <span class="display-flex status-${status}"><strong>${status}</strong></span>
                                          </p>
                                      </td>
                                  </td>
                              </tr>
                              <tr>
                                  <td><i class="icon-fa fas fa-tachometer-alt"/></td>
                                  <th>${t("positionSpeed")}</th>
                                  <td>
                                      <td>
                                          <p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">
                                          ${(speed * speedConverter(server && server.attributes?.speedUnit)).toFixed(0)}  ${server && server.attributes?.speedUnit}
                                          </p>
                                      </td>
                                  </td>
                              </tr>
                              <tr>
                                  <td><i class="icon-fa fas fa-road"/></td>
                                  <th>${t("mileage")}</th>
                                  <td>
                                      <td>
                                          <p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">                                           
                                          ${(Math.round((kilometers.toFixed(2)) / 10)) / 100} ${server && server.attributes?.distanceUnit}
                                          </p>
                                      </td>
                                  </td>
                              </tr>
                              <tr>
                                  <td><i class="icon-fa fas fa-bolt"/></td>
                                  <th>${t("circuitBreaker")}</th>
                                  <td>
                                      <td>
                                          <p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">
                                            ${device.attributes?.circuitBreaker === 'on' ? t('commandEnable') : t('sharedDisabled')}</p>
                                      </td>
                                  </td>
                              </tr>
                          </table>
                      </div>
                      <div class="footer-sp">
                          
                          <li id="buttonShowLess" style="color: blue; display: none"  onClick="showDetails(${device.id})">${t(`showLess`)}</li>
                          
                          <button id="circuitBraker" onClick="goToDeviceRemoteControl(${device.id})"
                          class="${desktopView ? 'button-black' : 'button-black-mobile'}">
                              ${t("circuitBreaker")}
                          </button>
                          
                      </div>
                  </div>`
  }
};

export {
  calculatePolygonCenter,
  createMarkers,
  createFeature,
  createCircles,
  createLabels,
  createPolygon,
  createPolyline,
  createCircle,
  getDistanceBtwnCoords,
  getGeozoneType,
  getCircleAttributes,
  getPolygonAttributes,
  getPolylineAttributes,
  getGeozoneArea,
  calculateFurthestPoints,
  getRandomHex,
};
