import React, { memo, useRef, useLayoutEffect, useEffect, useState, useMemo, useCallback } from "react";
import mapManager from "../utils/mapManager";
import {useSelector, useDispatch, shallowEqual} from "react-redux";
import {
  calculatePolygonCenter,
  createLabels,
  createFeature,
  createPolygon,
  createPolyline,
  createCircle,
  getGeozoneType,
  getCircleAttributes,
  getPolygonAttributes,
  getPolylineAttributes,
} from "../utils/mapFunctions";
import { devicesActions, positionsActions } from "../store";
import { useHistory } from "react-router-dom";
import t from "../common/localization";

const MainMap = memo(({ geozones, areGeozonesVisible, rasterSource}) => {
  let buttons = document.getElementById(`updatePopupInfo`);
  let circuitbreaker = document.getElementById("circuitBreaker");
  let statusShowingGeozones = mapManager.map.getSource("geozones-labels");
  let mapboxPopup = document.getElementsByClassName('mapboxgl-popup');
  let sources;
  const history = useHistory();
  const dispatch = useDispatch();
  const containerEl = useRef(null);
  const [centered, setCentered] = useState(false);
  const [mapReady, setMapReady] = useState(false); 
  const isViewportDesktop = useSelector((state) => state.session.deviceAttributes.isViewportDesktop, shallowEqual);  
  const devices = useSelector((state) => Object.values(state.devices.items), shallowEqual); 
  const selectedItems = useSelector((state) => state.positions.selectedItems, shallowEqual);
  const lastRemoved = useSelector((state) => state.positions.lastRemoved, shallowEqual);
  const server = useSelector((state) => state.session.server, shallowEqual);
  const selectedDevice = useSelector((state) => state.devices.selectedDevice, shallowEqual);
  const listFiltered = useSelector((state) => state.positions.listFiltered, shallowEqual);
  const mapCenter = useSelector((state) => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return [position.longitude, position.latitude];
      }
    }
    return null;
  }, shallowEqual);
  const positions = useSelector((state) => ({
    type:"FeatureCollection",features: Object.values(state.positions.items).map((position) => ({
    type: "Feature",geometry: {type: "Point", coordinates: [position.longitude, position.latitude]},
    properties: createFeature(state.devices.items,position,isViewportDesktop,server)})),
  }));

  if(!positions){return;} 

  useEffect(() => {
    const interval = setInterval(async() => {
      await fetch("/api/devices").then((response) => {
          if (response.ok) {
            response.json().then((devices) => {
              dispatch(devicesActions.update(devices));
            });    
          }      
        });
    }, 30000);
    return () => clearInterval(interval);
  },[]);

  useEffect(() => {
    const interval = setInterval(async() => {
        await fetch("/api/positions").then((response) => {
          if (response.ok) {
            response.json().then((positions) => {
              dispatch(positionsActions.refreshPositions(positions));
            });    
          }
        });
    }, 8000);
    return () => clearInterval(interval);
  },[]);

  useEffect(() => {
    if(!centered){
      mapManager.map.easeTo({
        center: mapCenter,
        duration: 500,
        zoom: 13,
      });
    } else {
      mapManager.map.easeTo({
        center: mapCenter,
        duration: 500,
        zoom: mapManager.map.getZoom(),
      });
    }
    setTimeout(()=> {
      if(mapCenter !== null){
        setCentered(true);
      } else {
        setCentered(false);
      } 
    },1000)    
  },[selectedDevice, mapCenter]); 

  var markerHeight = 0,
    markerRadius = 0,
    linearOffset = 0;
  var popupOffsets = {
    top: [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    bottom: [0, -markerHeight],
    "bottom-left": [
      linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    "bottom-right": [
      -linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  };

  let popup = new mapManager.mapboxgl.Popup({
    offset: popupOffsets,
    className: "popup-map",
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

  // useEffect(() => {
  //   mapManager.registerListener(() => setMapReady(true));
  // }, []);

  //Initial data load of devices on the map
  useEffect(() => {
    if(statusShowingGeozones){
      areGeozonesVisible = true;
    }
    if(mapReady && devices.length <= 50){
      positions.features.map((position)=> {
        mapManager.map.addSource(`places-${position.properties.deviceId}`, {
          type: "geojson",
          data: {...position},
          });
        mapManager.addLayer(`device-${position.properties.deviceId}`, 
        `places-${position.properties.deviceId}`, `icon-${position.properties.type}`, "{name}", 
        position.properties.status, position.properties.course);
      })
    }

    mapManager.map.scrollZoom.setWheelZoomRate(1.5);

    if (mapManager.map.getSource("raster-tiles") && rasterSource !== "") {
      mapManager.map.getSource("raster-tiles").tiles = [rasterSource];
    }
    return () => {
      positions.features.map((position) => {
        if(mapManager.map.getLayer(`device-${position.properties.deviceId}`))
        mapManager.map.removeLayer(`device-${position.properties.deviceId}`);
                
        if(mapManager.map.getSource(`places-${position.properties.deviceId}`))
        mapManager.map.removeSource(`places-${position.properties.deviceId}`);
      })
    };
    
  },[mapReady, mapManager.map]);

  //Updating layers positions 
  useEffect(()=> {
    if (!mapReady) {
      const bounds = mapManager.calculateBounds(positions.features);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 9,
        });
        setMapReady(true);
      }
    }
    console.log(positions)
    if(mapReady && positions){
      positions.features.map((position)=> {
        sources = mapManager.map.getSource(`places-${position.properties.deviceId}`);
        if(sources){
          sources.setData({
            type: "FeatureCollection",
            features: [{...position}],
          });
        }
      }) 
    }
 },[positions])

 useEffect(()=> {
  //  if(devices.length > 50){
    if(selectedItems.length > 0){
      let positionsFiltered = [];
      // let position = positions.features.find(elem => elem.properties.deviceId === item.id);
      positions.features.map(position => {
        if(selectedItems.findIndex(item => item.id === position.properties.deviceId) !== -1){
          positionsFiltered.push(position);
        };
      });
      if(positionsFiltered.length > 0){
        positionsFiltered.map((position)=> {
          if(!mapManager.map.getSource(`places-${position.properties.deviceId}`)){
            mapManager.map.addSource(`places-${position.properties.deviceId}`, {
              type: "geojson",
              data: {...position},
              });
            mapManager.addLayer(`device-${position.properties.deviceId}`, 
            `places-${position.properties.deviceId}`, `icon-${position.properties.type}`, "{name}", 
            position.properties.status, position.properties.course);
          }
        })
      }
    }
  // }
  if(lastRemoved !== 0){
    if(mapManager.map.getLayer(`device-${lastRemoved}`)){
      mapManager.map.removeLayer(`device-${lastRemoved}`);          
    }
    if(mapManager.map.getSource(`places-${lastRemoved}`)){
      mapManager.map.removeSource(`places-${lastRemoved}`);
    }
    dispatch(positionsActions.lastRemoved(0));
  }
 },[positions, selectedItems, lastRemoved])

 useEffect(()=> {
    if(selectedItems.length === 0){
      positions.features.map((position) => {
        if(mapManager.map.getLayer(`device-${position.properties.deviceId}`))
        mapManager.map.removeLayer(`device-${position.properties.deviceId}`);
                
        if(mapManager.map.getSource(`places-${position.properties.deviceId}`))
        mapManager.map.removeSource(`places-${position.properties.deviceId}`);
      })
    }
 },[selectedItems]);

 const drawDevices = () => {
  positions.features.map((position)=> {
    if(!mapManager.map.getSource(`places-${position.properties.deviceId}`)){
      mapManager.map.addSource(`places-${position.properties.deviceId}`, {
        type: "geojson",
        data: {...position},
        });
      mapManager.addLayer(`device-${position.properties.deviceId}`, 
      `places-${position.properties.deviceId}`, `icon-${position.properties.type}`, "{name}", 
      position.properties.status, position.properties.course);
    }    
  })
 } 

 useEffect(()=> {
  if(!listFiltered && selectedItems.length === 0 && devices.length <= 50){
    drawDevices();
  }
 },[listFiltered])

  const updatePopup = (object, position) => {
    if(object[0]){
      object[0].remove();
      refreshPopup(position);
    }  
  }  

  if(buttons){
    buttons.addEventListener("click", function(){ 
      positions.features.map((position) => {
        let deviceData = document.getElementById(`header-${position.properties.deviceId}`)
        let mapboxPopup = document.getElementsByClassName('mapboxgl-popup');
        let sourceData = mapManager.map.getSource(`places-${position.properties.deviceId}`);
        if(deviceData && sourceData){  
          updatePopup(mapboxPopup, position);
          return;
        }        
      })
    })
  }

  useEffect(()=> {   
    if(mapboxPopup){
      if(circuitbreaker){
        circuitbreaker.innerHTML = `${t("circuitBreaker")}`;
        circuitbreaker.addEventListener("click", function(){ 
          positions.features.map((position) => {
            let deviceData = document.getElementById(`header-${position.properties.deviceId}`)         
            let sourceData = mapManager.map.getSource(`places-${position.properties.deviceId}`);
            if(deviceData && sourceData){
              history.push(`/device/${position.properties.deviceId}`);
              return;
            }        
          })
        })
      }      
    }
  },[mapboxPopup, positions, devices, buttons, circuitbreaker]);

  const style = {
    width: "100%",
    height: "100%",
  };

  const createPopup = (e) => {
    let coordinates = e.features[0].geometry.coordinates.slice();
    let description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup.setLngLat(coordinates).setHTML(description).addTo(mapManager.map);
  };

  const refreshPopup = (e) => {
    let coordinates = e.geometry.coordinates.slice();
    let description = e.properties.description;

    popup.setLngLat(coordinates).setHTML(description).addTo(mapManager.map);
  };

  const cursorPointer = () => {
    mapManager.map.getCanvas().style.cursor = "pointer";    
  };
  const cursorDefault = () => {
    mapManager.map.getCanvas().style.cursor = "";
  };

  useEffect(() => {
    let features = [];
      positions.features.map((feature, index) => {
        let featureType = feature.properties.type;
      if (features.indexOf(`${featureType}-${index}`) === -1) {
        mapManager.map.on("click", `device-${feature.properties.deviceId}`, createPopup);
        mapManager.map.on("mouseenter", `device-${feature.properties.deviceId}`, cursorPointer);
        mapManager.map.on("mouseleave", `device-${feature.properties.deviceId}`, cursorDefault);
      }
      features.push(`${featureType}-${index}`);
    });

    return () => {
      let features = [];
      positions.features.map((feature, index) => {
        let featureType = feature.properties.type;
        if (features.indexOf(`${featureType}-${index}`) === -1) {
          mapManager.map.off("click", `device-${feature.properties.deviceId}`, createPopup);
          mapManager.map.off("mouseenter", `device-${feature.properties.deviceId}`, cursorPointer);
          mapManager.map.off("mouseleave", `device-${feature.properties.deviceId}`, cursorDefault);
        }
        features.push(`${featureType}-${index}`);
      });
    };
  }, [mapManager.map, selectedItems, positions]);
  

  const drawGeozones = () => {
    let attributes = {
      lat: null,
      lng: null,
      radius: null,
      coordinates: [],
      color: "",
    };
    let properties = {
      name: "",
      description: "",
    };
    let geozoneType = "";
    let geozonesFiltered = [];

    geozones.map((element, index) => {
      geozoneType = getGeozoneType(element.area);

      switch (geozoneType) {
        case "CIRCLE":
          attributes = getCircleAttributes(element, attributes);

          properties.name = element.name;
          const circle = createCircle({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          geozonesFiltered.push({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          try{
            mapManager.map.addSource(`circles-${index}`, {
              type: "geojson",
              data: circle,
            });
            mapManager.addPolygonLayer(
              `circles-${index}`,
              `circles-${index}`,
              attributes.color,
              "{name}"
            );
          } catch (error){
            console.error(error);
          }
          
          break;
        case "POLYGON":
          attributes = getPolygonAttributes(element, attributes);

          properties.name = element.name;
          const polygon = createPolygon({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          const polygonCenter = calculatePolygonCenter(attributes.coordinates);
          attributes.lat = polygonCenter.lat;
          attributes.lng = polygonCenter.lng;

          geozonesFiltered.push({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          try{
            mapManager.map.addSource(`polygons-${index}`, {
              type: "geojson",
              data: polygon,
            });
            mapManager.addPolygonLayer(
              `polygons-${index}`,
              `polygons-${index}`,
              attributes.color,
              "{name}"
            );
          } catch(error){
            console.error(error);
          }

          attributes.coordinates = [];
          break;
        case "LINESTRING":
          attributes = getPolylineAttributes(element, attributes);

          properties.name = element.name;
          const polyline = createPolyline({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          const polylineCenter = calculatePolygonCenter(attributes.coordinates);
          attributes.lat = polylineCenter.lat;
          attributes.lng = polylineCenter.lng;

          geozonesFiltered.push({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          try{
            mapManager.map.addSource(`polylines-${index}`, {
              type: "geojson",
              data: polyline,
            });
            mapManager.addLineLayer(
              `polylines-${index}`,
              `polylines-${index}`,
              attributes.color,
              "{name}"
            );
          } catch (error){
            console.error(error)
          }          

          attributes.coordinates = [];
          break;
        default:
          break;
      }
    });

    const labels = createLabels(geozonesFiltered);

    try {
      mapManager.map.addSource("geozones-labels", {
        type: "geojson",
        data: labels,
      });

    mapManager.addLabelLayer("geozones-labels", "geozones-labels", "{name}");

    } catch(error){
      console.error(error)
    } 

    return () => {
      geozones.map((element, index) => {
        const geozoneType = getGeozoneType(element.area);

        switch (geozoneType) {
          case "CIRCLE":
            try{
              mapManager.map.removeLayer(`circles-${index}`);
              mapManager.map.removeLayer(`circles-${index}-outline`);
              mapManager.map.removeSource(`circles-${index}`);
              break;
            } catch (error){
              console.error(error);
            }
          case "POLYGON":
            try{
              mapManager.map.removeLayer(`polygons-${index}`);
              mapManager.map.removeLayer(`polygons-${index}-outline`);
              mapManager.map.removeSource(`polygons-${index}`);
              break;
            } catch (error){
              console.error(error);
            }
          case "LINESTRING":
            try{
              mapManager.map.removeLayer(`polylines-${index}`);
              mapManager.map.removeSource(`polylines-${index}`);
              break;
            } catch (error){
              console.error(error);
            }          
          default:
            break;
        }
      });
      if(mapManager){
        try{
          mapManager.map.removeLayer("geozones-labels");
          mapManager.map.removeSource("geozones-labels");
        } catch(error){
          console.error(error);
        }
      };      
    };
  }

  const removeGeozones = () => {
    geozones.map((element, index) => {
      const geozoneType = getGeozoneType(element.area);

      switch (geozoneType) {
        case "CIRCLE":
          if(mapManager.map.getLayer(`circles-${index}`)){
            mapManager.map.removeLayer(`circles-${index}`);
          }
          if(mapManager.map.getLayer(`circles-${index}-outline`)){
            mapManager.map.removeLayer(`circles-${index}-outline`);
          }
          if(mapManager.map.getSource(`circles-${index}`)){
            mapManager.map.removeSource(`circles-${index}`);
          }            
          break;
        case "POLYGON":
          if(mapManager.map.getLayer(`polygons-${index}`)){
          mapManager.map.removeLayer(`polygons-${index}`);
          }
          if(mapManager.map.getLayer(`polygons-${index}-outline`)){
          mapManager.map.removeLayer(`polygons-${index}-outline`);
          }
          if(mapManager.map.getSource(`polygons-${index}`)){
            mapManager.map.removeSource(`polygons-${index}`);
          }
          break;
        case "LINESTRING":
          if(mapManager.map.getLayer(`polylines-${index}`)){
          mapManager.map.removeLayer(`polylines-${index}`);
          }
          if(mapManager.map.getLayer(`polylines-${index}-outline`)){
          mapManager.map.removeLayer(`polylines-${index}-outline`);
          }
          if(mapManager.map.getSource(`polylines-${index}`)){
            mapManager.map.removeSource(`polylines-${index}`);
          }
          break;
        default:
          break;
      }
    });
    if(mapManager.map.getLayer("geozones-labels")){
      mapManager.map.removeLayer("geozones-labels");
    }
    if(mapManager.map.getSource("geozones-labels")){
      mapManager.map.removeSource("geozones-labels");
    }    
  }

  useEffect(()=> {    
    if(areGeozonesVisible){
      if(!mapManager.map.getSource("geozones-labels")){
      drawGeozones();
      }
    } else {
      removeGeozones();
    }
  },[areGeozonesVisible])

  return <div style={style} ref={containerEl} />;
});

export default memo(MainMap);