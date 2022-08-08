import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";

import useStyles from "src/Config/ThemeSignConfig";

import { FormikProvider } from "formik";
import { Loading } from "src/Components/Loading/Loading";

interface FormProp {
  formik: any;
  progress: boolean;
  icon: any;
  headerText: string;
  formBody: any;
  buttonText: string;
  extraFormContent?: any;
}

export const NewCommonForm = ({
  formik,
  progress,
  icon,
  headerText,
  formBody,
  buttonText,
  extraFormContent,
}: FormProp) => {
  const classes = useStyles();

  return (
    <FormikProvider value={formik}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box component="div" className={classes.paper}>
            <Avatar className={classes.avatar}>{icon}</Avatar>
            <Typography component="h1" variant="h5">
              {headerText}
            </Typography>
            {progress ? (
              <Loading />
            ) : (
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ mt: 1, maxWidth: "500px", width: "100%" }}
              >
                {formBody}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {buttonText}
                </Button>
                {extraFormContent}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </FormikProvider>
  );
};
