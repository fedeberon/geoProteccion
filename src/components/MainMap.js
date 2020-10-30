import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import circleToPolygon from 'circle-to-polygon';
import {makeStyles} from '@material-ui/core/styles';
import t from '../common/localization';
import { EvStation } from '@material-ui/icons';
import { AttributionControl } from 'mapbox-gl';

const MainMap = ({ geozones, areGeozonesVisible }) => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const mapCenter = useSelector(state => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return [position.longitude, position.latitude];
      }
    }
    return null;
  });

  let states = {

    "check_coutries": {
      "name": "country=",
      "values": []
    },
    "check_species": {
      "name": "species=",
      "values": []
    },

  }

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

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

  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);

  const createFeature = (state, position) => {
    const device = state.devices.items[position.deviceId] || null;
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

  const positions = useSelector(state => ({
    type: 'FeatureCollection',
    features: Object.values(state.positions.items).map(position => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [position.longitude, position.latitude]
      },
      properties: createFeature(state, position),
    })),
  }));

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

  var markerHeight = 0, markerRadius = 0, linearOffset = 0;
  var popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  };

  let popup = new mapManager.mapboxgl.Popup({
    offset: popupOffsets,
    className: 'popup-map'
  });

  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(mapManager.element);
    if (mapManager.map) {
      mapManager.map.resize();
    }
    return () => {
      currentEl.removeChild(mapManager.element);
    };
  }, [containerEl]);

  useEffect(() => {
    mapManager.registerListener(() => setMapReady(true));
  }, []);

  useEffect(() => {
    if (mapReady) {
      mapManager.map.addSource('places', {
        'type': 'geojson',
        'data': positions,
      });
      mapManager.addLayer('device-icon', 'places', 'icon-marker', '{name}');

      const bounds = mapManager.calculateBounds(positions.features);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 9
        });
      }

      return () => {
        mapManager.map.removeLayer('device-icon');
        mapManager.map.removeSource('places');
      };
    }
  }, [mapReady]);

  useEffect(() => {
    mapManager.map.easeTo({
      center: mapCenter
    });
  }, [mapCenter]);

  useEffect(() => {
    const source = mapManager.map.getSource('places');
    if (source) {
      source.setData(positions);
    }
  }, [positions]);

  const style = {
    width: '100%',
    height: '100%',
  };

  const createPopup = (e) => {
    let coordinates = e.features[0].geometry.coordinates.slice();
    let description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup.setLngLat(coordinates).setHTML(description).addTo(mapManager.map);
  }

  const cursorPointer = () => {
    mapManager.map.getCanvas().style.cursor = 'pointer';
  }
  const cursorDefault = () => {
    mapManager.map.getCanvas().style.cursor = '';
  }

  useEffect(() => {
    mapManager.map.on('click', 'device-icon', createPopup);

    mapManager.map.on('mouseenter', 'device-icon', cursorPointer);

    mapManager.map.on('mouseleave', 'device-icon', cursorDefault);

    return () => {
      mapManager.map.off('click', 'device-icon', createPopup);
      mapManager.map.off('mouseenter', 'device-icon', cursorPointer);
      mapManager.map.off('mouseleave', 'device-icon', cursorDefault);
    }
  }, [mapManager.map])

  useEffect(() => {
    let attributes = {
      lat: null,
      lng: null,
      radius: null,
      coordinates: [],
      color: '',
    }
    let properties = {
      name: '',
      description: ''
    }
    let geozoneType = '';
    let geozonesFiltered = [];

    const typeRegEx = /(\w*)[ ]?(?=[(])/;
    const circlePositionRegEx = /(?<=[(])(.*) (.*)(?=[,])/;
    const radiusRegEx = /(?<=[,][ ]).*(?=[)])/;
    const polygonRegEx = /(?<=[(]{2}).*(?=[)]{2})/;

    geozones.map((element, index) => {
      geozoneType = element.area.match(typeRegEx)[1];

      switch (geozoneType) {
        case 'CIRCLE':
          attributes.lat = parseFloat(element.area.match(circlePositionRegEx)[1]);
          attributes.lng = parseFloat(element.area.match(circlePositionRegEx)[2]);
          attributes.radius = parseFloat(element.area.match(radiusRegEx)[0]);
          attributes.color = element.attributes.color ? element.attributes.color : '#' + Math.floor(Math.random()*16777215).toString(16);

          properties.name = element.name;
          const circle = createCircle({ attributes: {...attributes}, properties: {...properties}});

          geozonesFiltered.push({ attributes: {...attributes}, properties: {...properties}});

          mapManager.map.addSource(`circles-${index}`, {
            'type': 'geojson',
            'data': circle,
          });
          mapManager.addPolygonLayer(`circles-${index}`, `circles-${index}`, attributes.color, '{name}');
          break;
        case 'POLYGON':
          const coordinates = element.area.match(polygonRegEx)[0].split(', ');
          coordinates.map((element) => {
            const latLng = element.split(' ');
            attributes.coordinates.push(latLng.reverse());
          });
          attributes.color = element.attributes.color ? element.attributes.color : '#' + Math.floor(Math.random()*16777215).toString(16);

          properties.name = element.name;
          const polygon = createPolygon({ attributes: {...attributes}, properties: {...properties}});

          const polygonCenter = calculatePolygonCenter(attributes.coordinates);
          attributes.lat = polygonCenter.lat;
          attributes.lng = polygonCenter.lng;

          geozonesFiltered.push({ attributes: {...attributes}, properties: {...properties}});

          mapManager.map.addSource(`polygons-${index}`, {
            'type': 'geojson',
            'data': polygon,
          });
          mapManager.addPolygonLayer(`polygons-${index}`, `polygons-${index}`, attributes.color, '{name}');

          attributes.coordinates = [];
          break;
        default:
          break;
      }
    });

    const labels = createLabels(geozonesFiltered);

    mapManager.map.addSource('geozones-labels', {
      'type': 'geojson',
      'data': labels,
    });

    mapManager.addLabel('geozones-labels', 'geozones-labels', '{name}');

    return () => {
      geozones.map((element, index) => {
        geozoneType = element.area.match(typeRegEx)[1];

        switch (geozoneType) {
          case 'CIRCLE':
            mapManager.map.removeLayer(`circles-${index}`);
            mapManager.map.removeSource(`circles-${index}`);
            break;
          case 'POLYGON':
            mapManager.map.removeLayer(`polygons-${index}`);
            mapManager.map.removeSource(`polygons-${index}`);
            break;
          default:
            break;
        }
      });
      mapManager.map.removeLayer('geozones-labels');
      mapManager.map.removeSource('geozones-labels');
    }
  }, [geozones]);

  useEffect(() => {
    const typeRegEx = /(\w*)[ ]?(?=[(])/;
    geozones.map((element, index) => {
      let geozoneType = element.area.match(typeRegEx)[1];

      switch (geozoneType) {
        case 'CIRCLE':
          mapManager.map.setLayoutProperty(`circles-${index}`, 'visibility', areGeozonesVisible ? 'visible' : 'none');
          break;
        case 'POLYGON':
          mapManager.map.setLayoutProperty(`polygons-${index}`, 'visibility', areGeozonesVisible ? 'visible' : 'none');
          break;
        default:
          break;
      }
    });
    mapManager.map.setLayoutProperty('geozones-labels', 'visibility', areGeozonesVisible ? 'visible' : 'none');
  }, [areGeozonesVisible]);

  return <div style={style} ref={containerEl}/>;
}

export default MainMap;
