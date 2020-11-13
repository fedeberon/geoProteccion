import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import { calculatePolygonCenter, createCircle, createFeature, createLabels, createMarkers, createPolygon, createPolyline, getCircleAttributes, getGeozoneType, getPolygonAttributes, getPolylineAttributes } from '../utils/mapFunctions';
import { getRoute } from '../utils/variables';

const ReportsMap = ({ geozones, route, showMarkers, selectedPosition }) => {
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

  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);

  const positions = useSelector(state => ({
    type: 'FeatureCollection',
    features: Object.values(state.positions.items).map(position => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [position.longitude, position.latitude]
      },
      properties: createFeature(state.devices.items, position, isViewportDesktop),
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
  }, [mapManager.map]);

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
    
    geozones.map((element, index) => {
      geozoneType = getGeozoneType(element.area);

      switch (geozoneType) {
        case 'CIRCLE':
          attributes = getCircleAttributes(element, attributes);

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
          attributes = getPolygonAttributes(element, attributes);

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
        case 'LINESTRING':
          attributes = getPolylineAttributes(element, attributes);

          properties.name = element.name;
          const polyline = createPolyline({ attributes: {...attributes}, properties: {...properties}});

          const polylineCenter = calculatePolygonCenter(attributes.coordinates);
          attributes.lat = polylineCenter.lat;
          attributes.lng = polylineCenter.lng;

          geozonesFiltered.push({ attributes: {...attributes}, properties: {...properties}});

          mapManager.map.addSource(`polylines-${index}`, {
            'type': 'geojson',
            'data': polyline,
          });
          mapManager.addLineLayer(`polylines-${index}`, `polylines-${index}`, attributes.color, '{name}');

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

    mapManager.addLabelLayer('geozones-labels', 'geozones-labels', '{name}');

    return () => {
      geozones.map((element, index) => {
        const geozoneType = getGeozoneType(element.area);

        switch (geozoneType) {
          case 'CIRCLE':
            mapManager.map.removeLayer(`circles-${index}`);
            mapManager.map.removeSource(`circles-${index}`);
            break;
          case 'POLYGON':
            mapManager.map.removeLayer(`polygons-${index}`);
            mapManager.map.removeSource(`polygons-${index}`);
            break;
            case 'LINESTRING':
            mapManager.map.removeLayer(`polylines-${index}`);
            mapManager.map.removeSource(`polylines-${index}`);
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
    mapManager.map.easeTo({
      center: mapCenter
    });
  }, [mapCenter]);

  useEffect(() => {
    if (route.length > 0) {
      const positions = route;
      let coordinates = [];
      let markersOptions = [];
      let color = '#FF9900';
      let markers = {};

      positions.map((position) => {
        coordinates.push([position.longitude, position.latitude]);
        if (showMarkers) {
          markersOptions.push({ attributes: { lng: position.longitude, lat: position.latitude },  properties: { course: position.course } });
        }
      });

      const polyline = createPolyline({ attributes: { coordinates }, properties: {}});
      if (showMarkers) {
        markers = createMarkers(markersOptions);
      }
      
      mapManager.map.addSource(`route`, {
        'type': 'geojson',
        'data': polyline,
      });
      if (showMarkers) {
        mapManager.map.addSource(`markers`, {
          'type': 'geojson',
          'data': markers,
        });
      }

      mapManager.addLineLayer(`route`, `route`, color);
      if (showMarkers) {
        mapManager.addMarkerLayer(`markers`, `markers`, 'course');
      }
    }

    return () => {
      if(mapManager.map.getLayer('route')) {
        mapManager.map.removeLayer(`route`);
      }
      if(mapManager.map.getSource('route')) {
        mapManager.map.removeSource(`route`);
      }
      if(mapManager.map.getLayer('markers')) {
        mapManager.map.removeLayer(`markers`);
      }
      if(mapManager.map.getSource('markers')) {
        mapManager.map.removeSource(`markers`);
      }
    }
  }, [route]);

  useEffect(() => {
    if (selectedPosition.id) {
      mapManager.map.easeTo({
        center: [selectedPosition.longitude, selectedPosition.latitude]
      });

      if(!showMarkers) {
        if(mapManager.map.getLayer('markers')) {
          mapManager.map.removeLayer(`markers`);
        }
        if(mapManager.map.getSource('markers')) {
          mapManager.map.removeSource(`markers`);
        }

        let markersOptions = [];
        markersOptions.push({ attributes: { lng: selectedPosition.longitude, lat: selectedPosition.latitude },  properties: { course: selectedPosition.course } });
        const markers = createMarkers(markersOptions);
        
        mapManager.map.addSource(`markers`, {
          'type': 'geojson',
          'data': markers,
        });

        mapManager.addMarkerLayer(`markers`, `markers`, 'course');
      }
    }
  }, [selectedPosition]);

  const style = {
    width: '100vw',
    height: '100vh',
  };

  return <div style={style} ref={containerEl}/>;
}

export default ReportsMap;
