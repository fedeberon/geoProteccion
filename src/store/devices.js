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
              brand: item.attributes.MARCA
                ? item.attributes.MARCA
                : "undefined",
              model: item.attributes.MODELO
                ? item.attributes.MODELO
                : "undefined",
              chasis: item.attributes.CHASIS 
                ? item.attributes.CHASIS 
                : "undefined",
              carPlate: item.attributes.PATENTE
                ? item.attributes.PATENTE
                : "undefined",
              year: item.attributes.ANO ? item.attributes.ANO : "undefined",
              schema: item.attributes.SCHEMA
                ? item.attributes.SCHEMA
                : "undefined",
              type: item.attributes.TYPE ? item.attributes.TYPE : "undefined",
              auth: item.attributes.AUTH ? item.attributes.AUTH : "undefined",
              iccid: item.attributes.ICCID
                ? item.attributes.ICCID
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
