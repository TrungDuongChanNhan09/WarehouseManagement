import React from "react";
import { useState } from "react";
import './Shelf.css'
import { Container, Stack, StepConnector, Button, TextField, Divider, Alert } from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
import {Typography} from "@mui/material";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SortIcon from '@mui/icons-material/Sort';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Add from "@mui/icons-material/Add";
import TableShelf from "../../Hooks/TableShelf/TableShelf.jsx";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import ApiService from "../../Service/ApiService.jsx";


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    width: '100%',
    backgroundColor: 'white',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));

const Search = styled('div')(({ theme }) => ({
position: 'relative',
borderRadius: theme.shape.borderRadius,
backgroundColor: alpha(theme.palette.common.white, 0.15),
'&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
},
marginLeft: 0,
width: '100%',
[theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
},
}));

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

const Shelf = () => {
    const [age, setAge] = React.useState('');

    const handleChangeSearchFilter = (event) => {
        setAge(event.target.value);
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [shelfDetails, setShelfDetails] = useState({
        nameShelf: "",
        inventoryId:"",
        productId: "",
        quantity: 0,
        capacity: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShelfDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddShelf = async () => {
        if (
            !shelfDetails.nameShelf || 
            !shelfDetails.inventoryId || 
            !shelfDetails.productId || 
            !shelfDetails.quantity || 
            !shelfDetails.capacity 
        ) {
            console.error("Dữ liệu không đầy đủ");
            return; // Không gửi yêu cầu nếu thiếu dữ liệu
        }
        
        try {
            const response = await ApiService.addShelf(shelfDetails)
            setOpen(false)
            Alert("Thêm kệ hàng thành công")
        } catch (error) {
            console.error("Lỗi khi thêm kệ hàng", error);
        }
    };
    return(
        <Container maxWidth="xl" className="Shelf">
            <PrimarySearchAppBar/>
            <Stack className="shelf-bar" sx={{backgroundColor: "#E2F1E7",padding:"1rem", borderRadius:"0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography 
                        sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px"}} 
                        variant="p">
                            Quản lý kệ hàng
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Search>
                            <StyledInputBase sx={{height:"50px"}}
                            placeholder="Tìm kiếm"
                            inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

                        <Stack className="filter-bar" direction={"row"} alignItems={"center"}> 
                            <FormControl sx={{width:"170px", marginLeft:"0.5rem", marginRight: "0.5rem"}}>
                                {/* <SortIcon/> */}
                                <InputLabel id="demo-simple-select-label">Lọc theo</InputLabel>
                                <Select
                                sx={{backgroundColor:"white"}}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChangeSearchFilter}
                                >
                                <MenuItem value={10}>Lớn đến nhỏ</MenuItem>
                                <MenuItem value={20}>Nhỏ đến lớn</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack className="btn-add-inventory-bar" direction={"row"} alignItems={"center"}> 
                            <Button 
                                onClick={handleOpen} 
                                className="btn-setting" 
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                <Add sx={{color: "white"}}/>
                                Thêm kệ hàng
                            </Button>
                        </Stack>
                    </Stack>
                    
                </Stack>

            </Stack>
            <TableShelf/>

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
                                    Thêm kệ hàng
                            </Typography>
                            <Stack sx={{ marginTop:"0.5rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField 
                                    sx={{margin:"1rem", width:"100%"}} 
                                    id="outlined-basic" 
                                    label="Tên kệ hàng" 
                                    variant="outlined"
                                    name="nameInventory"
                                    value={shelfDetails.nameShelf}
                                    onChange={handleChange}
                                     />
                                <TextField 
                                    sx={{margin:"1rem", width:"100%"}} 
                                    id="outlined-basic" 
                                    label="Loại kho hàng" variant="outlined" 
                                    name="typeInventory"
                                    value={shelfDetails.productId}
                                    onChange={handleChange}
                                    />
                                
                                
                            </Stack>
                            <Stack direction={"column"} alignItems={"center"}>

                                <Button 
                                    onClick={() => {
                                        handleAddShelf();
                                    }}
                                    className="btn-setting" 
                                    sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                    Thêm kệ hàng
                                </Button>
                            </Stack>

                        {/* </Stack> */}
                    </Box>
                </Fade>
            </Modal>
        </Container>
    )
}
export default Shelf