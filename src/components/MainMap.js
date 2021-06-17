import React, { useRef, useLayoutEffect, useEffect, useState, useMemo, useCallback } from "react";
import mapManager from "../utils/mapManager";
import {useSelector} from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
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

const MainMap = ({ geozones, areGeozonesVisible, zoom, rasterSource}) => {
  let buttons = document.getElementById(`updatePopupInfo`);
  let statusShowingGeozones = mapManager.map.getSource("geozones-labels");
  const containerEl = useRef(null);
  const [mapReady, setMapReady] = useState(false); 
  const isViewportDesktop = useSelector((state) => state.session.deviceAttributes.isViewportDesktop);  
  const devices = useSelector((state) => Object.values(state.devices.items)); 
  const server = useSelector((state) => state.session.server);  
  const mapCenter = useSelector((state) => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return [position.longitude, position.latitude];
      }
    }
    return null;
  });

  const positions = useSelector((state) => ({
    type: "FeatureCollection",
    features: Object.values(state.positions.items).map((position) => ({
      type: "Feature",
      id: position.id,
      course: position.course,
      geometry: {
        type: "Point",
        coordinates: [position.longitude, position.latitude],
      },
      properties: createFeature(
        state.devices.items,
        position,
        isViewportDesktop,
        server
      ),      
    })),
  }));

  useEffect(() => {
      mapManager.map.easeTo({
        center: mapCenter,
        duration: 400,
        zoom: mapManager.map.getZoom(),
      });
  },[mapCenter]); 

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

  useEffect(() => {
    mapManager.registerListener(() => setMapReady(true));
  }, []);

  //Initial data charge of devices on map
  useLayoutEffect(() => {

    if(statusShowingGeozones){
      areGeozonesVisible = true;
    }

    if (mapReady) {
      let positionsByType = [];
      
      // console.log(positions)
      // console.log(devices);
      positions.features.map((feature) => {
        let positionsB = {
          type: "FeatureCollection",
          features: [{...feature}],
        };
        let featureType = feature.properties.type;
        positionsByType.push({ type: featureType, position: positionsB });
      });
      
      if(positionsByType){  
        positionsByType.map((pos,index)=> {
          mapManager.map.addSource(`places-${index}`, {
            type: "geojson",
            data: {...pos.position},
            });
              mapManager.addLayer(`device-${pos.type}-${pos.position.features[0]?.properties.deviceId}`, `places-${index}`, `icon-${pos.type}`, "{name}", 
              pos.position.features[0].properties?.status, pos.position.features[0].properties?.course);
        })
      }

      mapManager.map.scrollZoom.setWheelZoomRate(1.5);

      if (mapManager.map.getSource("raster-tiles") && rasterSource !== "") {
        mapManager.map.getSource("raster-tiles").tiles = [rasterSource];
      }
      return () => {
        positionsByType.map((pos,index)=> {          
          let featureType = pos.type;          
          mapManager.map.removeLayer(`device-${featureType}-${pos.position.features[0]?.properties.deviceId}`);        
          mapManager.map.removeSource(`places-${index}`);
        });
      };
    }
  },[mapReady, mapManager.map]);

  useEffect(()=> {
    if(mapReady && positions){
      positions.features.map((pos, index) => {
       let sourceData = mapManager.map.getSource(`places-${index}`);
          // if(pos.properties.status !== sourceData?._data.features[0].properties.status){
            let layer = mapManager.map.getLayer(`device-${pos.properties.type}-${pos.properties.deviceId}`);
            if(layer && sourceData){
              mapManager.map.removeLayer(`device-${pos.properties.type}-${pos.properties.deviceId}`); 
              sourceData.setData({
                type: "FeatureCollection",
                features: [{...pos}]
              }); 
              mapManager.addLayer(
                `device-${pos.properties.type}-${pos.properties.deviceId}`, 
                `places-${index}`, 
                `icon-${pos.properties.type}`, 
                "{name}", 
                pos.properties.status, pos.properties.course
              );
            }
          // }
       })
    }
 },[positions])

  useEffect(() => {
    if (!mapReady) {
      const bounds = mapManager.calculateBounds(positions.features);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: zoom,
        });
      }
    }

    let positionsByType = [];
      positions.features.map((feature) => {
        let positionsB = {
          type: "FeatureCollection",
          features: [{...feature}],
        }; 
        let featureType = feature.properties.type;
        positionsByType.push({ type: featureType, position: positionsB });
      });
    // console.log(positionsByType)
    positionsByType.map((pos,index) => {
        const source = mapManager.map.getSource(`places-${index}`);
        // console.log(source);
        if (source) {
          source.setData(pos.position);
        }             
    });
  }, [positions]);

  const updatePopup = (object, position) => {
    if(object[0]){
      object[0].remove();
      refreshPopup(position);
    }  
  }

  //Update device data on popup function manually
  useEffect(()=> {
    positions.features.map((position, index) => {
      let deviceData = document.getElementById(`header-${position.properties.deviceId}`)
      let mapboxPopup = document.getElementsByClassName('mapboxgl-popup');
      let sourceData = mapManager.map.getSource(`places-${index}`);
      
      if(deviceData && sourceData){  
        if(buttons){
          buttons.addEventListener("click", function(){   
          updatePopup(mapboxPopup, position);
          })
        }
      }   
    })
  },[devices])

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
        mapManager.map.on("click", `device-${featureType}-${feature.properties.deviceId}`, createPopup);
        mapManager.map.on("mouseenter", `device-${featureType}-${feature.properties.deviceId}`, cursorPointer);
        mapManager.map.on("mouseleave", `device-${featureType}-${feature.properties.deviceId}`, cursorDefault);
      }
      features.push(`${featureType}-${index}`);
    });

    return () => {
      let features = [];
      positions.features.map((feature, index) => {
        let featureType = feature.properties.type;
        if (features.indexOf(`${featureType}-${index}`) === -1) {
          mapManager.map.off("click", `device-${featureType}-${feature.properties.deviceId}`, createPopup);
          mapManager.map.off("mouseenter", `device-${featureType}-${feature.properties.deviceId}`, cursorPointer);
          mapManager.map.off("mouseleave", `device-${featureType}-${feature.properties.deviceId}`, cursorDefault);
        }
        features.push(`${featureType}-${index}`);
      });
    };
  }, [mapManager.map]);
  

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
};

export default MainMap;