import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Stack, Button, Typography } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import Logo from '../../assets/Logo.svg'

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
            <Stack className="Navbar" justifyContent={"space-between"}>
                <Stack className="logo" alignItems={"center"}>
                    <img
                        src={Logo}
                        alt="Logo"
                    />
                </Stack>
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
                        }}
                    >
                        <BottomNavigationAction
                            showLabel={true} 
                            label="Dashboard"
                            value="dashboard"
                            icon={<DashboardRoundedIcon />}
                            onClick={() => navigate("/app/home")} 
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                maxWidth: "100%",
                                justifyContent: "flex-start", 
                                marginTop: "0.7rem",
                                fontSize: "18px",
                                ".css-1kcvi62-MuiBottomNavigationAction-label.Mui-selected": {
                                    fontSize: "20px",
                                },
                                '.Mui-selected': {
                                    color: '#F25D07',
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: "24px", 
                                    marginRight: "10px", 
                                },
                                ".MuiBottomNavigationAction-label": {
                                    fontSize: "18px",
                                    fontWeight: "bold", 
                                },
                            }}
                        />
                        <BottomNavigationAction
                            showLabel={true}
                            label="Inventory"
                            value="inventory"
                            icon={<InventoryIcon />}
                            onClick={() => navigate("/app/inventory")} 
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                maxWidth: "100%",
                                justifyContent: "flex-start", 
                                marginTop: "0.7rem",
                                fontSize: "18px",
                                ".css-1kcvi62-MuiBottomNavigationAction-label.Mui-selected": {
                                    fontSize: "20px",
                                },
                                '.Mui-selected': {
                                    color: '#F25D07',
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: "24px", 
                                    marginRight: "10px", 
                                },
                                ".MuiBottomNavigationAction-label": {
                                    fontSize: "18px",
                                    fontWeight: "bold", 
                                },
                            }}
                        />
                        <BottomNavigationAction
                            showLabel={true}
                            label="Category"
                            value="category"
                            icon={<CategoryIcon />}
                            onClick={() => navigate("/app/category")} 
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                maxWidth: "100%",
                                justifyContent: "flex-start", 
                                marginTop: "0.7rem",
                                fontSize: "18px",
                                ".css-1kcvi62-MuiBottomNavigationAction-label.Mui-selected": {
                                    fontSize: "20px",
                                },
                                '.Mui-selected': {
                                    color: '#F25D07',
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: "24px", 
                                    marginRight: "10px", 
                                },
                                ".MuiBottomNavigationAction-label": {
                                    fontSize: "18px",
                                    fontWeight: "bold", 
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
                                width: "100%",
                                maxWidth: "100%",
                                justifyContent: "flex-start", 
                                marginTop: "0.7rem",
                                fontSize: "18px",
                                ".css-1kcvi62-MuiBottomNavigationAction-label.Mui-selected": {
                                    fontSize: "20px",
                                },
                                '.Mui-selected': {
                                    color: '#F25D07',
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: "24px", 
                                    marginRight: "10px", 
                                },
                                ".MuiBottomNavigationAction-label": {
                                    fontSize: "18px",
                                    fontWeight: "bold", 
                                },
                            }}
                        />
                    </BottomNavigation>
                </Stack>
                <Button className="btn-add-order" sx={{margin: "0.5rem 0.5rem 0.5rem 0.5rem"}}>
                    <SettingsIcon sx={{color: "black"}}/>
                    <Typography
                        variant="p"
                        align="left"
                        sx={{
                            width:"100%",
                            color: "black",
                            marginLeft:"10px",
                        }}
                    >Cài đặt</Typography>
                </Button>
            </Stack>
        </>
    );
};

export default Navbar;
