import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';
import { notificationReducer as notification } from './notification';
import { modalsReducer as modals } from './modals';

const reducer = combineReducers({
  session,
  devices,
  positions,
  notification,
  modals,
});

export { sessionActions } from './session';
export { devicesActions } from './devices';
export { positionsActions } from './positions';
export { notificationActions } from './notification';
export { modalsActions } from './modals';

export default configureStore({ reducer });
