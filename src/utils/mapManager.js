import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

let ready = false;
let registeredListener = null;

const registerListener = listener => {
  if (ready) {
    listener();
  } else {
    registeredListener = listener;
  }
};

const loadImage = (url) => {
  return new Promise(imageLoaded => {
    const image = new Image();
    image.onload = () => imageLoaded(image);
    image.src = url;
  });
};

const loadIcon = (key, background, url) => {
  return loadImage(url).then((image) => {
    const canvas = document.createElement('canvas');
    canvas.width = background.width * window.devicePixelRatio;
    canvas.height = background.height * window.devicePixelRatio;
    canvas.style.width = `${background.width}px`;
    canvas.style.height = `${background.height}px`;
    const context = canvas.getContext('2d');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const imageWidth = image.width * window.devicePixelRatio;
    const imageHeight = image.height * window.devicePixelRatio;
    context.drawImage(image, (canvas.width - imageWidth) / 2, (canvas.height - imageHeight) / 2, imageWidth, imageHeight);

    map.addImage(key, context.getImageData(0, 0, canvas.width, canvas.height), {
      pixelRatio: window.devicePixelRatio
    });
  });
};

const addLineLayer = (id, source, color) => {
  const layer = {
    'id': id,
    'type': 'line',
    'source': source,
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': color,
      'line-width': 2
    }
  };
  map.addLayer(layer);
}

const addDotLayer = (id, source, color) => {
  const layer = {
    'id': id,
    'type': 'circle',
    'source': source,
    'paint': {
      'circle-color': color,
      'circle-radius': {
        'base': 4,
        'stops': [
          [12, 4],
          [22, 360]
        ]
      }
    },
  };
  map.addLayer(layer);
}

const addLayer = (id, source, icon, text) => {
  const layer = {
    'id': id,
    'type': 'symbol',
    'source': source,
    'layout': {
      'icon-image': icon,
      'icon-allow-overlap': true,
    },
  };
  if (text) {
    layer.layout = {
      ...layer.layout,
      'text-field': text,
      'text-allow-overlap': true,
      'text-anchor': 'bottom',
      'text-offset': [0, -2],
      'text-font': ['Roboto Regular'],
      'text-size': 12,
    }
    layer.paint = {
      'text-halo-color': 'white',
      'text-halo-width': 1,
    }
  }
  map.addLayer(layer);
}

const addPolygonLayer = (id, source, color) => {
  const layer = {
    'id': id,
    'type': 'fill',
    'source': source,
    'layout': {},
    'paint': {
      'fill-color': color,
      'fill-opacity': 0.5,
    },
  };
  map.addLayer(layer);
}

const addLabelLayer = (id, source, text) => {
  const layer = {
    'id': id,
    'type': 'symbol',
    'source': source,
    'layout': {
      'text-field': text,
      'text-allow-overlap': true,
      'text-anchor': 'bottom',
      'text-offset': [0, 0.5],
      'text-font': ['Roboto Regular'],
      'text-size': 12,
    },
    'paint': {
      'text-halo-color': 'white',
      'text-halo-width': 1,
    }
  };
  map.addLayer(layer);
}

const addMarkerLayer = (id, source, course) => {
  const layer = {
    'id': id,
    'type': 'symbol',
    'source': source,
    'layout': {
      'icon-image': 'triangle',
      'icon-allow-overlap': true,
      'icon-size': 0.02,
      'icon-rotate': {
        'type': 'identity',
        'property': course
      },
    },
  };
  map.addLayer(layer);
}

const calculateBounds = features => {
  if (features && features.length) {
    const first = features[0].geometry.coordinates;
    const bounds = [[...first], [...first]];
    for (let feature of features) {
      const longitude = feature.geometry.coordinates[0]
      const latitude = feature.geometry.coordinates[1]
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
}

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';

/*map = new mapboxgl.Map({
  container: this.mapContainer,
  style: 'https://cdn.traccar.com/map/basic.json',
  center: [0, 0],
  zoom: 1
});*/

const map = new mapboxgl.Map({
  container: element,
  style: {
    'version': 8,
    'sources': {
      'raster-tiles': {
        'type': 'raster',
        'tiles': [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
        ],
        'tileSize': 256,
        'attribution': ''
      }
    },
    'glyphs': 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
    'layers': [
      {
        'id': 'simple-tiles',
        'type': 'raster',
        'source': 'raster-tiles',
        'minzoom': 0,
        'maxzoom': 22
      }
    ]
  },
  center: [0, 0],
  zoom: 1
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

map.on('load', () => {
  map.loadImage(
    'images/icon/triangle.png',
    function (error, image) {
    if (error) throw error;
    map.addImage('triangle', image);
    }
  );

  loadImage('images/background.svg').then((background) => {
    Promise.all([
      loadIcon('icon-marker', background, 'images/icon/marker.svg')
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
  registerListener,
  addLayer,
  addPolygonLayer,
  addLabelLayer,
  addMarkerLayer,
  addDotLayer,
  addLineLayer,
  calculateBounds,
};
