import { createSlice } from "@reduxjs/toolkit";

const { reducer, actions } = createSlice({
  name: "positions",
  initialState: {
    items: {},
    selectedItems: [],
    lastRemoved: 0,
    listFiltered: false,
  },
  reducers: {
    updateSelectedPositions(state, action) {  
      if(state.selectedItems.findIndex(elem => elem.id === action.payload[0].deviceId) !== -1){
        action.payload.forEach((item) => (state.items[item["deviceId"]] = item));
      } 
    },
    refreshPositions(state, action) {
      action.payload.forEach((item) => (state.items[item["deviceId"]] = item));
    },
    addSelectedDevice(state, action) {
      state.selectedItems.push(action.payload);
    },
    removeSelectedDevice(state, action) {
      let index = state.selectedItems.findIndex(elem => elem.id === action.payload.id);
      state.selectedItems.splice(index, 1);
      // if(state.items[action.payload.id]){
      //   delete state.items[action.payload.id];
      // }      
    },
    resetSelectedItems(state, action){
      state.selectedItems = action.payload;
    },
    updateSelected(state, action){
      if(selectedItems.length > 0){
        action.payload.forEach((item) => (state.selectedItems[item["deviceId"]] = item));
      }      
    },
    lastRemoved(state, action){
      state.lastRemoved = action.payload;
    },
    listFiltered(state, action){
      state.listFiltered = action.payload;
    }
  },
});

export { actions as positionsActions };
export { reducer as positionsReducer };
