import { combineReducers, configureStore} from "@reduxjs/toolkit";

import { sessionReducer as session } from "./session";
import { devicesReducer as devices } from "./devices";
import { positionsReducer as positions } from "./positions";
import { notificationReducer as notification } from "./notification";
import { modalsReducer as modals } from "./modals";
import { geofencesReducer as geofences } from "./geofences";

const reducer = combineReducers({
  session,
  devices,
  positions,
  notification,
  modals,
  geofences,
});

export { sessionActions } from "./session";
export { devicesActions } from "./devices";
export { positionsActions } from "./positions";
export { notificationActions } from "./notification";
export { modalsActions } from "./modals";
export { geofencesActions } from "./geofences";

export default configureStore({ reducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }), });
