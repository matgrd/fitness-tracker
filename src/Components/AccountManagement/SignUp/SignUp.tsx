import { useState } from "react";
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
import { NewCommonForm } from "src/Components/Form/NewCommonForm";

import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AnalyticsOutlined } from "@mui/icons-material";

export const SignUp = () => {
  const [progress, setProgress] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: signValues,
    validationSchema: yup.object().shape({
      email: emailValidation,
      password: passwordValidation,
    }),
    onSubmit: async (values) => {
      try {
        setProgress(true);
        const { user, session, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (session) {
          await supabase.from("profiles").insert(
            {
              id: session.user?.id,
              updated_at: new Date(),
            },
            { returning: "minimal" }
          );
        }

        error ? console.log(error) : console.log(user);
        dispatch(
          setSnackbar([true, "success", "Check your email for the login link!"])
        );
      } catch (error: any) {
        dispatch(
          setSnackbar([
            true,
            "warning",
            error.error_description || error.message,
          ])
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
      headerText="Sign up"
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
      buttonText="Sign Up"
      extraFormContent={
        <Grid container sx={{ mt: 1.5 }}>
          <Grid item xs>
            <Link href="/" variant="body2">
              Already have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      }
    />
  );
};
