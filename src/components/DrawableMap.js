import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import circleToPolygon from 'circle-to-polygon';
import {makeStyles} from '@material-ui/core/styles';
import t from '../common/localization';
// import MapboxDraw from "@mapbox/mapbox-gl-draw";

const typesArray = ['circle', 'polygon', 'polyline'];

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

const DrawableMap = ({ geozoneType: type, color }) => {
  const containerEl = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // let controls = { [typesArray[type]]: true , trash: true };
  // let draw  = new MapboxDraw({displayControlsDefault: false, controls});
  const [ lngLat, setLngLat ] = useState([]);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const isViewportDesktop = useSelector(state => state.session.deviceAttributes.isViewportDesktop);

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
    return () => {
      if (mapManager.map.getLayer('circle')) {
        mapManager.map.removeLayer(`circle`);
      }
      if (mapManager.map.getSource('circle')) {
        mapManager.map.removeSource(`circle`);
      }
    }
  }, []);

  // useEffect(() => {
  //   mapManager.map.addControl(draw, 'bottom-right');
  //   return () => {
  //     mapManager.map.removeControl(draw);
  //   }
  // }, [controls]);

  function getLngLat (event) {
    setLngLat([...lngLat, { lng: event.lngLat.lng, lat: event.lngLat.lat }]);
  }

  function getCurrentPosition (event) {
    if (lngLat.length === 1 && type === '0') {
      
      if (mapManager.map.getSource('circle') && lngLat.length > 1) {
        mapManager.map.removeSource(`circle`);
      }

      let distance = getDistanceBtwnCoords(event.lngLat, lngLat[0]);
      distance = distance === 0 ? 1 : distance;

      let circle = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: circleToPolygon([lngLat[0].lng, lngLat[0].lat], distance).coordinates
        },
        properties: { name: 'nombre', description: '' },
      }

      if (mapManager.map.getSource('circle')) {
        mapManager.map.getSource('circle').setData(circle);
        mapManager.map.setPaintProperty('circle', 'fill-color', color);
      } else {
        mapManager.map.addSource(`circle`, {
          'type': 'geojson',
          'data': circle,
        });
        mapManager.addPolygonLayer(`circle`, `circle`, color, '{name}');
      }
    }
  }

  useEffect(() => {
    if (type === '0' && lngLat.length > 1) {
      setLngLat([]);
    }
  }, [lngLat]);

  useEffect(() => {
    mapManager.map.on('click', getLngLat);
    mapManager.map.on('mousemove', getCurrentPosition);

    return () => {
      mapManager.map.off('click', getLngLat);
      mapManager.map.off('mousemove', getCurrentPosition);
    }
  }, [mapManager.map, lngLat])

  useEffect(() => {
    mapManager.map.easeTo({
      center: [0, 0]
    });
  }, []);

  const style = {
    width: '100%',
    height: '100%',
  };

  return <div style={style} ref={containerEl}/>;
}

export default DrawableMap;
