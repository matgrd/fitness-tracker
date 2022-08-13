import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/Redux/Hooks/Hooks";
import { setSnackbar } from "src/Redux/Slices/snackbarSlice";
import { supabase } from "src/supabaseClient";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  emailValidation,
  passwordValidation,
} from "../ValidationAccountManagement/ValidationAccountManagement";
import { signValues } from "../InitialValues/InitialValues";
import { FormField } from "../../Form/FormField";

import { ForgottenPassword } from "../Password/ForgottenPassword";
import { NewCommonForm } from "src/Components/Form/NewCommonForm";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export const SignIn = () => {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: signValues,
    validationSchema: yup.object().shape({
      email: emailValidation,
      password: passwordValidation,
    }),
    onSubmit: async (values) => {
      try {
        setProgress(true);
        const { user, session, error } = await supabase.auth.signIn({
          email: values.email,
          password: values.password,
        });
        if (error) {
          dispatch(setSnackbar([true, "error", error.message]));
        } else {
          dispatch(setSnackbar([true, "success", "You have logged in"]));
          navigate("/challenges");
        }
      } catch (error: any) {
        dispatch(
          setSnackbar([true, "error", error.error_description || error.message])
        );
      } finally {
        setProgress(false);
      }
    },
  });

  return (
    <NewCommonForm
      formik={formik}
      progress={progress}
      icon={<LockOutlinedIcon />}
      headerText="Sign in"
      formBody={
        <>
          <FormField
            name="email"
            label="Email Address"
            autoComplete="email"
            formik={formik}
          />
          <FormField
            name="password"
            label="Password"
            autoComplete="current-password"
            type="password"
            formik={formik}
          />
        </>
      }
      buttonText="Sign In"
      extraFormContent={
        <Grid
          container
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
          spacing="3"
          mt="5px"
        >
          <Grid item xs>
            <ForgottenPassword />
          </Grid>
          <Grid item>
            <Link href="/sign-up" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      }
    />
  );
};
