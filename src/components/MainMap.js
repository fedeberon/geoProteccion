import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import {makeStyles} from '@material-ui/core/styles';
import t from '../common/localization';

const MainMap = () => {
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

  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);

  const createFeature = (state, position) => {
    const device = state.devices.items[position.deviceId] || null;
    const name = device.name ? device.name : 'Undefined';
    const model = device.attributes.MODELO ? device.attributes.MODELO : 'Undefined';
    const carPlate = device.attributes.PATENTE ? device.attributes.PATENTE : 'Undefined';
    const brand = device.attributes.MARCA ? device.attributes.MARCA : 'Undefined';
    const year = device.attributes.ANO ? device.attributes.ANO : 'Undefined';
    const status = device.status ? device.status : 'Undefined';
    const lastUpdate = device.lastUpdate ? new Date(device.lastUpdate) : 'Undefined';
    const protocol = position.protocol ? position.protocol : 'Undefined';
    const speed = position.speed ? position.speed : 'Undefined';
    const kilometers = position.attributes.totalDistance ? position.attributes.totalDistance : 'Undefined|';
    const desktopView = isViewportDesktop;

    return {
      name: device ? device.name : '',
      description: `<div class="${desktopView ? 'popup-map-div' : 'popup-map-div-mobile'}">
                      <div class="popup-map-header">
                      <ul class="head-list">
                        <li><p style="${desktopView ? 'font-size: 16px' : 'font-size: 20px'}"><strong  class="bold">${carPlate + '</strong> - ' + name} </p></li>
                        <li><p>18:21:32  14/07/2020 <span class="display-flex status-${status}">${status}<span class="${desktopView ? 'status-inactive' : 'status-inactive-mobile'}">&nbsp;${lastUpdate.getHours()} hours ago</span></span></p></li>
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
                        <th>Contacto</th>
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

  useEffect(() => {
    mapManager.map.on('click', 'device-icon', function (e) {
      let coordinates = e.features[0].geometry.coordinates.slice();
      let description = e.features[0].properties.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(mapManager.map);
    });

    mapManager.map.on('mouseenter', 'device-icon', function (e) {
      mapManager.map.getCanvas().style.cursor = 'pointer';
    });

    mapManager.map.on('mouseleave', 'device-icon', function (e) {
      mapManager.map.getCanvas().style.cursor = '';
    });
  }, [mapManager.map])

  return <div style={style} ref={containerEl}/>;
}

export default MainMap;
