import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import circleToPolygon from 'circle-to-polygon';
import {makeStyles} from '@material-ui/core/styles';
import t from '../common/localization';
// import MapboxDraw from "@mapbox/mapbox-gl-draw";

const typesArray = ['circle', 'polygon', 'line'];

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
      if (mapManager.map.getLayer('dot')) {
        mapManager.map.removeLayer(`dot`);
      }
      if (mapManager.map.getSource('dot')) {
        mapManager.map.removeSource(`dot`);
      }
      if (mapManager.map.getLayer('line')) {
        mapManager.map.removeLayer(`line`);
      }
      if (mapManager.map.getSource('line')) {
        mapManager.map.removeSource(`line`);
      }
      if (mapManager.map.getLayer('polygon')) {
        mapManager.map.removeLayer(`polygon`);
      }
      if (mapManager.map.getSource('polygon')) {
        mapManager.map.removeSource(`polygon`);
      }
      if (mapManager.map.getLayer('polyline')) {
        mapManager.map.removeLayer(`polyline`);
      }
      if (mapManager.map.getSource('polyline')) {
        mapManager.map.removeSource(`polyline`);
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
    let lng = event.lngLat.lng;
    let lat = event.lngLat.lat;

    let zoom = mapManager.map.getZoom();

    if (lngLat.length > 0 && Math.abs(Math.abs(parseFloat(lngLat[0].lng)) - Math.abs(parseFloat(event.lngLat.lng))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) && Math.abs(Math.abs(parseFloat(lngLat[0].lat)) - Math.abs(parseFloat(event.lngLat.lat))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))) {
      lng = lngLat[0].lng;
      lat = lngLat[0].lat;
    }

    if (lngLat.length > 0 && type === '2' && Math.abs(Math.abs(parseFloat(lngLat[lngLat.length - 1].lng)) - Math.abs(parseFloat(event.lngLat.lng))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) && Math.abs(Math.abs(parseFloat(lngLat[lngLat.length - 1].lat)) - Math.abs(parseFloat(event.lngLat.lat))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))) {
      lng = lngLat[lngLat.length - 1].lng;
      lat = lngLat[lngLat.length - 1].lat;
    }

    setLngLat([...lngLat, { lng: lng, lat: lat }]);
  
    if(!isViewportDesktop) {
      if (lngLat.length === 0) {
        mapManager.map.addSource(`dot`, {
          'type': 'geojson',
          'data': { type: 'Feature', geometry: { type: 'Point', coordinates: [event.lngLat.lng, event.lngLat.lat] } }
        });

        mapManager.addDotLayer(`dot`, `dot`, color);
      } else {
        if (mapManager.map.getLayer('dot')) {
          mapManager.map.removeLayer('dot');
        }
        if (mapManager.map.getSource('dot')) {
          mapManager.map.removeSource('dot');
        }
      }
    }
  }

  function drawShape (event) {
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
    if (lngLat.length > 0 && (type === '1' || type === '2')) {
      let coordinates = [];
      let lng = event.lngLat.lng;
      let lat = event.lngLat.lat;

      lngLat.map((element) => { coordinates.push([element.lng, element.lat]) });
      
      let zoom = mapManager.map.getZoom();

      if (lngLat.length > 1 && Math.abs(Math.abs(parseFloat(lngLat[0].lng)) - Math.abs(parseFloat(event.lngLat.lng))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) && Math.abs(Math.abs(parseFloat(lngLat[0].lat)) - Math.abs(parseFloat(event.lngLat.lat))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))) {
        lng = lngLat[0].lng;
        lat = lngLat[0].lat;
      }

      if (lngLat.length > 1 && type === '2' && Math.abs(Math.abs(parseFloat(lngLat[lngLat.length - 1].lng)) - Math.abs(parseFloat(event.lngLat.lng))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) && Math.abs(Math.abs(parseFloat(lngLat[lngLat.length - 1].lat)) - Math.abs(parseFloat(event.lngLat.lat))) < 0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))) {
        lng = lngLat[lngLat.length - 1].lng;
        lat = lngLat[lngLat.length - 1].lat;
      }

      if (mapManager.map.getLayer('polygon')) {
        mapManager.map.removeLayer(`polygon`);
      }
      if (mapManager.map.getSource('polygon')) {
        mapManager.map.removeSource(`polygon`);
      }
      if (mapManager.map.getLayer('polyline')) {
        mapManager.map.removeLayer(`polyline`);
      }
      if (mapManager.map.getSource('polyline')) {
        mapManager.map.removeSource(`polyline`);
      }

      let line = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...coordinates, [lng, lat]]
        },
        properties: { name: 'nombre', description: '' },
      }

      if (mapManager.map.getSource('line')) {
        mapManager.map.getSource('line').setData(line);
      } else {
        mapManager.map.addSource(`line`, {
          'type': 'geojson',
          'data': line,
        });
        mapManager.addLineLayer(`line`, `line`, color);
      }
    }
  }

  useEffect(() => {
    if (type === '0' && lngLat.length > 1) {
      setLngLat([]);
    }

    if (type === '1' && lngLat.length > 1) {
      let coordinates = [];

      lngLat.map((element) => { coordinates.push([element.lng, element.lat]) });
    
      let stringifiedArray = [];

      coordinates.map((element) => { stringifiedArray.push(element.toString()) });
      
      if (stringifiedArray.length !== new Set(stringifiedArray).size) {
        if (mapManager.map.getLayer('line')) {
          mapManager.map.removeLayer(`line`);
        }
        if (mapManager.map.getSource('line')) {
          mapManager.map.removeSource(`line`);
        }

        let polygon = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[...coordinates]]
          },
          properties: { name: 'nombre', description: '' },
        }

        mapManager.map.addSource(`polygon`, {
          'type': 'geojson',
          'data': polygon,
        });
        mapManager.addPolygonLayer(`polygon`, `polygon`, color, '{name}');
        setLngLat([]);
      }
    }

    if (type === '2' && lngLat.length > 1) {
      let coordinates = [];

      lngLat.map((element) => { coordinates.push([element.lng, element.lat]) });
    
      let stringifiedArray = [];

      coordinates.map((element) => { stringifiedArray.push(element.toString()) });
      
      if (stringifiedArray.length !== new Set(stringifiedArray).size) {
        if (mapManager.map.getLayer('line')) {
          mapManager.map.removeLayer(`line`);
        }
        if (mapManager.map.getSource('line')) {
          mapManager.map.removeSource(`line`);
        }

        let polyline = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [...coordinates]
          },
          properties: { name: 'nombre', description: '' },
        }

        mapManager.map.addSource(`polyline`, {
          'type': 'geojson',
          'data': polyline,
        });
        mapManager.addLineLayer(`polyline`, `polyline`, color);
        setLngLat([]);
      }
    }
  }, [lngLat]);

  useEffect(() => {
    setLngLat([]);
    if (mapManager.map.getLayer('circle')) {
      mapManager.map.removeLayer(`circle`);
    }
    if (mapManager.map.getSource('circle')) {
      mapManager.map.removeSource(`circle`);
    }
    if (mapManager.map.getLayer('dot')) {
      mapManager.map.removeLayer(`dot`);
    }
    if (mapManager.map.getSource('dot')) {
      mapManager.map.removeSource(`dot`);
    }
    if (mapManager.map.getLayer('line')) {
      mapManager.map.removeLayer(`line`);
    }
    if (mapManager.map.getSource('line')) {
      mapManager.map.removeSource(`line`);
    }
    if (mapManager.map.getLayer('polygon')) {
      mapManager.map.removeLayer(`polygon`);
    }
    if (mapManager.map.getSource('polygon')) {
      mapManager.map.removeSource(`polygon`);
    }
    if (mapManager.map.getLayer('polyline')) {
      mapManager.map.removeLayer(`polyline`);
    }
    if (mapManager.map.getSource('polyline')) {
      mapManager.map.removeSource(`polyline`);
    }
    
  }, [type]);

  useEffect(() => {
    mapManager.map.on('click', getLngLat);
    mapManager.map.on('mousemove', drawShape);

    return () => {
      mapManager.map.off('click', getLngLat);
      mapManager.map.off('mousemove', drawShape);
    }
  }, [mapManager.map, lngLat])

  useEffect(() => {
    mapManager.map.easeTo({
      center: [-66, -33]
    });
  }, []);

  const style = {
    width: '100%',
    height: '100%',
  };

  return <div style={style} ref={containerEl}/>;
}

export default DrawableMap;
