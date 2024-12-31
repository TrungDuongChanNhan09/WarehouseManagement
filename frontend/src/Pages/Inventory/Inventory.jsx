import React from "react";
import { useState, useEffect } from "react";
import './Inventory.css'
import { Container, Stack, StepConnector, Button, TextField, Divider, Alert } from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
import {Typography} from "@mui/material";
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SortIcon from '@mui/icons-material/Sort';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Add from "@mui/icons-material/Add";
import TableInventory from "../../Hooks/TableInventory/TableInventory.jsx";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import ApiService from "../../Service/ApiService.jsx";
import SearchIcon from '@mui/icons-material/Search';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';


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
    const [age, setAge] = React.useState('');

    const handleChangeSearchFilter = (event) => {
        setAge(event.target.value);
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [inventorys, setInventorys] = useState([]);
    const [inventoryDetails, setInventoryDetails] = useState({
        typeInventory: "",
        nameInventory: "",
        typeInventoryDescription: "",
        status: "",
        number_shelf: 0,
        capacity_shelf: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventoryDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddInventory = async () => {
        if (
            !inventoryDetails.nameInventory || 
            !inventoryDetails.typeInventory || 
            !inventoryDetails.number_shelf || 
            !inventoryDetails.status || 
            !inventoryDetails.capacity_shelf || 
            !inventoryDetails.typeInventoryDescription
        ) {
            console.error("Dữ liệu không đầy đủ");
            return; // Không gửi yêu cầu nếu thiếu dữ liệu
        }
        
        try {
            const response = await ApiService.addInventory(inventoryDetails);
            setOpen(false)
            setInventorys(response)
            Alert("Thêm kho hàng thành công")
        } catch (error) {
            console.error("Lỗi khi thêm kho hàng:", error);
        }
    };

    const [search, setSearch] = useState("");
    const [filteredInventorys, setFilteredInventorys] = useState([]);
    const [allInventorys, setAllInventorys] = useState([]);

    useEffect(() => {
        const fetchInventorys = async () => {
          try {
            const response = await ApiService.getAllInventory();
            setAllInventorys(response);
            setFilteredInventorys(response);
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu kệ hàng", error.message);
          }
        };
    
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
      

    return(
        <Container maxWidth="xl" className="Dashboard">
            <PrimarySearchAppBar/>
            <Stack className="inventory-bar" sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography 
                        sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px"}} 
                        variant="p">
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
                          onClick={handleOpen}
                      >
                          Thêm kho hàng
                      </Button>
                    </Stack>
                </Stack>
            </Stack>
            <TableInventory searchInventory={filteredInventorys} />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {/* <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}> */}
                            <Typography 
                                sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px", marginBottom:"1rem"}} 
                                variant="p">
                                    Thêm kho hàng
                            </Typography>
                            <Stack sx={{ marginTop:"0.5rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField 
                                    sx={{margin:"1rem", width:"100%"}} 
                                    id="outlined-basic" 
                                    label="Tên kho hàng" 
                                    variant="outlined"
                                    name="nameInventory"
                                    value={inventoryDetails.nameInventory}
                                    onChange={handleChange}
                                     />
                                <TextField 
                                    sx={{margin:"1rem", width:"100%"}} 
                                    id="outlined-basic" 
                                    label="Loại kho hàng" variant="outlined" 
                                    name="typeInventory"
                                    value={inventoryDetails.typeInventory}
                                    onChange={handleChange}
                                    />
                                <TextField 
                                    sx={{margin:"1rem", width:"43%"}} 
                                    id="outlined-basic" label="Tổng số kệ" 
                                    variant="outlined" 
                                    name="number_shelf"
                                    value={inventoryDetails.number_shelf}
                                    onChange={handleChange}
                                    />

                                <TextField 
                                    sx={{margin:"1rem", width:"43%"}} 
                                    id="outlined-basic" label="Tình trạng" 
                                    variant="outlined" 
                                    name="status"
                                    value={inventoryDetails.status}
                                    onChange={handleChange}
                                    />

                {/* <Select
                    label="Tình trạng"
                    onChange={handleChange}
                    displayEmpty
                    value={inventoryDetails.status}
                    sx={W}
                >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="CLOSE">CLOSE</MenuItem>
                </Select> */}
                                <TextField 
                                    sx={{margin:"1rem", width:"43%"}} 
                                    id="outlined-basic" 
                                    label="Sức chứa" variant="outlined" 
                                    name="capacity_shelf"
                                    value={inventoryDetails.capacity_shelf}
                                    onChange={handleChange}
                                    />
                                <TextField 
                                    sx={{margin:"1rem", width:"100%"}} 
                                    id="outlined-basic" label="Mô tả" variant="outlined" 
                                    name="typeInventoryDescription"
                                    value={inventoryDetails.typeInventoryDescription}
                                    onChange={handleChange}
                                    />
                                
                                
                                
                            </Stack>
                            <Stack direction={"column"} alignItems={"center"}>

                                <Button 
                                    onClick={() => {
                                        handleAddInventory();
                                    }}
                                    className="btn-setting" 
                                    sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                    Thêm kho hàng
                                </Button>
                            </Stack>

                        {/* </Stack> */}
                    </Box>
                </Fade>
            </Modal>

        </Container>
    )
}
export default Inventory 