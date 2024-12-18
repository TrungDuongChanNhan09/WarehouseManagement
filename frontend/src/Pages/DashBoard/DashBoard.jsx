import React from "react";
import './DashBoard.css'
import { Container, Stack } from "@mui/material";
import AppBarMenu from "../../Component/AppBar/AppBar.jsx";
const DashBoard = () => {
    return(
        <Container maxWidth="xl" className="Dashboard">
            <Stack className="body-dashboard" direction="column" spacing={2}>
                {/* <AppBarMenu/> */}
                <p>Trang chủ</p>
            </Stack>
        </Container>
    )
}
export default DashBoard