import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
  snackbarOpen: boolean;
  snackbarType: string;
  snackbarMessage: string;
}

const initialState: SnackbarState = {
  snackbarOpen: false,
  snackbarType: "success",
  snackbarMessage: "",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackbar: (state, action: PayloadAction<[boolean, string, string]>) => {
      state.snackbarOpen = action.payload[0];
      state.snackbarType = action.payload[1];
      state.snackbarMessage = action.payload[2];
    },
  },
});

export const { setSnackbar } = snackbarSlice.actions;
