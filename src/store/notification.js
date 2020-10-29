import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'notification',
  initialState: {
    successSnackbarOpen: false,
    successSnackbarMessage: '',
    errorSnackbarOpen: false,
    infoSnackbarOpen: false,
  },
  reducers: {
    apply(state, action) {
      console.log(action);
      console.log(action.payload);
      switch (action.payload.type) {
        case "SNACKBAR_SUCCESS":
          return {
            ...state,
            successSnackbarOpen: true,
            successSnackbarMessage: action.payload.message
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
  }
});

export { actions as notificationActions };
export { reducer as notificationReducer };
