// import React, { useEffect } from "react";
// import { useState } from "react";
// import './DashBoard.css'
// import { Container, Stack, Typography } from "@mui/material";
// import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
// import FormatAlignJustifyOutlinedIcon from '@mui/icons-material/FormatAlignJustifyOutlined';
// import WorkHistoryOutlined from "@mui/icons-material/WorkHistoryOutlined";
// import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
// import CancelOutlined from "@mui/icons-material/CancelOutlined";
// import DoneAllOutlined from "@mui/icons-material/DoneAllOutlined";
// import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined";
// import { BarChart } from '@mui/x-charts/BarChart';

// import ApiService from "../../Service/ApiService.jsx";
// import { roRO } from "@mui/x-date-pickers/locales";

  
// const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 1200,1200,1188, 6788, 1299];
// const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 2311, 1321, 6788, 1231, 8797];


// const xLabels = [
//   'Tháng 1',
//   'Tháng 2',
//   'Tháng 3',
//   'Tháng 4',
//   'Tháng 5',
//   'Tháng 6',
//   'Tháng 7',
//   'Tháng 8',
//   'Tháng 9',
//   'Tháng 10',
//   'Tháng 11',
//   'Tháng 12',
// ];

// function valueFormatter(value) {
//     return `${value}mm`;
//   }

// const DashBoard = () => {
//     const [quantityProduct, setQuantityProduct] = useState([]);
//     const [totalProduct, setTotalProduct] = useState(0);
//     const [orders, setOrders] = useState([]);
//     const [orderDelivered, setOrderDelivered] = useState([])
//     const [orderCanceled, setOrderCanceled] = useState([]);
//     const fetchQuantityProduct = async () => {
//       try {
//         const response = await ApiService.getAllQuantityProduct();
//         setQuantityProduct(response);
//         setTotalProduct(response.cancelQuantity + response.confirmedQuantity + response.deliveredQuantity + response.onGoingQuantity + response.pendingQuantity);
//       } catch (error) {
//         console.error("Lỗi khi tải thông tin đơn hàng theo trạng thái", error.message);
//       }
//     };

//     const fetchOrder = async() => {
//       try{
//         const response = await ApiService.getAllOrders();
//         setOrders(response);
//         console.log(response);
//         let k = [];
//         let h = [];
//         response.forEach(element => {
//           if(element.orderState == "DELIVERED"){
//             k.push(element)
//           }
//           if(element.orderState == "CANCELLED"){
//             k.push(element)
//           }
//         });
//         setOrderDelivered(k);
//         setOrderCanceled(h)
//       }catch (error){
//         console.error("Lỗi khi tải thông tin các đơn hàng", error.message);
//       }
//     }



//     useEffect(() => {
//       fetchQuantityProduct();
//       fetchOrder();
//     }, []);
//     return(
//         <Container maxWidth="xl" className="Dashboard" sx={{ width: "100%" , height: "100%", display: "flex", flexDirection: "column" }}>
//             <PrimarySearchAppBar />
//             <Stack
//                 sx={{marginTop:"1rem", flexGrow: 1, overflowY: "auto"}} 
//                 overflow={"auto"} 
//                 className="body-dashboard" 
//                 direction="column" 
//                 spacing={2}
                
//                 >
//                 <Typography 
//                     sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"300px"}} 
//                     variant="p">
//                         Tổng quan
//                     </Typography>

//                 <Stack  sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}} className="overview" direction="row" spacing={2}>
//                     <LocalizationProvider dateAdapter={AdapterDayjs} >
//                         <DateCalendar sx={{backgroundColor: "white", borderRadius:"0.5rem", height:"300px"}} />
//                     </LocalizationProvider>
//                     <Stack 
//                         flexWrap="wrap" 
//                         direction={"row"} 
//                         className="infor" 
//                         sx={{padding:"1rem", width:"70%"
//                         }}>
//                         <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                             <FormatAlignJustifyOutlinedIcon sx={{fontSize:"30px"}}/>
//                             <Typography 
//                             sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
//                             variant="p">
//                                 Tổng đơn hàng: {totalProduct}
//                             </Typography>
                           
//                         </Stack>
//                         <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                             <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
//                             <Typography 
//                             sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
//                             variant="p">
//                                 Đang xử lý: {quantityProduct.pendingQuantity}
//                             </Typography>
//                         </Stack>
//                         <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                             <AssignmentTurnedInOutlined sx={{fontSize:"30px"}}/>
//                             <Typography 
//                             sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
//                             variant="p">
//                                 Đã xác nhận: {quantityProduct.confirmedQuantity}
//                             </Typography>
//                         </Stack>
//                         <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                             <LocalShippingOutlined sx={{fontSize:"30px"}}/>
//                             <Typography 
//                             sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
//                             variant="p">
//                                 Đang giao hàng: {quantityProduct.onGoingQuantity}
//                             </Typography>
//                         </Stack>
//                         <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                             <CancelOutlined sx={{fontSize:"30px"}}/>
//                             <Typography 
//                             sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
//                             variant="p">
//                                 Đã hủy: {quantityProduct.cancelQuantity}
//                             </Typography>
//                         </Stack>
//                         <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                             <DoneAllOutlined sx={{fontSize:"30px"}}/>
//                             <Typography 
//                             sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
//                             variant="p">
//                                 Đã giao hàng: {quantityProduct.deliveredQuantity}
//                             </Typography>
//                         </Stack>
//                     </Stack>
//                 </Stack>

//                 <Stack justifyContent={"center"} sx={{backgroundColor: "#E2F1E7",borderRadius:"0.5rem", padding:"1rem"}} direction={"row"}>
//                       <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                         <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
//                         <Typography 
//                         sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px"}} 
//                         variant="p">
//                             Tổng doanh thu: 0
//                         </Typography>
//                     </Stack>
//                       <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                         <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
//                         <Typography 
//                         sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px"}} 
//                         variant="p">
//                             Tổng lô hàng xuất: 0
//                         </Typography>
//                     </Stack>
//                       <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
//                         <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
//                         <Typography 
//                         sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px"}} 
//                         variant="p">
//                             Tổng lô hàng nhập: 0
//                         </Typography>
//                     </Stack>
//                 </Stack>

//                 <Typography 
//                     sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px"}} 
//                     variant="p" 
//                     component="p">Thống kê
//                 </Typography>
//                 <Stack sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}} className="analysis-chart" direction="row" spacing={2}>
                

//                   <BarChart
//                     width={700}
//                     height={300}
//                     series={[
//                       { data: pData, label: 'Số đơn hàng hoàn thành', id: 'Số đơn hàng bị hủy' },
//                       { data: uData, label: 'uv', id: 'uvId' },
//                     ]}
//                     xAxis={[{ data: xLabels, scaleType: 'band' }]}
//                   />
//                 </Stack>
//             </Stack>
//         </Container>
//     )
// }
// export default DashBoard

import React, { useEffect } from "react";
import { useState } from "react";
import './DashBoard.css';
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

import ApiService from "../../Service/ApiService.jsx";
import { roRO } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";


const xLabels = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const DashBoard = () => {
    const [quantityProduct, setQuantityProduct] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [orders, setOrders] = useState([]);
    const [orderDelivered, setOrderDelivered] = useState([]);
    const [orderCanceled, setOrderCanceled] = useState([]);

    const [deliveredData, setDeliveredData] = useState(new Array(12).fill(0));
    const [canceledData, setCanceledData] = useState(new Array(12).fill(0));

    const [selectedYear, setSelectedYear] = useState(dayjs().year()); // Năm mặc định là năm hiện tại

    const fetchQuantityProduct = async () => {
        try {
            const response = await ApiService.getAllQuantityProduct();
            setQuantityProduct(response);
            setTotalProduct(
                response.cancelQuantity +
                    response.confirmedQuantity +
                    response.deliveredQuantity +
                    response.onGoingQuantity +
                    response.pendingQuantity
            );
        } catch (error) {
            console.error("Lỗi khi tải thông tin đơn hàng theo trạng thái", error.message);
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await ApiService.getAllOrders();
            setOrders(response);
            const delivered = new Array(12).fill(0);
            const canceled = new Array(12).fill(0);

            response.forEach((order) => {
                const month = dayjs(order.createdAt).month(); 
                if (order.orderState === "DELIVERED") {
                    delivered[month]++;
                } else if (order.orderState === "CANCELLED") {
                    canceled[month]++;
                }
            });

            setOrderDelivered(delivered);
            setOrderCanceled(canceled);
            setDeliveredData(delivered);
            setCanceledData(canceled);
        } catch (error) {
            console.error("Lỗi khi tải thông tin các đơn hàng", error.message);
        }
    };

    useEffect(() => {
        fetchQuantityProduct();
        fetchOrder();
        console.log(orderCanceled)
    }, []);

    return (
        <Container
            maxWidth="xl"
            className="Dashboard"
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <PrimarySearchAppBar />
            <Stack
                sx={{ marginTop: "1rem", flexGrow: 1, overflowY: "auto" }}
                overflow={"auto"}
                className="body-dashboard"
                direction="column"
                spacing={2}
            >
                <Typography 
                    sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"300px"}} 
                    variant="p">
                        Tổng quan
                </Typography>

                <Stack  sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}} className="overview" direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DateCalendar sx={{backgroundColor: "white", borderRadius:"0.5rem", height:"300px"}} />
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
                                Tổng đơn hàng: {totalProduct}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đang xử lý: {quantityProduct.pendingQuantity}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <AssignmentTurnedInOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đã xác nhận: {quantityProduct.confirmedQuantity}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <LocalShippingOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đang giao hàng: {quantityProduct.onGoingQuantity}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <CancelOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đã hủy: {quantityProduct.cancelQuantity}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",width:"250px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                            <DoneAllOutlined sx={{fontSize:"30px"}}/>
                            <Typography 
                            sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px", width:"200px"}} 
                            variant="p">
                                Đã giao hàng: {quantityProduct.deliveredQuantity}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                <Stack justifyContent={"center"} sx={{backgroundColor: "#E2F1E7",borderRadius:"0.5rem", padding:"1rem"}} direction={"row"}>
                      <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px", margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                        <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
                        <Typography 
                        sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px"}} 
                        variant="p">
                            Tổng doanh thu: 0
                        </Typography>
                    </Stack>
                      <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                        <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
                        <Typography 
                        sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px"}} 
                        variant="p">
                            Tổng lô hàng xuất: 0
                        </Typography>
                    </Stack>
                      <Stack direction={"row"} alignItems={"center"} sx={{backgroundColor:"white", height:"80px",margin:"0.5rem", padding:"1rem", borderRadius:"0.5rem"}}>
                        <WorkHistoryOutlined sx={{fontSize:"30px"}}/>
                        <Typography 
                        sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"10px"}} 
                        variant="p">
                            Tổng lô hàng nhập: 0
                        </Typography>
                    </Stack>
                </Stack>

                <Typography 
                    sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px"}} 
                    variant="p" 
                    component="p">Thống kê
                </Typography>
                <Stack sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}} className="analysis-chart" direction="row" spacing={2}>
                    <BarChart
                        width={700}
                        height={300}
                        series={[
                            {
                                data: deliveredData,
                                label: "Số đơn hàng đã giao",
                                id: "deliveredId",
                            },
                            {
                                data: canceledData,
                                label: "Số đơn hàng bị hủy",
                                id: "canceledId",
                            },
                        ]}
                        xAxis={[
                            {
                                data: xLabels,
                                scaleType: "band",
                            },
                        ]}
                    />
                </Stack>
            </Stack>
        </Container>
    );
};

export default DashBoard;