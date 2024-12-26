import React, { useEffect, useState } from "react";
import './Product.css'
import { alpha, Box, Button, Container, Fade, FormControl, InputAdornment, InputBase, InputLabel, MenuItem, Modal, Select, Stack, styled, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MyTable from "../../Component/MyTable";
import ApiService from "../../Service/ApiService";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    width: '100%',
    backgroundColor: 'white',
    '& .MuiInputBase-input': {
      padding: '10px',
      // vertical padding + font size from searchIcon
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12vw',
        '&:focus': {
          width: '20vw',
        },
      },
    },
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    margin: 5,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const columns = [
  { id: 'stt', label: 'STT', minWidth: 50, align: 'center'},
  { id: 'productName', label: 'Tên sản phẩm', minWidth: 100, align: 'left' },
  { id: 'categoryId', label: 'Loại', minWidth: 100, align: 'left' },
  { id: 'supplierId', label: 'Nhà cung cấp', minWidth: 100, align: 'left' },
  { id: 'inventory_quantity', label: 'Số lượng tồn kho', minWidth: 100, align: 'center', format: (value) => value.toLocaleString('en-US'), },
  { id: 'price', label: 'Giá', minWidth: 100, align: 'center', format: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
  { id: 'production_date', label: 'Ngày sản xuất', minWidth: 150, align: 'center', format: (value) => Intl.DateTimeFormat('vi-VN').format(new Date(value)) },
  { id: 'expiration_date', label: 'Ngày hết hạn', minWidth: 150, align: 'center', format: (value) => Intl.DateTimeFormat('vi-VN').format(new Date(value)) },
  // {
  //   id: 'density',
  //   label: 'Density',
  //   minWidth: 170,
  //   align: 'center',
  //   format: (value) => value.toFixed(2),
  // },
];

function createData(productName, categoryId, supplierId, inventory_quantity, price, production_date, expiration_date) {
  return {productName, categoryId, supplierId, inventory_quantity, price, production_date, expiration_date};
}

// const rows = [
//     createData('P1', 'Máy Khoan', 'Tools', 'Bosch', 10, 1000000, new Date(2024, 11, 23), new Date(2026, 0, 1)),
//     createData('P2', 'Galaxy S24 Ultra', 'Electronics', 'Samsung', 25, 24590000, new Date(2024, 10, 15), new Date(2025, 5, 30)),
//     createData('P3', 'Laptop ThinkPad X1', 'Electronics', 'Lenovo', 15, 35000000, new Date(2024, 8, 10), new Date(2025, 8, 10)),
//     createData('P4', 'Bàn phím cơ', 'Accessories', 'Logitech', 50, 1500000, new Date(2024, 6, 1), new Date(2025, 6, 1)),
//     createData('P5', 'Chuột không dây', 'Accessories', 'Razer', 40, 1200000, new Date(2024, 5, 15), new Date(2025, 5, 15)),
//     createData('P6', 'Tivi OLED 4K', 'Electronics', 'LG', 8, 50000000, new Date(2024, 3, 20), new Date(2026, 3, 20)),
//     createData('P7', 'Máy lọc nước RO', 'Home Appliances', 'Kangaroo', 20, 5500000, new Date(2024, 4, 10), new Date(2025, 4, 10)),
//     createData('P8', 'Điều hòa 2 chiều', 'Home Appliances', 'Daikin', 30, 12000000, new Date(2024, 2, 25), new Date(2025, 2, 25)),
//     createData('P9', 'Bộ nồi inox 5 món', 'Kitchenware', 'Sunhouse', 60, 2500000, new Date(2024, 7, 14), new Date(2026, 7, 14)),
//     createData('P10', 'Đèn LED thông minh', 'Electronics', 'Philips', 70, 900000, new Date(2024, 9, 5), new Date(2025, 9, 5)),
// ];

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Product = () => {
    const [filter, setFilter] = useState();

    useEffect(() => {
        console.log('change filter ' + filter);
    },[filter]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [rows, setRows] = React.useState([]);

    const fetchRows = async () => {
      try {
        const response = await ApiService.getAllProduct();
        setRows(response);
      } catch (error) {
        console.error("Lỗi khi tải thông tin các Product", error.message);
      }
    };

    useEffect(() => {
      fetchRows();
    }, []);

    return(
        <Container maxWidth="xl" className="Product" sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column"}}>
            <Stack className="product-bar" sx={{backgroundColor: "#ffffff",padding:"1rem", borderRadius:"0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography 
                        sx={{fontWeight: 'bold', fontSize:"25px", paddingLeft:"10px", width:"auto"}} 
                        variant="p">
                            Quản lý sản phẩm
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Stack className="search-bar" direction={"row"} alignItems={"center"}>
                            <Search>
                                <StyledInputBase sx={{padding:"0rem"}}
                                placeholder="Tìm kiếm"
                                startAdornment={
                                  <InputAdornment className="input-adornment" position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                }
                                inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Stack>

                        <Stack className="filter-bar" direction={"row"} alignItems={"center"}> 
                            <FormControl sx={{width:"200px", marginLeft:"0.5rem", marginRight: "0.5rem"}}>
                                <InputLabel sx={{
                                    "&.Mui-focused": { 
                                        color: "#297342" 
                                    }}} 
                                    id="demo-simple-select-label">
                                        Lọc theo
                                </InputLabel>
                                <Select
                                sx={{
                                        backgroundColor:"white", 
                                        border:"none",
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#297342',
                                        },
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={filter}
                                    label="Lọc theo"
                                    onChange={handleFilterChange
                                        
                                    }
                                >
                                <MenuItem value="">
                                    <em>Không chọn</em>
                                </MenuItem>
                                <MenuItem value={1}>Lớn đến nhỏ</MenuItem>
                                <MenuItem value={2}>Nhỏ đến lớn</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack className="btn-add-inventory-bar" direction={"row"} alignItems={"center"}> 
                            <Button 
                                onClick={handleOpen} 
                                className="btn-setting" 
                                sx={{color: "white", height:"55px", backgroundColor: "#243642"}} variant="contained">
                                <AddIcon sx={{color: "white"}}/>
                                Thêm sản phẩm
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
                <MyTable tableColumns={columns} tableRows={rows} />
            </Stack>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}>
                            <Typography 
                                sx={{fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"200px", marginBottom:"1rem"}} 
                                variant="p">
                                    Thêm kho hàng

                            </Typography>
                            <Stack sx={{ marginTop:"0.5rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1rem", width:"100%"}} id="outlined-basic" label="Tên kho hàng" variant="outlined" />
                                <TextField sx={{margin:"1rem", width:"43%"}} id="outlined-basic" label="Số kệ hàng" variant="outlined" />
                                <TextField sx={{margin:"1rem", width:"43%"}} id="outlined-basic" label="Trạng thái kho" variant="outlined" />
                                <TextField sx={{margin:"1rem", width:"43%"}} id="outlined-basic" label="Diện tích" variant="outlined" />
                                
                            </Stack>
                            <Button 
                                className="btn-setting" 
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                Thêm kho hàng
                            </Button>

                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    )
}
export default Product