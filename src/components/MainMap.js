import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import mapManager from "../utils/mapManager";
import {useSelector} from "react-redux";
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
      mapManager.map.addSource("places", {
        type: "geojson",
        data: positions,
      });
      mapManager.addLayer("device-icon", "places", "icon-marker", "{name}");
      mapManager.map.scrollZoom.setWheelZoomRate(2);

      if (mapManager.map.getSource("raster-tiles") && rasterSource !== "") {
        mapManager.map.getSource("raster-tiles").tiles = [rasterSource];
      }

      return () => {
        mapManager.map.removeLayer("device-icon");
        mapManager.map.removeSource("places");
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

    const source = mapManager.map.getSource("places");
    if (source) {
      source.setData(positions);
    }
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
    mapManager.map.on("click", "device-icon", createPopup);

    mapManager.map.on("mouseenter", "device-icon", cursorPointer);

    mapManager.map.on("mouseleave", "device-icon", cursorDefault);

    return () => {
      mapManager.map.off("click", "device-icon", createPopup);
      mapManager.map.off("mouseenter", "device-icon", cursorPointer);
      mapManager.map.off("mouseleave", "device-icon", cursorDefault);
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
            mapManager.map.removeLayer(`circles-${index}`);
            mapManager.map.removeSource(`circles-${index}`);
            break;
          case "POLYGON":
            mapManager.map.removeLayer(`polygons-${index}`);
            mapManager.map.removeSource(`polygons-${index}`);
            break;
          case "LINESTRING":
            mapManager.map.removeLayer(`polylines-${index}`);
            mapManager.map.removeSource(`polylines-${index}`);
            break;
          default:
            break;
        }
      });
      if(mapManager){
        mapManager.map.removeLayer("geozones-labels");
        mapManager.map.removeSource("geozones-labels");
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
