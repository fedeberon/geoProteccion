import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import mapManager from "../utils/mapManager";
import circleToPolygon from "circle-to-polygon";
import { makeStyles } from "@material-ui/core/styles";
import t from "../common/localization";
import {
  calculatePolygonCenter,
  createCircle,
  createLabels,
  createPolygon,
  createPolyline,
  getCircleAttributes,
  getDistanceBtwnCoords,
  getGeozoneType,
  getPolygonAttributes,
  getPolylineAttributes,
  getGeozoneArea,
  calculateFurthestPoints,
} from "../utils/mapFunctions";
// import MapboxDraw from "@mapbox/mapbox-gl-draw";

const DrawableMap = ({
  geozoneType: type,
  color,
  addGeozoneProperty,
  geozone,
}) => {
  const containerEl = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const [lngLat, setLngLat] = useState([]);
  const [area, setArea] = useState("");
  const [boundaries, setBoundaries] = useState([]);

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

    if (geozone && geozone.id) {
      geozoneType = getGeozoneType(geozone.area);

      switch (geozoneType) {
        case "CIRCLE":
          attributes = getCircleAttributes(geozone, attributes);

          properties.name = geozone.name;
          const circle = createCircle({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          geozonesFiltered.push({
            attributes: { ...attributes },
            properties: { ...properties },
          });

          mapManager.map.addSource(`edit-circle`, {
            type: "geojson",
            data: circle,
          });
          mapManager.addPolygonLayer(
            `edit-circle`,
            `edit-circle`,
            attributes.color,
            "{name}"
          );
          setBoundaries(circle.geometry.coordinates[0]);
          break;
        case "POLYGON":
          attributes = getPolygonAttributes(geozone, attributes);

          properties.name = geozone.name;
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

          mapManager.map.addSource(`edit-polygon`, {
            type: "geojson",
            data: polygon,
          });
          mapManager.addPolygonLayer(
            `edit-polygon`,
            `edit-polygon`,
            attributes.color,
            "{name}"
          );
          setBoundaries(polygon.geometry.coordinates[0]);

          attributes.coordinates = [];
          break;
        case "LINESTRING":
          attributes = getPolylineAttributes(geozone, attributes);

          properties.name = geozone.name;
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

          mapManager.map.addSource(`edit-polyline`, {
            type: "geojson",
            data: polyline,
          });
          mapManager.addLineLayer(
            `edit-polyline`,
            `edit-polyline`,
            attributes.color,
            "{name}"
          );
          setBoundaries(polyline.geometry.coordinates);

          attributes.coordinates = [];
          break;
        default:
          break;
      }

      const labels = createLabels(geozonesFiltered);

      mapManager.map.addSource("edit-labels", {
        type: "geojson",
        data: labels,
      });

      mapManager.addLabelLayer("edit-labels", "edit-labels", "{name}");
    }
    return () => {
      if (geozone && geozone.id) {
        if (mapManager.map.getLayer("edit-circle")) {
          mapManager.map.removeLayer(`edit-circle`);
        }
        if (mapManager.map.getSource("edit-circle")) {
          mapManager.map.removeSource(`edit-circle`);
        }
        if (mapManager.map.getLayer("edit-polygon")) {
          mapManager.map.removeLayer(`edit-polygon`);
        }
        if (mapManager.map.getSource("edit-polygon")) {
          mapManager.map.removeSource(`edit-polygon`);
        }
        if (mapManager.map.getLayer("edit-polyline")) {
          mapManager.map.removeLayer(`edit-polyline`);
        }
        if (mapManager.map.getSource("edit-polyline")) {
          mapManager.map.removeSource(`edit-polyline`);
        }
        if (mapManager.map.getLayer("edit-labels")) {
          mapManager.map.removeLayer(`edit-labels`);
        }
        if (mapManager.map.getSource("edit-labels")) {
          mapManager.map.removeSource(`edit-labels`);
        }
      }
    };
  }, []);

  useEffect(() => {
    mapManager.registerListener(() => setMapReady(true));
    return () => {
      if (mapManager.map.getLayer("circle")) {
        mapManager.map.removeLayer(`circle`);
      }
      if (mapManager.map.getSource("circle")) {
        mapManager.map.removeSource(`circle`);
      }
      if (mapManager.map.getLayer("dot")) {
        mapManager.map.removeLayer(`dot`);
      }
      if (mapManager.map.getSource("dot")) {
        mapManager.map.removeSource(`dot`);
      }
      if (mapManager.map.getLayer("line")) {
        mapManager.map.removeLayer(`line`);
      }
      if (mapManager.map.getSource("line")) {
        mapManager.map.removeSource(`line`);
      }
      if (mapManager.map.getLayer("polygon")) {
        mapManager.map.removeLayer(`polygon`);
      }
      if (mapManager.map.getSource("polygon")) {
        mapManager.map.removeSource(`polygon`);
      }
      if (mapManager.map.getLayer("polyline")) {
        mapManager.map.removeLayer(`polyline`);
      }
      if (mapManager.map.getSource("polyline")) {
        mapManager.map.removeSource(`polyline`);
      }
    };
  }, []);

  function getLngLat(event) {
    let lng = event.lngLat.lng;
    let lat = event.lngLat.lat;

    let zoom = mapManager.map.getZoom();

    if (
      lngLat.length > 0 &&
      Math.abs(
        Math.abs(parseFloat(lngLat[0].lng)) -
          Math.abs(parseFloat(event.lngLat.lng))
      ) <
        0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) &&
      Math.abs(
        Math.abs(parseFloat(lngLat[0].lat)) -
          Math.abs(parseFloat(event.lngLat.lat))
      ) <
        0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))
    ) {
      lng = lngLat[0].lng;
      lat = lngLat[0].lat;
    }

    if (
      lngLat.length > 0 &&
      type === "2" &&
      Math.abs(
        Math.abs(parseFloat(lngLat[lngLat.length - 1].lng)) -
          Math.abs(parseFloat(event.lngLat.lng))
      ) <
        0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) &&
      Math.abs(
        Math.abs(parseFloat(lngLat[lngLat.length - 1].lat)) -
          Math.abs(parseFloat(event.lngLat.lat))
      ) <
        0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))
    ) {
      lng = lngLat[lngLat.length - 1].lng;
      lat = lngLat[lngLat.length - 1].lat;
    }

    setLngLat([...lngLat, { lng: lng, lat: lat }]);

    if (!isViewportDesktop) {
      if (lngLat.length === 0) {
        mapManager.map.addSource(`dot`, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [event.lngLat.lng, event.lngLat.lat],
            },
          },
        });

        mapManager.addDotLayer(`dot`, `dot`, color);
      } else {
        if (mapManager.map.getLayer("dot")) {
          mapManager.map.removeLayer("dot");
        }
        if (mapManager.map.getSource("dot")) {
          mapManager.map.removeSource("dot");
        }
      }
    }
  }

  function drawShape(event) {
    if (lngLat.length === 1 && type === "0") {
      if (mapManager.map.getSource("circle") && lngLat.length > 1) {
        mapManager.map.removeSource(`circle`);
      }

      let distance = getDistanceBtwnCoords(event.lngLat, lngLat[0]);
      distance = distance === 0 ? 1 : distance;

      let circle = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: circleToPolygon([lngLat[0].lng, lngLat[0].lat], distance)
            .coordinates,
        },
        properties: { name: "nombre", description: "" },
      };

      if (mapManager.map.getSource("circle")) {
        mapManager.map.getSource("circle").setData(circle);
        mapManager.map.setPaintProperty("circle", "fill-color", color);
      } else {
        mapManager.map.addSource(`circle`, {
          type: "geojson",
          data: circle,
        });
        mapManager.addPolygonLayer(`circle`, `circle`, color, "{name}");
      }

      let areaString = getGeozoneArea(
        type,
        [lngLat[0].lng, lngLat[0].lat],
        distance
      );
      setArea(areaString);
    }
    if (lngLat.length > 0 && (type === "1" || type === "2")) {
      let coordinates = [];
      let lng = event.lngLat.lng;
      let lat = event.lngLat.lat;

      lngLat.map((element) => {
        coordinates.push([element.lng, element.lat]);
      });

      let zoom = mapManager.map.getZoom();

      if (
        lngLat.length > 1 &&
        Math.abs(
          Math.abs(parseFloat(lngLat[0].lng)) -
            Math.abs(parseFloat(event.lngLat.lng))
        ) <
          0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) &&
        Math.abs(
          Math.abs(parseFloat(lngLat[0].lat)) -
            Math.abs(parseFloat(event.lngLat.lat))
        ) <
          0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))
      ) {
        lng = lngLat[0].lng;
        lat = lngLat[0].lat;
      }

      if (
        lngLat.length > 1 &&
        type === "2" &&
        Math.abs(
          Math.abs(parseFloat(lngLat[lngLat.length - 1].lng)) -
            Math.abs(parseFloat(event.lngLat.lng))
        ) <
          0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom))) &&
        Math.abs(
          Math.abs(parseFloat(lngLat[lngLat.length - 1].lat)) -
            Math.abs(parseFloat(event.lngLat.lat))
        ) <
          0.001 * (0.002 * Math.pow(2, 22 - parseInt(zoom)))
      ) {
        lng = lngLat[lngLat.length - 1].lng;
        lat = lngLat[lngLat.length - 1].lat;
      }

      if (mapManager.map.getLayer("polygon")) {
        mapManager.map.removeLayer(`polygon`);
      }
      if (mapManager.map.getSource("polygon")) {
        mapManager.map.removeSource(`polygon`);
      }
      if (mapManager.map.getLayer("polyline")) {
        mapManager.map.removeLayer(`polyline`);
      }
      if (mapManager.map.getSource("polyline")) {
        mapManager.map.removeSource(`polyline`);
      }

      let line = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [...coordinates, [lng, lat]],
        },
        properties: { name: "nombre", description: "" },
      };

      if (mapManager.map.getSource("line")) {
        mapManager.map.getSource("line").setData(line);
      } else {
        mapManager.map.addSource(`line`, {
          type: "geojson",
          data: line,
        });
        mapManager.addLineLayer(`line`, `line`, color);
      }
    }
  }

  useEffect(() => {
    if (type === "0" && lngLat.length > 1) {
      setLngLat([]);

      addGeozoneProperty("area", area);
    }

    if (type === "1" && lngLat.length > 1) {
      let coordinates = [];

      lngLat.map((element) => {
        coordinates.push([element.lng, element.lat]);
      });

      let stringifiedArray = [];

      coordinates.map((element) => {
        stringifiedArray.push(element.toString());
      });

      if (stringifiedArray.length !== new Set(stringifiedArray).size) {
        if (mapManager.map.getLayer("line")) {
          mapManager.map.removeLayer(`line`);
        }
        if (mapManager.map.getSource("line")) {
          mapManager.map.removeSource(`line`);
        }

        let polygon = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[...coordinates]],
          },
          properties: { name: "nombre", description: "" },
        };

        mapManager.map.addSource(`polygon`, {
          type: "geojson",
          data: polygon,
        });
        mapManager.addPolygonLayer(`polygon`, `polygon`, color, "{name}");
        setLngLat([]);

        let areaString = getGeozoneArea(type, polygon.geometry.coordinates);
        addGeozoneProperty("area", areaString);
      }
    }

    if (type === "2" && lngLat.length > 1) {
      let coordinates = [];

      lngLat.map((element) => {
        coordinates.push([element.lng, element.lat]);
      });

      let stringifiedArray = [];

      coordinates.map((element) => {
        stringifiedArray.push(element.toString());
      });

      if (stringifiedArray.length !== new Set(stringifiedArray).size) {
        if (mapManager.map.getLayer("line")) {
          mapManager.map.removeLayer(`line`);
        }
        if (mapManager.map.getSource("line")) {
          mapManager.map.removeSource(`line`);
        }

        let polyline = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [...coordinates],
          },
          properties: { name: "nombre", description: "" },
        };

        mapManager.map.addSource(`polyline`, {
          type: "geojson",
          data: polyline,
        });
        mapManager.addLineLayer(`polyline`, `polyline`, color);
        setLngLat([]);

        let areaString = getGeozoneArea(type, polyline.geometry.coordinates);
        addGeozoneProperty("area", areaString);
      }
    }
  }, [lngLat]);

  useEffect(() => {
    setLngLat([]);
    if (mapManager.map.getLayer("circle")) {
      mapManager.map.removeLayer(`circle`);
    }
    if (mapManager.map.getSource("circle")) {
      mapManager.map.removeSource(`circle`);
    }
    if (mapManager.map.getLayer("dot")) {
      mapManager.map.removeLayer(`dot`);
    }
    if (mapManager.map.getSource("dot")) {
      mapManager.map.removeSource(`dot`);
    }
    if (mapManager.map.getLayer("line")) {
      mapManager.map.removeLayer(`line`);
    }
    if (mapManager.map.getSource("line")) {
      mapManager.map.removeSource(`line`);
    }
    if (mapManager.map.getLayer("polygon")) {
      mapManager.map.removeLayer(`polygon`);
    }
    if (mapManager.map.getSource("polygon")) {
      mapManager.map.removeSource(`polygon`);
    }
    if (mapManager.map.getLayer("polyline")) {
      mapManager.map.removeLayer(`polyline`);
    }
    if (mapManager.map.getSource("polyline")) {
      mapManager.map.removeSource(`polyline`);
    }
  }, [type]);

  useEffect(() => {
    mapManager.map.on("click", getLngLat);
    mapManager.map.on("mousemove", drawShape);

    return () => {
      mapManager.map.off("click", getLngLat);
      mapManager.map.off("mousemove", drawShape);
    };
  }, [mapManager.map, lngLat]);

  useEffect(() => {
    if (mapReady && geozone && geozone.id) {
      const bounds = calculateFurthestPoints(boundaries);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 9,
        });
      }
    }
  }, [mapReady]);

  const style = {
    width: "100%",
    height: "100%",
  };

  return <div style={style} ref={containerEl} />;
};

export default DrawableMap;
