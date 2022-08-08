import { useState } from "react";
// import { Link } from "react-router-dom";

import { useAppDispatch } from "src/Redux/Hooks/Hooks";
import { setSnackbar } from "src/Redux/Slices/snackbarSlice";
import { supabase } from "src/supabaseClient";
import * as yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { emailValidation } from "../ValidationAccountManagement/ValidationAccountManagement";
import { emailValue } from "../InitialValues/InitialValues";
import { FormField } from "../../Form/FormField";
import { Loading } from "src/Components/Loading/Loading";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Link from "@mui/material/Link";

export const ForgottenPassword = () => {
  const [open, setOpen] = useState(false);

  const [progress, setProgress] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: emailValue,
    validationSchema: yup.object().shape({
      email: emailValidation,
    }),
    onSubmit: async (values) => {
      try {
        setProgress(true);
        const { error } = await supabase.auth.api.resetPasswordForEmail(
          values.email,
          {
            redirectTo: "http://localhost:3000/reset-password",
          }
        );
        dispatch(setSnackbar([true, "success", "Check your email!"]));
      } catch (error: any) {
        if (error) {
          dispatch(
            setSnackbar([
              true,
              "error",
              error.error_description || error.message,
            ])
          );
        }
      } finally {
        setProgress(false);
        setOpen(false);
      }
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FormikProvider value={formik}>
      <Box component="div">
        <Link
          component="button"
          onClick={handleClickOpen}
          variant="body2"
          sx={{ textAlign: "left" }}
        >
          Forgot password?
        </Link>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Reset my password</DialogTitle>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <DialogContent>
              <DialogContentText>
                To reset your password, please enter your email address here. We
                will you instructions on how to reset your password shortly
                after.
              </DialogContentText>
              {progress ? (
                <Loading />
              ) : (
                <FormField
                  name="email"
                  label="Email Address"
                  type="email"
                  formik={formik}
                  margin="dense"
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Reset password
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </FormikProvider>
  );
};
