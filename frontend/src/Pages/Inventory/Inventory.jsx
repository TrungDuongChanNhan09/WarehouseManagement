import React, { useState, useEffect } from "react";
import {
    Container,
    Stack,
    Button,
    TextField,
    Typography,
    Modal,
    Fade,
    Box,
    Snackbar,
    Alert
} from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
import ApiService from "../../Service/ApiService.jsx";
import NotificationBar from "./NotificationBar/NotificationBar.jsx";
import TableInventory from "../../Hooks/TableInventory/TableInventory.jsx";

const style = {
    position: 'absolute',
    top: '47%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Inventory = () => {
    const [inventoryDetails, setInventoryDetails] = useState({
        typeInventory: "",
        nameInventory: "",
        typeInventoryDescription: "",
        // status: "",
        number_shelf: 0,
        capacity_shelf: 0,
    });

    const [allInventorys, setAllInventorys] = useState([]);
    const [filteredInventorys, setFilteredInventorys] = useState([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventoryDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchInventorys = async () => {
        try {
            const response = await ApiService.getAllInventory();
            setAllInventorys(response);
            setFilteredInventorys(response);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu kho hàng", error.message);
        }
    };

    useEffect(() => {
        fetchInventorys();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = allInventorys.filter((inventory) =>
            inventory.nameInventory.toLowerCase().includes(value)
        );
        setFilteredInventorys(filtered);
    };

    const handleAddInventory = async () => {
        if (
            !inventoryDetails.nameInventory || 
            !inventoryDetails.typeInventory || 
            !inventoryDetails.number_shelf || 
            // !inventoryDetails.status || 
            !inventoryDetails.capacity_shelf || 
            !inventoryDetails.typeInventoryDescription
        ) {
            console.error("Dữ liệu không đầy đủ");
            return;
        }
        
        try {
            await ApiService.addInventory(inventoryDetails);
            setOpen(false);
            fetchInventorys(); 
            setSnackbarMessage("Thêm kho hàng thành công!");
            setOpenSnackbar(true); 
        } catch (error) {
            console.error("Lỗi khi thêm kho hàng:", error);
            setSnackbarMessage("Lỗi khi thêm kho hàng.");
            setOpenSnackbar(true); 
        }
    };

    const [notification, setNotification] = useState({})

    

    return (
        <Container maxWidth="xl" className="Dashboard">
            <PrimarySearchAppBar addNotification={notification}/>
            {/* <NotificationBar addNotification/> */}
            <Stack className="inventory-bar" sx={{backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography sx={{fontWeight: 'bold', fontSize: "20px", paddingLeft: "20px", width: "200px"}} variant="p">
                        Quản lý kho hàng
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ marginBottom: "10px" }}>
                        <TextField
                            placeholder="Tìm kiếm theo tên kệ hàng"
                            variant="outlined"
                            value={search}
                            onChange={handleSearch}
                            sx={{ width: "40%" }}
                        />
                        <Button
                            sx={{
                                backgroundColor: "#243642",
                                color: "white",
                                ":hover": {
                                    backgroundColor: "#1A2B36",
                                },
                            }}
                            variant="contained"
                            onClick={() => setOpen(true)}
                        >
                            Thêm kho hàng
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            <TableInventory searchInventory={filteredInventorys} />
            <Modal open={open} onClose={() => setOpen(false)}>
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography sx={{fontWeight: 'bold', fontSize: "20px", marginBottom: "1rem"}} variant="p">
                            Thêm kho hàng
                        </Typography>
                        <Stack spacing={2}>
                            <TextField  label="Tên kho hàng" variant="outlined" name="nameInventory" value={inventoryDetails.nameInventory} onChange={handleChange} />
                            <TextField label="Loại kho hàng" variant="outlined" name="typeInventory" value={inventoryDetails.typeInventory} onChange={handleChange} />
                            <TextField label="Tổng số kệ" variant="outlined" name="number_shelf" value={inventoryDetails.number_shelf} onChange={handleChange} />

                            {/* <TextField 
                                label="Tình trạng"  
                                variant="outlined" 
                                name="status" 
                                value={inventoryDetails.status} 
                                onChange={handleChange} 
                            /> */}


                            <TextField label="Sức chứa" variant="outlined" name="capacity_shelf" value={inventoryDetails.capacity_shelf} onChange={handleChange} />
                            <TextField label="Mô tả" variant="outlined" name="typeInventoryDescription" value={inventoryDetails.typeInventoryDescription} onChange={handleChange} />
                            <Button sx={{color: "white", height: "50px", backgroundColor: "#243642"}} variant="contained" onClick={handleAddInventory}>Thêm kho hàng</Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">{snackbarMessage}</Alert>
            </Snackbar>
        </Container>
    );
};

export default Inventory;
