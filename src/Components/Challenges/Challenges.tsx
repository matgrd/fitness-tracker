import { useEffect, useState } from "react";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { fetchChallenges } from "src/Redux/Slices/challengesSlice";
import { useAppDispatch, useAppSelector } from "src/Redux/Hooks/Hooks";
import { supabase } from "src/supabaseClient";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export const Challenges = () => {
  const dispatch = useAppDispatch();
  const currentUser: any = supabase.auth.user();
  const [userChallenges, setUserChallenges] = useState<any>();

  const challengesStatus: string = useAppSelector(
    (state) => state.challenges.status
  );
  const challengesData: [] = useAppSelector((state) => state.challenges.data);

  const getMultipleRandom = async (arr: Array<{}>, num: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    const chosenChallenges = await shuffled.slice(0, num);
    return chosenChallenges;
  };

  const addChallengesToUser = async () => {
    const { data: haveUserChallenges }: any = await supabase
      .from("userChallenges")
      .select("user")
      .eq("user", currentUser.id)
      .single();

    if (!haveUserChallenges) {
      const userChosenChallenges = await getMultipleRandom(challengesData, 3);
      if (userChosenChallenges) {
        const updates = {
          user: currentUser.id,
          first_challenge: userChosenChallenges[0],
          second_challenge: userChosenChallenges[1],
          third_challenge: userChosenChallenges[2],
          updated_at: new Date(),
        };

        let { error } = await supabase
          .from("userChallenges")
          .upsert(updates, { returning: "minimal" });
      }
    }
    const fetchUserChallenges = async () => {
      let { data: userChallenges } = await supabase
        .from("userChallenges")
        .select(`first_challenge, second_challenge, third_challenge`)
        .eq("user", currentUser.id)
        .single();
      setUserChallenges(userChallenges);
    };
    fetchUserChallenges();
  };

  useEffect(() => {
    if (challengesStatus === "idle") {
      dispatch(fetchChallenges());
    }
    if (challengesStatus === "succeeded") {
      addChallengesToUser();
    }
  }, [challengesStatus, dispatch]);

  // const checkDate = () => {
  //   let date = new Date();
  //   if (date.getDay() === 1 && date.getHours() === 18) {
  //     console.log("HELLO WORLD!");
  //     dispatch(setStatus("idle"));
  //   }
  // };
  // setInterval(checkDate, 5000);

  // const dateLoop = setInterval(() => {
  //   checkDate();
  // }, 5000);

  return (
    <ProtectedRoute>
      <Box p={5} minHeight="100vh">
        <Grid container spacing={5} sx={{ justifyContent: "center" }}>
          {userChallenges &&
            Object.keys(userChallenges).map((keyName: any) => {
              return (
                <Grid key={userChallenges[keyName].id} item>
                  <Card
                    sx={{
                      width: { xs: 250, lg: 400 },
                      height: { xs: 275, lg: 375 },
                    }}
                  >
                    <CardMedia
                      sx={{ height: { xs: 140, lg: 250 } }}
                      image={userChallenges[keyName].challenge_url}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {userChallenges[keyName].title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {userChallenges[keyName].description}
                      </Typography>
                      <Typography
                        variant="overline"
                        component="p"
                        sx={{ textAlign: "right" }}
                      >
                        {userChallenges[keyName].level}
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
