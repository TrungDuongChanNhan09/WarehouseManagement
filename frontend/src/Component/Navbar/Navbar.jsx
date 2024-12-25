import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Stack, Button, Typography } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Logo from '../../assets/Logo.svg'
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InputRoundedIcon from '@mui/icons-material/InputRounded';
import SearchAppBar from "../AppBar/AppBar.jsx";


const Navbar = () => {
    const [value, setValue] = useState("dashboard");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [valuePath, setValuePath] = useState(location.pathname);

    useEffect(() => {
        setValuePath(location.pathname);
    }, [location.pathname]);

    const handleChangePage = (event, newValue) => {
        setValue(newValue);
        navigate(newValue); 
    };

    return (
        <>
            <Stack className="Navbar">
                <Stack className="logo" alignItems={"center"}>
                    <img
                        src="https://res.cloudinary.com/dozs7ggs4/image/upload/v1734362317/WarehouseManagement-3_kibnmb.png"
                        alt="Logo"
                    />
                </Stack>

                <Stack justifyContent={"space-between"} sx={{width: "100%",height:"80vh",marginTop:"3rem", padding: "0.7rem"}}>
                    <Stack>
                        {/* <Button className="btn-add-order" sx={{padding: "10px", borderRadius:"10px", width: "175px", border: "2px solid #387478", margin: "1.5rem 1rem 1rem 1rem"}}>
                            <AddIcon sx={{color: "black"}}/>
                            <Typography
                                variant="p"
                                align="left"
                                sx={{
                                    width:"135px",
                                    color: "black",
                                    marginLeft:"10px"
                                }}
                            >Tạo đơn hàng</Typography>
                        </Button> */}
                        <BottomNavigation
                            value={value}
                            onChange={handleChange}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "30vh",
                                width: "100%",
                            }}
                        >
                            <BottomNavigationAction 
                                showLabel={true} 
                                label="Dashboard"
                                value="dashboard"
                                icon={<SpaceDashboardOutlinedIcon />}
                                onClick={() => navigate("/app/home")}
                                className="bottom-navigation" 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start", 
                                    marginTop: "1rem",
                                    padding: "0.5rem",
                                    fontSize: "24px",
                                    flexGrow: 1,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px", 
                                        marginRight: "10px", 
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                            <BottomNavigationAction 
                                showLabel={true} 
                                label="Employee"
                                value="employee"
                                icon={<AssignmentIndOutlinedIcon />}
                                onClick={() => navigate("/app/employee")} 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start", 
                                    marginTop: "1rem",
                                    fontSize: "24px",
                                    padding: "0.5rem",
                                    flexGrow: 1,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px", 
                                        marginRight: "10px", 
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                            <BottomNavigationAction
                                showLabel={true}
                                label="Inventory"
                                value="inventory"
                                icon={<Inventory2OutlinedIcon />}
                                onClick={() => navigate("/app/inventory")} 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    marginTop: "1rem",
                                    padding: "0.5rem",
                                    fontSize: "24px",
                                    flexGrow: 1,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px",
                                        marginRight: "10px",
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                            <BottomNavigationAction
                                showLabel={true}
                                label="Category"
                                value="category"
                                icon={<CategoryOutlinedIcon />}
                                onClick={() => navigate("/app/category")} 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    marginTop: "1rem",
                                    padding: "0.5rem",
                                    fontSize: "24px",
                                    flexGrow: 1,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px",
                                        marginRight: "10px",
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                            <BottomNavigationAction
                                showLabel={true}
                                label="Shelf"
                                value="shelf"
                                icon={<CorporateFareOutlinedIcon />}
                                onClick={() => navigate("/app/shelf")} 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    marginTop: "1rem",
                                    padding: "0.5rem",
                                    fontSize: "24px",
                                    flexGrow: 1,
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px",
                                        marginRight: "10px",
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                            <BottomNavigationAction
                                showLabel={true}
                                label="Product"
                                value="product"
                                icon={<ProductionQuantityLimitsIcon />}
                                onClick={() => navigate("/app/product")} 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexGrow: 1,
                                    justifyContent: "flex-start",
                                    marginTop: "1rem",
                                    padding: "0.5rem",
                                    fontSize: "24px",
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px",
                                        marginRight: "10px",
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                            <BottomNavigationAction
                                showLabel={true}
                                label="Import Shipment"
                                value="importshipment"
                                icon={<InputRoundedIcon />}
                                onClick={() => navigate("/app/importshipment")} 
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexGrow: 1,
                                    justifyContent: "flex-start",
                                    marginTop: "1rem",
                                    padding: "0.5rem",
                                    fontSize: "24px",
                                    textAlign: "left",
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "24px",
                                        marginRight: "10px",
                                    },
                                    "& .MuiBottomNavigationAction-label": {
                                        fontSize: "16px", 
                                    },
                                }}
                            />
                        </BottomNavigation>
                    </Stack>
                
                    <Button className="btn-help" sx={{color: "#297342", background: "none", margin:"0"}} variant="contained">
                        <HelpOutlineIcon sx={{color: "#297342", marginRight:"5px"}}/>
                        Trợ giúp
                    </Button>
                </Stack>
            </Stack>
            <Outlet />
        </>
    );
};

export default Navbar;
