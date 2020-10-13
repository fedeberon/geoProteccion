import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import {makeStyles} from '@material-ui/core/styles';

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


    return {
      name: device ? device.name : '',
      description: `<div class="popup-map-div">
                      <div class="popup-map-header">
                      <ul class="head-list">
                        <li><p class="bold"> <strong>${carPlate + '</strong> (' + name + ')'} </p></li>
                        <li><p>${brand + ' ' + model + ' ' + year}</p></li>
                        <li><p>${protocol}</p></li>
                        <li><p class="display-flex status-${status}">${status}<span class="status-inactive">&nbsp;${lastUpdate.getHours()} hours ago</span></p></li>
                        </ul>
                      </div>
                      <div>
                    </div>

                      <div class="popup-map-body col-md-6">

                        <table class="body-list">
                        <tr>
                        <td rowspan="2"><i class="icon-fa fas fa-map-marker-alt"/></td>
                        <th>Dirección actual</th>
                        </tr>
                        <tr>
                        <td><a href="">Ver direccion</a></td>
                        </tr>
                        <tr>
                        <td rowspan="2"><i class="icon-fa fas fa-car-alt"/></td>
                        <th>Estado actual</th>
                        </tr>
                        <tr>
                        <td><p class="status-inactive">Detenido</p></td>
                        </tr>
                        <tr>
                        <td rowspan="2"><i class="icon-fa fas fa-tachometer-alt"/></td>
                        <th>Velocidad</th>
                        </tr>
                        <tr>
                        <td><p class="status-inactive">${speed}</p></td>
                        </tr>
                        <tr>
                        <td rowspan="2"><i class="icon-fa fas fa-bolt"/></td>
                        <th>Corta corriente</th>
                        </tr>
                        <tr>
                        <td><p class="status-inactive"> deshabilitado</p></td>
                        </tr>
                        <tr>
                        <td rowspan="2"><i class="icon-fa fas fa-road"/></td>
                        <th>Kilometraje</th>
                        </tr>
                        <tr>
                        <td><p class="status-inactive">${kilometers}</p></td>
                        </tr>
                        </table>

                      </div>
                      <div class="footer-sp">
                      <button class="button-blue btn-lg" href="#/device/${device.id}">
                      Activar corta corriente</button>
                    <button class="button-black" style="border-radius: 5px">REPORTES</button>
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
