import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'notification',
  initialState: {
    successSnackbarOpen: false,
    successSnackbarMessage: '',
    errorSnackbarOpen: false,
    infoSnackbarOpen: false,
    items: [],
  },
  reducers: {
    apply(state, action) {
      switch (action.payload.type) {
        case "SNACKBAR_SUCCESS":
          return {
            ...state,
            successSnackbarOpen: true,
            successSnackbarMessage: action.payload.message[0],
            items: [...state.items, action.payload.message[0]]
          };
        case "SNACKBAR_CLEAR":
          return {
            ...state,
            successSnackbarOpen: false,
            errorSnackbarOpen: false,
            infoSnackbarOpen: false
          };
        default:
          return state;
      }
    },
    remove(state, action) {
      console.log('something');
      state.items = [];
    }
  }
});

export { actions as notificationActions };
export { reducer as notificationReducer };
