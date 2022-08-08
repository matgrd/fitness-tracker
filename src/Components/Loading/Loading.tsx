import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const Loading = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <CircularProgress />
    </Box>
  );
};
