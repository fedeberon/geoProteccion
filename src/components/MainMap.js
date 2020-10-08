import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import mapManager from '../utils/mapManager';

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

  const createFeature = (state, position) => {
    const device = state.devices.items[position.deviceId] || null;
    const name = device.name ? device.name : 'NOT FOUND';
    const model = device.attributes.MODELO ? device.attributes.MODELO : 'NOT FOUND';
    const carPlate = device.attributes.PATENTE ? device.attributes.PATENTE : 'NOT FOUND';
    const brand = device.attributes.MARCA ? device.attributes.MARCA : 'NOT FOUND';
    const year = device.attributes.ANO ? device.attributes.ANO : 'NOT FOUND';
    const status = device.status ? device.status : 'NOT FOUND';
    const lastUpdate = device.lastUpdate ? new Date(device.lastUpdate) : 'NOT FOUND';
    const protocol = position.protocol ? position.protocol : 'NOT FOUND';
    const speed = position.speed ? position.speed : 'NOT FOUND';
    const kilometers = position.attributes.totalDistance ? position.attributes.totalDistance : 'NOT FOUND';

    return {
      name: device ? device.name : '',
      description: `<div class="popup-map-div">
                      <div class="popup-map-header">
                        <p> <strong>${carPlate + '</strong> (' + name + ')' } </p>
                        <p>${brand + ' ' + model + ' ' + year }</p>
                        <p>${protocol}</p>
                        <div class="display-flex">
                          <p class="status-${status}">${status}</p> <p style="padding-left: 10px" class="status-inactive"> ${lastUpdate.getHours()} hours ago </p>
                        </div>
                      </div>
                      <div class="popup-map-body">
                        <p class="bold">Direcci&oacute;n actual</p>
                        <a href="">VER DIRECCI&Oacute;N</a>

                        <p class="bold">Estado actual</p>
                        <p class="status-inactive">detenido</p>

                        <p class="bold">Velocidad</p>
                        <p class="status-inactive">${speed}</p>

                        <p class="bold">Corta corriente</p>
                        <p class="status-inactive"> deshabilitado </p>

                        <p class="bold">Kilometraje</p>
                        <p class="status-inactive">${kilometers}</p>
                      </div>
                      <a class="btn" href="#/device/${device.id}">Details</a>
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

  let popup = new mapManager.mapboxgl.Popup({offset: popupOffsets, className: 'popup-map'});

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
  },[mapManager.map])

  return <div style={style} ref={containerEl} />;
}

export default MainMap;
