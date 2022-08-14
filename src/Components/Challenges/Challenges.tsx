import { useEffect } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { fetchChallenges, setStatus } from "src/Redux/Slices/challengesSlice";
import { useAppDispatch, useAppSelector } from "src/Redux/Hooks/Hooks";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export const Challenges = () => {
  const dispatch = useAppDispatch();

  const checkDate = () => {
    let date = new Date();
    if (date.getDay() === 1 && date.getHours() === 18) {
      console.log("HELLO WORLD!");
      dispatch(setStatus("idle"));
    }
  };
  // setInterval(checkDate, 5000);

  // const dateLoop = setInterval(() => {
  //   checkDate();
  // }, 5000);

  const getMultipleRandom = (arr: Array<{}>, num: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const challengesStatus: string = useAppSelector(
    (state) => state.challenges.status
  );
  const challengesData: [] = useAppSelector((state) => state.challenges.data);

  console.log(challengesData);
  useEffect(() => {
    if (challengesStatus === "idle") {
      dispatch(fetchChallenges());
    }
  }, [challengesStatus, dispatch]);

  return (
    <ProtectedRoute>
      <Box p={5} minHeight="100vh">
        <Grid container spacing={5} sx={{ justifyContent: "center" }}>
          {challengesData &&
            getMultipleRandom(challengesData, 3).map((challenge: any) => {
              return (
                <Grid key={challenge.id} item>
                  <Card sx={{ width: { xs: 250, lg: 400 }, height: 275 }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={challenge.challenge_url}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {challenge.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {challenge.description}
                      </Typography>
                      <Typography
                        variant="overline"
                        component="p"
                        sx={{ textAlign: "right" }}
                      >
                        {challenge.level}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </ProtectedRoute>
  );
};
