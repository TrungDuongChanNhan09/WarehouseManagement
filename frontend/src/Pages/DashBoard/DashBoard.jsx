import React from "react";
import './DashBoard.css'
import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import AppBarMenu from "../../Component/AppBar/AppBar.jsx";
import InfoCard from "./Components/InfoCard.jsx";
import PendingIcon from '@mui/icons-material/Pending';

const DashBoard = () => {
    return(
        <Box>
            <Typography variant="h4" gutterBottom>Overview</Typography>
            <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6} md={4}>
                    <InfoCard
                    title="Total Order"
                    value="10"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <InfoCard
                    icon={<PendingIcon />}
                    title="Pending"
                    value="5"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <InfoCard
                    icon={<PendingIcon />}
                    title="Pending"
                    value="5"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <InfoCard
                    icon={<PendingIcon />}
                    title="Pending"
                    value="5"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <InfoCard
                    icon={<PendingIcon />}
                    title="Pending"
                    value="5"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={4}>
                    <InfoCard
                    icon={<PendingIcon />}
                    title="Pending"
                    value="5"
                    />
                </Grid2>
            </Grid2>
        </Box>
    )
}
export default DashBoard