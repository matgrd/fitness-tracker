import { FormikProvider } from "formik";
import { Loading } from "../Loading/Loading";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

interface FormProp {
  formik: any;
  progress: boolean;
  icon: any;
  headerText: string;
  formBody: any;
  buttonText: string;
}

export const CommonForm = ({
  formik,
  progress,
  icon,
  headerText,
  formBody,
  buttonText,
}: FormProp) => {
  return (
    <FormikProvider value={formik}>
      <Container component="section" maxWidth="xl">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 2, bgcolor: "#1b7700" }}>{icon}</Avatar>
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
                sx={{ mt: 3, mb: 2, bgcolor: "#085f00" }}
              >
                {buttonText}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </FormikProvider>
  );
};
