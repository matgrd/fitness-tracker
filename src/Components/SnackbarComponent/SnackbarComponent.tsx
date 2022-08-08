import * as React from "react";
import { setSnackbar } from "../../Redux/Slices/snackbarSlice";
import { useAppDispatch, useAppSelector } from "src/Redux/Hooks/Hooks";

import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackbarComponent = () => {
  const dispatch = useAppDispatch();

  const snackbarOpen: boolean = useAppSelector(
    (state) => state.snackbar.snackbarOpen
  );
  const snackbarType: any = useAppSelector(
    (state) => state.snackbar.snackbarType
  );
  const snackbarMessage: string = useAppSelector(
    (state) => state.snackbar.snackbarMessage
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(setSnackbar([false, snackbarType, snackbarMessage]));
  };

  return (
    <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={snackbarType}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};
