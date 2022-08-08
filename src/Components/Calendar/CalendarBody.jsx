import "./calendar.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import nextId from "react-id-generator";

export const CalendarBody = ({
  firstDayOfMonth,
  daysInMonth,
  currentDay,
  currentMonth,
  currentMonthNum,
  selectedDay,
  activeDays,
  setSelectedDay,
  actualMonth,
  weekdays,
}) => {
  let blanks = [];
  for (let i = 0; i < firstDayOfMonth(); i++) {
    blanks.push(<TableCell key={nextId()}>{""}</TableCell>);
  }

  let monthDays = [];
  for (let d = 1; d <= daysInMonth(); d++) {
    let currDay, selectDay, activeDay;

    // Check if day is today
    if (currentDay() == d && currentMonth() == actualMonth()) currDay = "today";

    // Check if day is selected day
    if (selectedDay.day == d && currentMonthNum() == selectedDay.month)
      selectDay = "selected__day";

    monthDays.push(
      <TableCell
        key={d}
        className={`week-day ${currDay} ${selectDay}`}
        onClick={() => setSelectedDay(d)}
      >
        <span className={activeDay}>{d}</span>
      </TableCell>
    );
  }

  let totalSlots = [...blanks, ...monthDays];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells);
    }
  });
  // console.log("rows", rows);
  // console.log("cells", cells);
  console.log("totalSlots", totalSlots);
  // console.log("monthDays", monthDays);
  console.log("weekdays", weekdays);

  return (
    <TableContainer component={Paper}>
      <Table className="calendar">
        <TableHead>
          <TableRow>
            {weekdays.map((day, i) => (
              <TableCell key={i}>{day.substring(0, 2)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((day, i) => (
            <TableRow key={i}>{day}</TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
