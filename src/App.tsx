import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { Navbar } from "./Components/Navbar/Navbar";
import { SnackbarComponent } from "./Components/SnackbarComponent/SnackbarComponent";

import { Account } from "./Components/AccountManagement/Account/Account";
import { AccountCopy } from "./Components/AccountManagement/Account/AccountCopy";

import { SignIn } from "./Components/AccountManagement/SignIn/SignIn";
import { SignUp } from "./Components/AccountManagement/SignUp/SignUp";
import { ResetPassword } from "./Components/AccountManagement/Password/ResetPassword";
import { Calendar } from "./Components/Calendar/Calendar";
import { Location } from "./Components/Location/Location";
import { Challenges } from "./Components/Challenges/Challenges";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./Config/ThemeConfig";

function App() {
  const [session, setSession] = useState<null | object | any>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log(session);

  const addIDToProfiles = async () => {
    if (session) {
      const { data: profile }: any = await supabase
        .from("profiles")
        .select("id");
      const id = profile.some(({ id }: any) => id === session.user.id);

      if (!id) {
        await supabase.from("profiles").upsert(
          {
            id: session.user.id,
            updated_at: new Date(),
          },
          { returning: "minimal" }
        );
      }
    }
  };

  addIDToProfiles();

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarComponent />
        <BrowserRouter>
          {session && <Navbar />}
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/calendar" element={<Calendar session={session} />} />
            <Route path="/location" element={<Location />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/account" element={<Account session={session} />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
