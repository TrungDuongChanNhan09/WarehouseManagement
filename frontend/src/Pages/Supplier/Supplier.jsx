import React, { useEffect, useRef, useState } from "react";
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
  { id: 'phoneNumber', label: 'Số điện thoại', minWidth: 100, align: 'center' },
  { id: 'email', label: 'Email', minWidth: 100, align: 'center' },
  { id: 'action', label: '', align: 'center' },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 5,
};

export default function Supplier() {
    const [filter, setFilter] = useState();
    const [open, setOpen] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const refInput = useRef({});

    const handleChange = ({target}) => {
        refInput.current[target.name] = target.value;
    }

    const handleAddSupplier = async () => {
        const respond = await ApiService.addSupplier(refInput.current);
        if (respond.status === 201) setOpen(false);
    }

    const handleUpdateSupplier = async () => {
        const respond = await ApiService.updateSupplier(selectedRow.id, refInput.current);
        if (respond.status === 200) setOpenEdit(false);
    }

    const handleDeleteButton = async (id) => {
        await ApiService.deleteSupplier(id);
        fetchRows();
    }

    const handleEditButton = (row) => {
        setSelectedRow(row);
        setOpenEdit(true);
        refInput.current = row;
    };
    
    const handleOpen = () => {
        setOpen(true);
        refInput.current.reset();
    };

    const handleClose = () => setOpen(false);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const fetchRows = async () => {
      try {
        const response = await ApiService.getAllSupplier();
        setRows(response);
      } catch (error) {
        console.error("Lỗi khi tải thông tin các Product", error.message);
      }
    };

    useEffect(() => {
        console.log('change filter ' + filter);
    },[filter]);

    useEffect(() => {
        fetchRows();
    }, []);

    useEffect(() => {
        fetchRows();
    }, [open,openEdit]);

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
                                sx={{color: "white", height:"55px", backgroundColor: "#243642"}} variant="contained">
                                <AddIcon sx={{color: "white"}}/>
                                Thêm nhà cung cấp
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
                <MyTable tableColumns={columns} tableRows={rows} handleDeleteButton={handleDeleteButton} handleEditButton={handleEditButton}/>
            </Stack>
            {/* Modal Add */}
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
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Thêm nhà cung cấp
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} name="nameSupplier" label="Tên nhà cung cấp" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"48%" }} onChange={handleChange} name="email" label="Email" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"48%" }} onChange={handleChange} name="phoneNumber" label="Số điện thoại" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} name="address" label="Địa chỉ" variant="outlined" />
                            </Stack>
                            <Button 
                                className="btn-setting"
                                onClick={handleAddSupplier} 
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                Thêm nhà cung cấp
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
            {/* Modal Edit */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEdit}
                onClose={()=>{setOpenEdit(false)}}
                closeAfterTransition
            >
                <Fade in={openEdit}>
                    <Box sx={style}>
                        <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}>
                            <Typography 
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Cập nhật nhà cung cấp
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1%", width:"100%"}} defaultValue={selectedRow?.nameSupplier || ''} onChange={handleChange} name="nameSupplier" label="Tên nhà cung cấp" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"48%" }} defaultValue={selectedRow?.email || ''} onChange={handleChange} name="email" label="Email" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"48%" }} defaultValue={selectedRow?.phoneNumber || ''} onChange={handleChange} name="phoneNumber" label="Số điện thoại" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"100%"}} defaultValue={selectedRow?.address || ''} onChange={handleChange} name="address" label="Địa chỉ" variant="outlined" />
                            </Stack>
                            <Button 
                                className="btn-setting"
                                onClick={handleUpdateSupplier}
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                Cập nhật
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    )
}