import React from "react";
import './DashBoard.css'
import { Container, Stack } from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
const DashBoard = () => {
    return(
        <Container maxWidth="xl" className="Dashboard">
            <Stack className="body-dashboard" direction="column" spacing={2}>
                <PrimarySearchAppBar/>
                <p>Tổng quan</p>
                <Stack className="overview" direction="row" spacing={2}>
                    <Stack className="infor">

                    </Stack>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar />
                    </LocalizationProvider>
                </Stack>
                <p>Thống kê</p>
            </Stack>
        </Container>
    )
}
export default DashBoard