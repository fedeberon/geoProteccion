import {createSlice} from '@reduxjs/toolkit';

const {reducer, actions} = createSlice({
  name: 'geofences',
  initialState: {
    items: {},
  },
  reducers: {
    remove(state, action) {
      delete state.items[action.payload];
    },
  }
});

export {actions as geofencesActions};
export {reducer as geofencesReducer};
