import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "src/supabaseClient";
import type { PayloadAction } from "@reduxjs/toolkit";

export const fetchChallenges = createAsyncThunk(
  "challenges/fetchChallenges",
  async () => {
    try {
      const activities = await supabase.from("challenges");
      return activities.data;
    } catch (err: any) {
      return err.message;
    }
  }
);

interface ChallengesState {
  data: [];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: any;
}

const initialState: ChallengesState = {
  data: [],
  status: "idle",
  error: null,
};

export const challengesSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setStatus: (state: any, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChallenges.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setStatus } = challengesSlice.actions;
