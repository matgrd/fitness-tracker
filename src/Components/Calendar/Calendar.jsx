import { useEffect, useState } from "react";
import moment from "moment";
import { supabase } from "src/supabaseClient";
import { Grid } from "@mui/material";

import { CalendarBody } from "./CalendarBody";
import { CalendarHead } from "./CalendarHead";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

export const Calendar = ({ session }) => {
  const defaultSelectedDay = {
    day: moment().format("D"),
    month: moment().month(),
  };
  const [value, setValue] = useState();

  const getActivities = async () => {
    if (session) {
      const { data: activities } = await supabase.from("activities");
      setValue(activities);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);
  
  console.log(value);

  const [dateObject, setdateObject] = useState(moment());
  const [showMonthTable, setShowMonthTable] = useState(false);
  const [selectedDay, setSelected] = useState(defaultSelectedDay);

  const allMonths = moment.months();
  const currentMonth = () => dateObject.format("MMMM");
  const currentYear = () => dateObject.format("YYYY");

  const setMonth = (month) => {
    let monthNumber = allMonths.indexOf(month);
    console.log(monthNumber);
    let newDateObject = Object.assign({}, dateObject);
    newDateObject = moment(dateObject).set("month", monthNumber);
    console.log(newDateObject);
    setdateObject(newDateObject);
    setShowMonthTable(false);
  };
  const toggleMonthSelect = () => setShowMonthTable(!showMonthTable);

  /*** CALENDAR BODY ***/
  const setSelectedDay = (day) => {
    setSelected({
      day,
      month: currentMonthNum(),
    });
    // Later refresh data
  };

  const currentMonthNum = () => dateObject.month();
  const daysInMonth = () => dateObject.daysInMonth();
  const currentDay = () => dateObject.format("D");
  const actualMonth = () => moment().format("MMMM");

  const firstDayOfMonth = () => moment(dateObject).startOf("month").format("d");

  return (
    <ProtectedRoute>
      <Grid container spacing={5}>
        <Grid item xs={12} md={12} sx={{ margin: 2 }}>
          <CalendarHead
            allMonths={allMonths}
            currentMonth={currentMonth}
            currentYear={currentYear}
            setMonth={setMonth}
            showMonthTable={showMonthTable}
            toggleMonthSelect={toggleMonthSelect}
          />
          <CalendarBody
            firstDayOfMonth={firstDayOfMonth}
            daysInMonth={daysInMonth}
            currentDay={currentDay}
            currentMonth={currentMonth}
            currentMonthNum={currentMonthNum}
            actualMonth={actualMonth}
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
            weekdays={moment.weekdays()}
          />
        </Grid>
      </Grid>
    </ProtectedRoute>
  );
};
