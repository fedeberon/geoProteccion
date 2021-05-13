import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import mapManager from "../utils/mapManager";
import {useSelector} from "react-redux";
import { getCourse } from "../utils/functions";
import { makeStyles } from "@material-ui/core/styles";
import {
  calculatePolygonCenter,
  createFeature,
  createLabels,
  createPolygon,
  createPolyline,
  createCircle,
  getGeozoneType,
  getCircleAttributes,
  getPolygonAttributes,
  getPolylineAttributes,
} from "../utils/mapFunctions";

const MainMap = ({ geozones, areGeozonesVisible, zoom, rasterSource }) => {
  const containerEl = useRef(null);
  const [mapReady, setMapReady] = useState(false); 

  const mapCenter = useSelector((state) => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return [position.longitude, position.latitude];
      }
    }
    return null;
  });

  let states = {
    check_coutries: {
      name: "country=",
      values: [],
    },
    check_species: {
      name: "species=",
      values: [],
    },
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const isViewportDesktop = useSelector(
    (state) => state.session.deviceAttributes.isViewportDesktop
  );

  const positions = useSelector((state) => ({
    type: "FeatureCollection",
    features: Object.values(state.positions.items).map((position) => ({
      type: "Feature",
      course: position.course,
      geometry: {
        type: "Point",
        coordinates: [position.longitude, position.latitude],
      },
      properties: createFeature(
        state.devices.items,
        position,
        isViewportDesktop
      ),
    })),
  }));

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

  useEffect(() => {
    if (mapReady) {
      let positionsByType = [];
      
      positions.features.map((feature, index) => {

        let positionsB = {
          type: "FeatureCollection",
          features: [{...feature}],
          couse: feature.couse
        };
        
        let featureType = feature.properties.type;
        let positionFound = positionsByType.find(pos => pos.type === featureType);

        if (positionFound) {
          positionFound.position.features = [...positionFound.position.features, feature];
        } else {
          positionsByType.push({ type: featureType, position: positionsB });
        }
      });

      positionsByType.map((pos)=> {
        mapManager.map.addSource(pos.type, {
          type: "geojson",
          data: pos.position,
        });
        mapManager.addLayer(`device-${pos.type}`, pos.type, `icon-${pos.type}`, "{name}");
      });

      mapManager.map.scrollZoom.setWheelZoomRate(2);

      if (mapManager.map.getSource("raster-tiles") && rasterSource !== "") {
        mapManager.map.getSource("raster-tiles").tiles = [rasterSource];
      }

      return () => {
        positions.features.map(feature => {
          let featureType = feature.properties.description.match(regexVehicleType)[1];

          if (mapManager.map.getLayer(`device-${featureType}`)) {
            mapManager.map.removeLayer(`device-${featureType}`);
          }
          if (mapManager.map.getSource(featureType)) {
            mapManager.map.removeSource(featureType);
          }
        });
      };
    }
  }, [mapReady]);

  useEffect(() => {
    mapManager.map.easeTo({
      center: mapCenter,
      zoom: zoom,
    });
  }, [mapCenter]);

  useEffect(() => {
    if (!mapCenter) {
      const bounds = mapManager.calculateBounds(positions.features);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: zoom,
        });
      }
    }

    let positionsByType = [];

    positions.features.map((feature, index) => {
      let positionsB = {
        type: "FeatureCollection",
        features: [{...feature}]
      };
      let featureType = feature.properties.type;
      let positionFound = positionsByType.find(pos => pos.type === featureType);

      if (positionFound) {
        positionFound.position.features = [...positionFound.position.features, feature];
      } else {
        positionsByType.push({ type: featureType, position: positionsB });
      }
    });

    positions.features.map(feature => {
      let featureType = feature.properties.type;
      if (mapManager.map.getSource(featureType)) {
        const source = mapManager.map.getSource(featureType);
        let positionFound = positionsByType.find(pos => pos.type === featureType);
        if (source && positionFound) {
          source.setData(positionsByType.find(positionFound));
        }
      }
    });
  }, []);

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

  const cursorPointer = () => {

    mapManager.map.getCanvas().style.cursor = "pointer";    
  };
  const cursorDefault = () => {
    mapManager.map.getCanvas().style.cursor = "";
  };

  useEffect(() => {
    let features = [];
    positions.features.map(feature => {
      let featureType = feature.properties.type;

      if (features.indexOf(featureType) === -1) {
        mapManager.map.on("click", `device-${featureType}`, createPopup);
        mapManager.map.on("mouseenter", `device-${featureType}`, cursorPointer);
        mapManager.map.on("mouseleave", `device-${featureType}`, cursorDefault);
      }
      features.push(featureType);
    });

    return () => {
      let features = [];
      positions.features.map(feature => {
        let featureType = feature.properties.type;

        if (features.indexOf(featureType) === -1) {
          mapManager.map.off("click", `device-${featureType}`, createPopup);
          mapManager.map.off("mouseenter", `device-${featureType}`, cursorPointer);
          mapManager.map.off("mouseleave", `device-${featureType}`, cursorDefault);
        }
        features.push(featureType);
      });
    };
  }, [mapManager.map]);

  useEffect(() => {
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
              mapManager.map.removeSource(`circles-${index}`);
              break;
            } catch (error){
              console.error(error);
            }
          case "POLYGON":
            try{
              mapManager.map.removeLayer(`polygons-${index}`);
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
  }, [geozones]);

  useEffect(() => {
    geozones.map((element, index) => {
      const geozoneType = getGeozoneType(element.area);

      switch (geozoneType) {
        case "CIRCLE":
          mapManager.map.setLayoutProperty(
            `circles-${index}`,
            "visibility",
            areGeozonesVisible ? "visible" : "none"
          );
          break;
        case "POLYGON":
          mapManager.map.setLayoutProperty(
            `polygons-${index}`,
            "visibility",
            areGeozonesVisible ? "visible" : "none"
          );
          break;
        case "LINESTRING":
          mapManager.map.setLayoutProperty(
            `polylines-${index}`,
            "visibility",
            areGeozonesVisible ? "visible" : "none"
          );
          break;
        default:
          break;
      }
    });
    
    try {
      mapManager.map.setLayoutProperty(
        "geozones-labels",
        "visibility",
        areGeozonesVisible ? "visible" : "none"
      );
    } catch(error){
      console.error(error)
    }
    
  }, [areGeozonesVisible]);

  return <div style={style} ref={containerEl} />;
};

export default MainMap;
