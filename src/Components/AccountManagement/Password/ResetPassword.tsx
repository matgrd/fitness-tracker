import { useEffect, useState } from "react";
import { useAppDispatch } from "src/Redux/Hooks/Hooks";
import { setSnackbar } from "src/Redux/Slices/snackbarSlice";
import { supabase } from "src/supabaseClient";
import * as yup from "yup";
import { useFormik } from "formik";
import { passwordValidation } from "../ValidationAccountManagement/ValidationAccountManagement";
import { passwordValue } from "../InitialValues/InitialValues";
import { FormField } from "../../Form/FormField";

import LockResetIcon from "@mui/icons-material/LockReset";
import { CommonForm } from "src/Components/Form/CommonForm";
import ProtectedRoute from "src/Components/ProtectedRoute/ProtectedRoute";

export const ResetPassword = () => {
  const [progress, setProgress] = useState<boolean>(false);
  const [hash, setHash] = useState<null | string>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  const formik = useFormik({
    initialValues: passwordValue,
    validationSchema: yup.object().shape({
      password: passwordValidation,
    }),
    onSubmit: async (values) => {
      try {
        setProgress(true);
        if (!hash) {
          return dispatch(setSnackbar([true, "error", "Sorry, Invalid token"]));
        }
        const hashArr = hash
          .substring(1)
          .split("&")
          .map((param) => param.split("="));

        const type: string = hashArr[4][1];
        const accessToken: string = hashArr[0][1];

        if (type !== "recovery" || !accessToken) {
          dispatch(
            setSnackbar([true, "error", "Invalid access token or type"])
          );
          return;
        }
        const { error } = await supabase.auth.api.updateUser(accessToken, {
          password: values.password,
        });
        if (error) {
          dispatch(setSnackbar([true, "error", "Sorry can't reset password"]));
        }
      } catch (error) {
        dispatch(
          setSnackbar([
            true,
            "error",
            "Sorry, an error occured, try again later",
          ])
        );
      } finally {
        setProgress(false);
        dispatch(setSnackbar([true, "success", "Password changed"]));
      }
    },
  });

  return (
    <ProtectedRoute>
      <CommonForm
        formik={formik}
        progress={progress}
        icon={<LockResetIcon />}
        headerText="Reset Password"
        formBody={
          <FormField
            name="password"
            label="Password"
            autoComplete="current-password"
            type="password"
            formik={formik}
          />
        }
        buttonText="Reset Password"
      />
    </ProtectedRoute>
  );
};
