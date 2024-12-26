import React, { useEffect, useState } from "react";
import './Supplier.css'
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
  { id: 'nameSupplier', label: 'Tên nhà cung cấp', minWidth: 100, align: 'left' },
  { id: 'address', label: 'Địa chỉ', minWidth: 100, align: 'left' },
  { id: 'phoneNumber', label: 'Nhà cung cấp', minWidth: 100, align: 'left' },
  { id: 'email', label: 'Số lượng tồn kho', minWidth: 100, align: 'center' },
];

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

export default function Supplier() {
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
        const response = await ApiService.getAllSupplier();
        setRows(response);
      } catch (error) {
        console.error("Lỗi khi tải thông tin các Product", error.message);
      }
    };

    useEffect(() => {
      fetchRows();
    }, []);

    return(
        <Container maxWidth="xl" className="Supplier" sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column"}}>
            <Stack className="Supplier-bar" sx={{backgroundColor: "#ffffff",padding:"1rem", borderRadius:"0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography 
                        sx={{fontWeight: 'bold', fontSize:"25px", paddingLeft:"10px", width:"auto"}} 
                        variant="p">
                            Quản lý nhà cung cấp
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
                                sx={{color: "white", height:"55px", backgroundColor: "#297342"}} variant="contained">
                                <AddIcon sx={{color: "white"}}/>
                                Thêm nhà cung cấp
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
                                sx={{alignContent:"center" , fontWeight: 'bold', fontSize:"20px", paddingLeft:"20px", width:"100%", marginBottom:"1rem"}} 
                                variant="p">
                                    Thêm nhà cung cấp
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
                                Thêm nhà cung cấp
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    )
}