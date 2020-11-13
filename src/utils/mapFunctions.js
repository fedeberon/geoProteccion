import t from '../common/localization';
import circleToPolygon from 'circle-to-polygon';

const typeRegEx = /(\w*)[ ]?[(]/;
const circlePositionRegEx = /[(](.*) (.*)[,]/;
const radiusRegEx = /[,][ ](.*)[)]/;
const polygonRegEx = /[(]{2}(.*)[)]{2}/;
const polylineRegEx = /[(]{1}(.*)[)]{1}/;
const typesArray = ['circle', 'polygon', 'linestring'];

const getGeozoneArea = (type, coordinates, radius) => {
  let areaString = '';
  let coordinatesString = '';

  if (type === '0') {
    coordinatesString = `(${coordinates[1]} ${coordinates[0]}, ${radius})`;
    areaString = `${typesArray[parseInt(type)].toUpperCase()} ${coordinatesString}`;
  }
  if (type === '1') {
    coordinatesString = '(('
    coordinates[0].map((element, index) => { coordinatesString += `${index !== 0 ? ' ' : ''}${element[1]} ${element[0]}${index !== coordinates[0].length - 1 ? ',' : ''}` });
    coordinatesString += '))';
    areaString = `${typesArray[parseInt(type)].toUpperCase()}${coordinatesString}`;
  }
  if (type === '2') {
    coordinatesString = '('
    coordinates.map((element, index) => { coordinatesString += `${index !== 0 ? ' ' : ''}${element[1]} ${element[0]}${index !== coordinates.length - 1 ? ',' : ''}` });
    coordinatesString += ')';
    areaString = `${typesArray[parseInt(type)].toUpperCase()} ${coordinatesString}`;
  }

  return areaString;
}

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
        lat: (north + south) /2
    }
}

const calculateFurthestPoints = (coordinates) => {
    let north = -90;
    let west = -180;
    let south = 90;
    let east = 180;

    coordinates.map((e) => {
        let lng = parseFloat(e[0]);
        let lat = parseFloat(e[1]);
        console.log({lng, lat});

        west = lng > west ? lng : west;
        east = lng < east ? lng : east;
        north = lat > north ? lat : north;
        south = lat < south ? lat : south;
    });

    return [ [west, south], [east, north] ];
}

const createFeature = (devices, position, isViewportDesktop) => {
    const device = devices[position.deviceId] || null;
    const name = device.name;
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

    return {
      name: device ? `${name} ${speed} Km/h` : '',
      description: `<div class="${desktopView ? 'popup-map-div' : 'popup-map-div-mobile'}">
                      <div class="popup-map-header">
                      <ul class="head-list">
                        <li><p style="${desktopView ? 'font-size: 16px' : 'font-size: 20px'}"><strong  class="bold">${carPlate + '</strong> - ' + name} </p></li>
                        <li><p>18:21:32  14/07/2020 <span class="display-flex status-${status}">${status}<span class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">&nbsp;2 hours ago</span></span></p></li>
                        <!--<li><p>${brand + ' ' + model + ' ' + year}</p></li>
                        <li><p>${protocol}</p></li>-->
                        <li>
                        <tr>
                        <p><strong>${t("currentAddress")+':'}</strong>
                        199 Los Libertadores, Santa Cruz Región del Libertador General Bernardo O'Higgins, CL</p>
                        </tr>
                        </li>
                        </ul>
                      </div>
                      <div>
                    </div>

                      <div class="popup-map-body">
                        <i style="${desktopView ? '' : 'color: white'}"class="fas fa-truck-moving vehicule-type"></i>
                        <table class="body-list">
                        <tr>
                        <td><i class="icon-fa fas fa-map-marker-alt"/></td>
                        <th>${t("deviceContact")}</th>
                        <td>
                        <td><p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">Abierto</p></td>
                        </td>
                        </tr>
                        <tr>
                        <td><i class="icon-fa fas fa-car-alt"/></td>
                        <th>${t("currentStatus")}</th>
                        <td>
                        <td><p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">No</p></td>
                        </td>
                        </tr>
                        <tr>
                        <td><i class="icon-fa fas fa-tachometer-alt"/></td>
                        <th>${t("positionSpeed")}</th>
                        <td>
                        <td><p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">${speed}</p></td>
                        </td>
                        </tr>
                        <tr>
                        <td><i class="icon-fa fas fa-road"/></td>
                        <th>${t("mileage")}</th>
                        <td>
                        <td><p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">${kilometers}</p></td>
                        </td>
                        </tr>
                        <tr>
                        <td><i class="icon-fa fas fa-bolt"/></td>
                        <th>${t("circuitBreaker")}</th>
                        <td>
                        <td><p class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">Desactivado</p></td>
                        </td>
                        </tr>
                        </table>

                      </div>
                      <div class="footer-sp">
                      <button class="${desktopView ? 'button-black' : 'button-black-mobile'}" href="#/device/${device.id}">
                      ${t("activateCircuitBreaker")}</button>
                    </div>
                    </div>`
    }
};

const createMarkers = (positions) => {
    return {
        type: 'FeatureCollection',
        features: positions.map(position => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [position.attributes.lng, position.attributes.lat]
            },
            properties: {...position.properties}
        })),
    }
};

const createCircles = (geozones) => {
    return {
        type: 'FeatureCollection',
        features: geozones.map(geozone => ({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: circleToPolygon([geozone.attributes.lng, geozone.attributes.lat], geozone.attributes.radius).coordinates
            },
            properties: { ...geozone.properties },
        })),
    }
};

const createLabels = (geozones) => {
    return {
        type: 'FeatureCollection',
        features: geozones.map(geozone => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [geozone.attributes.lng, geozone.attributes.lat]
            },
            properties: { ...geozone.properties },
        })),
    }
};

const createPolygon = (geozone) => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [ geozone.attributes.coordinates ]
        },
        properties: { ...geozone.properties },
    }
};

const createPolyline = (geozone) => {
    return {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: geozone.attributes.coordinates
        },
        properties: { ...geozone.properties },
    }
};

const createCircle = (geozone) => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: circleToPolygon([geozone.attributes.lng, geozone.attributes.lat], geozone.attributes.radius).coordinates
        },
        properties: { ...geozone.properties },
    }
}

const getDistanceBtwnCoords = (first, second) => {
    const R = 6371e3; // metres
    const φ1 = first.lat * Math.PI/180; // φ, λ in radians
    const φ2 = second.lat  * Math.PI/180;
    const Δφ = (second.lat - first.lat) * Math.PI/180;
    const Δλ = (second.lng - first.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

const getGeozoneType = (area) => {
    return area.match(typeRegEx)[1];
}

const getCircleAttributes = (device, attributes) => {
    let attributesCopy = {...attributes};
    attributesCopy.lat = parseFloat(device.area.match(circlePositionRegEx)[1]);
    attributesCopy.lng = parseFloat(device.area.match(circlePositionRegEx)[2]);
    attributesCopy.radius = parseFloat(device.area.match(radiusRegEx)[1]);
    attributesCopy.color = device.attributes.color ? device.attributes.color : getRandomHex();
    return attributesCopy;
}

const getPolygonAttributes = (device, attributes) => {
    let attributesCopy = {...attributes};
    const coordinates = device.area.match(polygonRegEx)[1].split(', ');
    coordinates.map((device) => {
        const latLng = device.split(' ');
        attributesCopy.coordinates.push(latLng.reverse());
    });
    attributesCopy.color = device.attributes.color ? device.attributes.color : getRandomHex();
    return attributesCopy;
}

const getPolylineAttributes = (device, attributes) => {
    let attributesCopy = {...attributes};
    const polylineCoordinates = device.area.match(polylineRegEx)[1].split(', ');
    polylineCoordinates.map((device) => {
      const latLng = device.split(' ');
      attributesCopy.coordinates.push(latLng.reverse());
    });
    attributesCopy.color = device.attributes.color ? device.attributes.color : getRandomHex();
    return attributesCopy;
}

const getRandomHex = () => {
    return '#' + Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, "0");
}

export {
    calculatePolygonCenter,
    createFeature,
    createMarkers,
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
}