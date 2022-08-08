import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { userSlice } from "../Slices/userSlice";
import { snackbarSlice } from "../Slices/snackbarSlice";

const reducer = combineReducers({
  user: userSlice.reducer,
  snackbar: snackbarSlice.reducer,
});

export const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
