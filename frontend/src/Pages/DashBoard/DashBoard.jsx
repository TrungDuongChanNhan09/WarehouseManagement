import React from "react";
import './DashBoard.css'
import { Container, Stack, Typography } from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import FormatAlignJustifyOutlinedIcon from '@mui/icons-material/FormatAlignJustifyOutlined';
import WorkHistoryOutlined from "@mui/icons-material/WorkHistoryOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import DoneAllOutlined from "@mui/icons-material/DoneAllOutlined";
import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined";

import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
    xAxis: [
      {
        label: 'Tổng số đơn hàng',
      },
    ],
    width: 500,
    height: 400,
  };
  
const dataset = [
    {
      london: 59,
      paris: 57,
      newYork: 86,
      seoul: 21,
      month: 'Jan',
    },
    {
      london: 50,
      paris: 52,
      newYork: 78,
      seoul: 28,
      month: 'Feb',
    },
    {
      london: 47,
      paris: 53,
      newYork: 106,
      seoul: 41,
      month: 'Mar',
    },
    {
      london: 54,
      paris: 56,
      newYork: 92,
      seoul: 73,
      month: 'Apr',
    },
    {
      london: 57,
      paris: 69,
      newYork: 92,
      seoul: 99,
      month: 'May',
    },
    {
      london: 60,
      paris: 63,
      newYork: 103,
      seoul: 144,
      month: 'June',
    },
    {
      london: 59,
      paris: 60,
      newYork: 105,
      seoul: 319,
      month: 'July',
    },
    {
      london: 65,
      paris: 60,
      newYork: 106,
      seoul: 249,
      month: 'Aug',
    },
    {
      london: 51,
      paris: 51,
      newYork: 95,
      seoul: 131,
      month: 'Sept',
    },
    {
      london: 60,
      paris: 65,
      newYork: 97,
      seoul: 55,
      month: 'Oct',
    },
    {
      london: 67,
      paris: 64,
      newYork: 76,
      seoul: 48,
      month: 'Nov',
    },
    {
      london: 61,
      paris: 70,
      newYork: 103,
      seoul: 25,
      month: 'Dec',
    },
];

function valueFormatter(value) {
    return `${value}mm`;
  }

const DashBoard = () => {
    return(
        <Container  maxWidth="xl" className="Dashboard" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <PrimarySearchAppBar />
            <Stack
                sx={{marginTop:"1rem", flexGrow: 1, overflowY: "auto"}} 
                overflow={"auto"} 
                className="body-dashboard" 
                direction="column" 
                spacing={2}
                
                >
                <Typography 
                    sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px"}} 
                    variant="p">
                        Tổng quan
                    </Typography>

                <Stack  sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}} className="overview" direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DateCalendar sx={{backgroundColor: "white", borderRadius:"0.5rem"}} />
                    </LocalizationProvider>
                    <Stack 
                        flexWrap="wrap" 
                        direction={"row"} 
                        className="infor" 
                        sx={{padding:"1rem", width:"70%"
                        }}>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <FormatAlignJustifyOutlinedIcon sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Tổng đơn hàng: 0
                            </Typography>
                           
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đang xử lý: 0
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <AssignmentTurnedInOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đã xác nhận: 0
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <LocalShippingOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đang giao hàng: 0
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <CancelOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đã hủy: 0
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <DoneAllOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đã giao hàng: 0
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Typography 
                    sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px"}} 
                    variant="p" 
                    component="p">Thống kê
                </Typography>
                <Stack sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}} className="analysis-chart" direction="row" spacing={2}>
                <BarChart
                    dataset={dataset}
                    yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'seoul', label: 'Đơn hoàn thành', valueFormatter }]}
                    layout="horizontal"
                    {...chartSetting}
                    />
                </Stack>
            </Stack>
        </Container>
    )
}
export default DashBoard