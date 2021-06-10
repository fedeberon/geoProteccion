import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

let ready = false;
let registeredListener = null;

const registerListener = (listener) => {
  if (ready) {
    listener();
  } else {
    registeredListener = listener;
  }
};

const loadImage = (url) => {
  return new Promise((imageLoaded) => {
    const image = new Image();
    image.onload = () => imageLoaded(image);
    image.src = url;
  });
};

const element = document.createElement("div");
element.style.width = "100%";
element.style.height = "100%";

const map = new mapboxgl.Map({
  container: element,
  style: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
          "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        attribution: "",
      },
    },
    glyphs: "https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
  center: [0, 0],
  zoom: 1,
});

const loadIcon = (key, background, url) => {
  return loadImage(url).then((image) => {
    const canvas = document.createElement("canvas");
    canvas.width = background.width * window.devicePixelRatio;
    canvas.height = background.height * window.devicePixelRatio;
    canvas.style.width = `${background.width}px`;
    canvas.style.height = `${background.height}px`;
    const context = canvas.getContext("2d");
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const imageWidth = image.width * window.devicePixelRatio;
    const imageHeight = image.height * window.devicePixelRatio;
    context.drawImage(
      image,
      (canvas.width - imageWidth) / 2,
      (canvas.height - imageHeight) / 2,
      imageWidth,
      imageHeight
    );

    map.addImage(key, context.getImageData(0, 0, canvas.width, canvas.height), {
      pixelRatio: window.devicePixelRatio,
    });
  });
};

const addLineLayer = (id, source, color) => {
  const layer = {
    id: id,
    type: "line",
    source: source,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color,
      "line-width": 5,
    },
  };
  map.addLayer(layer);
};

const addDotLayer = (id, source, color) => {
  const layer = {
    id: id,
    type: "circle",
    source: source,
    paint: {
      "circle-color": color,
      "circle-radius": {
        base: 4,
        stops: [
          [12, 4],
          [22, 360],
        ],
      },
    },
  };
  map.addLayer(layer);
};

const addLayer = (id, source, icon, text, status, course) => {
  const layer = {
    id: id,
    type: "symbol",
    source: source,
    properties: {
      rotation: course
    },
    layout: {
      "icon-image": status === 'offline' ? `${icon}-${status}` : icon,
      "icon-allow-overlap": true,
      "icon-rotate": ['get', 'course']   
    },
  };
  if (text) {
    layer.layout = {
      ...layer.layout,
      "text-field": text,
      "text-allow-overlap": true,
      "text-anchor": "bottom",
      "text-offset": [0, -2],
      "text-font": ["Roboto Regular"],
      "text-size": 13,
    };
    layer.paint = {
      "text-halo-color": "white",
      "text-halo-width": 1,
    };
  }
  map.addLayer(layer);
};

const addPolygonLayer = (id, source, color) => {
  const layer = {
    id: id,
    type: "fill",
    source: source,
    layout: {},
    paint: {
      "fill-color": color,
      "fill-opacity": 0.2,
    },
  };
  map.addLayer(layer);
  // map.addLayer({
  //   id: 'outline',
  //   type: 'line',
  //   source: source,
  //   layout: {},
  //   paint: {
  //     "line-color": color,
  //     "line-width": 4
  //   }
  // })
};

const addLabelLayer = (id, source, text) => {
  try{
    const layer = {
      id: id,
      type: "symbol",
      source: source,
      layout: {
        "text-field": text,
        "text-allow-overlap": true,
        "text-anchor": "bottom",
        "text-offset": [0, 0.5],
        "text-font": ["Roboto Regular"],
        "text-size": 12,
      },
      paint: {
        "text-halo-color": "white",
        "text-halo-width": 1,
      },
    };
    map.addLayer(layer);
  } catch(error){
    console.error(error);
  }  
};

//markers generated from reports
const addMarkerLayer = (id, source, course) => {
  const layer = {
    id: id,
    type: "symbol",
    source: source,
    layout: {
      "icon-image": "triangle",
      "icon-allow-overlap": true,
      "icon-size": 0.04,
      "icon-rotate": {
        type: "identity",
        property: course,
      },
    },
  };
  map.addLayer(layer);
};

const calculateBounds = (features) => {
  if (features && features.length) {
    const first = features[0].geometry.coordinates;
    const bounds = [[...first], [...first]];
    for (let feature of features) {
      const longitude = feature.geometry.coordinates[0];
      const latitude = feature.geometry.coordinates[1];
      if (longitude < bounds[0][0]) {
        bounds[0][0] = longitude;
      } else if (longitude > bounds[1][0]) {
        bounds[1][0] = longitude;
      }
      if (latitude < bounds[0][1]) {
        bounds[0][1] = latitude;
      } else if (latitude > bounds[1][1]) {
        bounds[1][1] = latitude;
      }
    }
    return bounds;
  } else {
    return null;
  }
};

/*map = new mapboxgl.Map({
  container: this.mapContainer,
  style: 'https://cdn.traccar.com/map/basic.json',
  center: [0, 0],
  zoom: 1
});*/


map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

var scale = new mapboxgl.ScaleControl({
  maxWidth: 110,
  unit: 'imperial'
  });
  map.addControl(scale);
   
  scale.setUnit('metric');


map.on("load", () => {

  map.loadImage("images/icon/triangle.png", function (error, image) {
    if (error) throw error;
    map.addImage("triangle", image);
  });

  loadImage("web/images/animal.svg").then((background) => {
    Promise.all([
      loadIcon("icon-animal", background, "web/images/animal.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/animal.svg").then((background) => {
    Promise.all([
      loadIcon("icon-animal-offline", background, "web/images/offline/animal.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/arrow.svg").then((background) => {
    Promise.all([
      loadIcon("icon-arrow", background, "web/images/arrow.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/arrow.svg").then((background) => {
    Promise.all([
      loadIcon("icon-arrow-offline", background, "web/images/offline/arrow.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/bicycle.svg").then((background) => {
    Promise.all([
      loadIcon("icon-bicycle", background, "web/images/bicycle.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/bicycle.svg").then((background) => {
    Promise.all([
      loadIcon("icon-bicycle-offline", background, "web/images/offline/bicycle.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/boat.svg").then((background) => {
    Promise.all([
      loadIcon("icon-boat", background, "web/images/boat.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/boat.svg").then((background) => {
    Promise.all([
      loadIcon("icon-boat-offline", background, "web/images/offline/boat.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/bus.svg").then((background) => {
    Promise.all([
      loadIcon("icon-bus", background, "web/images/bus.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/bus.svg").then((background) => {
    Promise.all([
      loadIcon("icon-bus-offline", background, "web/images/offline/bus.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/car.svg").then((background) => {
    Promise.all([
      loadIcon("icon-car", background, "web/images/car.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/car.svg").then((background) => {
    Promise.all([
      loadIcon("icon-car-offline", background, "web/images/offline/car.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/crane.svg").then((background) => {
    Promise.all([
      loadIcon("icon-crane", background, "web/images/crane.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/crane.svg").then((background) => {
    Promise.all([
      loadIcon("icon-crane-offline", background, "web/images/crane.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/default.svg").then((background) => {
    Promise.all([
      loadIcon("icon-default", background, "web/images/default.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/default.svg").then((background) => {
    Promise.all([
      loadIcon("icon-default-offline", background, "web/images/offline/default.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });
  
  loadImage("web/images/helicopter.svg").then((background) => {
    Promise.all([
      loadIcon("icon-helicopter", background, "web/images/helicopter.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/helicopter.svg").then((background) => {
    Promise.all([
      loadIcon("icon-helicopter-offline", background, "web/images/offline/helicopter.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/motorcycle.svg").then((background) => {
    Promise.all([
      loadIcon("icon-motorcycle", background, "web/images/motorcycle.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/motorcycle.svg").then((background) => {
    Promise.all([
      loadIcon("icon-motorcycle-offline", background, "web/images/offline/motorcycle.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offroad.svg").then((background) => {
    Promise.all([
      loadIcon("icon-offroad", background, "web/images/offroad.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/offroad.svg").then((background) => {
    Promise.all([
      loadIcon("icon-offroad-offline", background, "web/images/offline/offroad.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/person.svg").then((background) => {
    Promise.all([
      loadIcon("icon-person", background, "web/images/person.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/person.svg").then((background) => {
    Promise.all([
      loadIcon("icon-person-offline", background, "web/images/offline/person.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/pickup.svg").then((background) => {
    Promise.all([
      loadIcon("icon-pickup", background, "web/images/offline/pickup.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/pickup.svg").then((background) => {
    Promise.all([
      loadIcon("icon-pickup-offline", background, "web/images/offline/pickup.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/plane.svg").then((background) => {
    Promise.all([
      loadIcon("icon-plane", background, "web/images/plane.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/plane.svg").then((background) => {
    Promise.all([
      loadIcon("icon-plane-offline", background, "web/images/offline/plane.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/scooter.svg").then((background) => {
    Promise.all([
      loadIcon("icon-scooter", background, "web/images/scooter.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/scooter.svg").then((background) => {
    Promise.all([
      loadIcon("icon-scooter-offline", background, "web/images/offline/scooter.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/ship.svg").then((background) => {
    Promise.all([
      loadIcon("icon-ship", background, "web/images/ship.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/ship.svg").then((background) => {
    Promise.all([
      loadIcon("icon-ship-offline", background, "web/images/offline/ship.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/tractor.svg").then((background) => {
    Promise.all([
      loadIcon("icon-tractor", background, "web/images/tractor.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/tractor.svg").then((background) => {
    Promise.all([
      loadIcon("icon-tractor-offline", background, "web/images/offline/tractor.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/train.svg").then((background) => {
    Promise.all([
      loadIcon("icon-train", background, "web/images/train.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/train.svg").then((background) => {
    Promise.all([
      loadIcon("icon-train-offline", background, "web/images/offline/train.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/tram.svg").then((background) => {
    Promise.all([
      loadIcon("icon-tram", background, "web/images/tram.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/tram.svg").then((background) => {
    Promise.all([
      loadIcon("icon-tram-offline", background, "web/images/offline/tram.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/trolleybus.svg").then((background) => {
    Promise.all([
      loadIcon("icon-trolleybus", background, "web/images/trolleybus.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/trolleybus.svg").then((background) => {
    Promise.all([
      loadIcon("icon-trolleybus-offline", background, "web/images/offline/trolleybus.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/truck.svg").then((background) => {
    Promise.all([
      loadIcon("icon-truck", background, "web/images/truck.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/truck.svg").then((background) => {
    Promise.all([
      loadIcon("icon-truck-offline", background, "web/images/offline/truck.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/van.svg").then((background) => {
    Promise.all([
      loadIcon("icon-van", background, "web/images/van.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });

  loadImage("web/images/offline/van.svg").then((background) => {
    Promise.all([
      loadIcon("icon-van-offline", background, "web/images/offline/van.svg"),
    ]).then(() => {
      ready = true;
      if (registeredListener) {
        registeredListener();
        registeredListener = null;
      }
    });
  });
});

export default {
  mapboxgl,
  element,
  map,
  scale,
  registerListener,
  addLayer,
  addPolygonLayer,
  addLabelLayer,
  addMarkerLayer,
  addDotLayer,
  addLineLayer,
  calculateBounds,
};
