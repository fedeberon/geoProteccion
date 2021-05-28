import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "devices",
  initialState: {
    items: {},
    selectedId: null,
    selectedDevice: null,
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(
        (item) =>
          (state.items[item["id"]] = {
            id: item.id,
            attributes: {
              circuitBreaker: item.attributes.circuitBreaker 
                ? item.attributes.circuitBreaker 
                : "undefined",
              alarm: item.attributes.alarm 
                ? item.attributes.alarm 
                : "undefined",
              brand: item.attributes.brand
                ? item.attributes.brand
                : "undefined",
              model: item.attributes.model
                ? item.attributes.model
                : "undefined",
              carPlate: item.attributes.carPlate
                ? item.attributes.carPlate
                : "undefined",
              year: item.attributes.year ? item.attributes.year : "undefined",
              schema: item.attributes.schema
                ? item.attributes.schema
                : "undefined",
              type: item.attributes.type ? item.attributes.type : "undefined",
              auth: item.attributes.auth ? item.attributes.auth : "undefined",
              iccid: item.attributes.iccid
                ? item.attributes.iccid
                : "undefined",
            },
            groupId: item.groupId,
            name: item.name,
            uniqueId: item.uniqueId,
            status: item.status,
            lastUpdate: item.lastUpdate,
            positionId: item.positionId,
            geofenceIds: item.geofenceIds,
            phone: item.phone,
            model: item.model,
            contact: item.contact,
            category: item.category === null ? 'default' : item.category,
            disabled: item.disabled,
          })
      );
    },
    select(state, action) {
      state.selectedId = action.payload.id;
    },
    selectedDevice(state, action) {
      state.selectedDevice = action.payload
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
  },
});

export { actions as devicesActions };
export { reducer as devicesReducer };
