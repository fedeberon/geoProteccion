import React, {useRef, useLayoutEffect, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import mapManager from '../utils/mapManager';
import {makeStyles} from '@material-ui/core/styles';
import t from '../common/localization';

const DrawableMap = () => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

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
  }, []);

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
