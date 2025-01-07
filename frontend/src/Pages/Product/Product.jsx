import React, { useEffect, useRef, useState } from "react";
import './Product.css'
import { alpha, Box, Button, Container, Fade, FormControl, IconButton, InputAdornment, InputBase, InputLabel, MenuItem, Modal, Select, Stack, styled, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MyTable from "../../Component/MyTable";
import ApiService from "../../Service/ApiService";
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import axios from "axios";
import crypto from 'crypto-js';

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
  { id: 'categoryName', label: 'Loại', align: 'center' },
  { id: 'supplierName', label: 'Nhà cung cấp', align: 'center' },
  { id: 'inventory_quantity', label: 'Số lượng', align: 'center'},
  { id: 'unit', label: 'Đơn vị', align: 'center'},
  { id: 'price', label: 'Giá', minWidth: 100, align: 'center', format: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
  { id: 'production_date', label: 'Ngày sản xuất', minWidth: 100, align: 'center', format: (value) => Intl.DateTimeFormat('vi-VN').format(new Date(value)) },
  { id: 'expiration_date', label: 'Ngày hết hạn', minWidth: 100, align: 'center', format: (value) => value ? Intl.DateTimeFormat('vi-VN').format(new Date(value)) : '' },
  { id: 'productStatus', label: 'Trạng thái', align: 'center' },
  { id: 'action', label: '', align: 'center' },
];

const productStatus = [
    "IN_STOCK",
    "OUT_STOCK"
]

// function createData(productName, categoryId, supplierId, inventory_quantity, price, production_date, expiration_date) {
//   return {productName, categoryId, supplierId, inventory_quantity, price, production_date, expiration_date};
// }

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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Product = () => {
    const [filter, setFilter] = useState("");
    const [subfilter, setSubFilter] = useState("");
    const [subFilterVisible, setSubFilterVisible] = useState(false);
    const [search, setSearch] = useState('');
    const refInput = useRef({});
    const [listCategory, setListCategory] = useState([]);
    const [listSupplier, setListSupplier] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        fetchRows();
    }, []);

    // useEffect(() => {
    //     console.log('change filter ' + filter);
    // },[filter]);

    // useEffect(() => {
    //     console.log('change sub filter ' + subfilter);
    // },[subfilter]);

    const handleFilterChange = async (e) => {
        const value = e.target.value;
        setFilter(value);
        setSubFilter("");
        setSubFilterVisible(value !== '');
        setListCategory(await ApiService.getAllCategorys());
        setListSupplier(await ApiService.getAllSupplier());
    }

    const handleSubFilterChange = ({target}) => {
        const value = target.value;
        setSubFilter(value);
    }
    
    const handleChange = ({target}) => {
        refInput.current[target.name] = target.value;
        console.log(refInput);
    }

    const handleChangeProductionDate = (value) => {
        refInput.current['production_date'] = `${value.$y}-${(value.$M + 1).toString().padStart(2, '0')}-${value.$D.toString().padStart(2, '0')}`;
        console.log(refInput);
    }

    const handleChangeExpirationDate = (value) => {
        refInput.current['expiration_date'] = `${value.$y}-${(value.$M + 1).toString().padStart(2, '0')}-${value.$D.toString().padStart(2, '0')}`;
        console.log(refInput);
    }

    const handleAddProduct = async () => {
        await uploadImage();
        const respond = await ApiService.addProduct(refInput.current);
        if (respond.status === 201) setOpen(false);
    }

    const handleUpdateProduct = async () => {
        await uploadImage();
        console.log(refInput.current);
        const respond = await ApiService.updateProduct(selectedRow.id, refInput.current);
        console.log(respond.data);
        if (respond.status === 200) setOpenEdit(false);
    }

    const handleDeleteButton = async (id) => {
        await ApiService.deleteProduct(id);
        fetchRows();
    }

    const handleEditButton = async (row) => {
        setSelectedRow(row);
        refInput.current = row;
        setImages(null);
        setImageUrls(null);

        setListCategory(await ApiService.getAllCategorys());
        setListSupplier(await ApiService.getAllSupplier());

        const updateStates = async () => {
            if (row.image !== null) {
                await setImageUrls(row.image);
                await setPreviewUrl(row.image);
            } else {
                await setImageUrls(null);
                await setPreviewUrl(null);
            }
            setOpenEdit(true);
            console.log(images);
            console.log(imageUrls);
        };
    
        updateStates();
    };

    const handleClickRow = (row) => {
        nav('/app/product/detail/' + row.id);
    }

    const handleOpen = async () => {
        setOpen(true);
        setImages();
        refInput.current = {};
        setListCategory(await ApiService.getAllCategorys());
        setListSupplier(await ApiService.getAllSupplier());
    }
    const handleClose = () => {
        setOpen(false);
        fetchRows();
    }
 
    const fetchRows = async () => {
      try {
        const response = await ApiService.getAllProduct();

        // const updatedRows = await Promise.all(
        //     response.map(async (row) => {
        //         try {
        //             const supplier = await ApiService.getSupplierById(row.supplierId);
        //             const category = await ApiService.getCategoryById(row.categoryId);
        //             return { 
        //               ...row, 
        //               supplierName: supplier?.nameSupplier || '',
        //               categoryName: category?.categoryName || '',
        //             };
        //         } catch (error) {
        //             console.error('Lỗi khi lấy dữ liệu:', error);
        //             return { 
        //               ...row, 
        //               supplierName: '',
        //               categoryName: '',
        //             };
        //         }
        //     })
        // );

        // setRows(updatedRows);

        setRows(response);
      } catch (error) {
        console.error("Lỗi khi tải thông tin các Product", error.message);
      }
    };

    //image upload
    const [images, setImages] = useState(null);
    const [imageUrls, setImageUrls] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // useEffect(() => {
    //     console.log('Updated images:', images);
    //   }, [images]);

    const handleImageChange = (e) => {
        setImages(e.target.files[0]);
        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    };

    const uploadImage = async () => {
        if (!images) {
            setImageUrls(null);
            return;
        }
        
        const publicId = `${refInput.current['productName']}-${refInput.current['supplierId']}`;
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = crypto.SHA1(`public_id=${publicId}&timestamp=${timestamp}Mn2a9bePfKtrHY9Z3q0T_48-YuM`).toString();

        try {
            await axios.post(
                'https://api.cloudinary.com/v1_1/dsygvdfd2/image/destroy',
                {
                    public_id: publicId,
                    signature: signature,
                    api_key: '291288338413912',
                    api_secret: 'Mn2a9bePfKtrHY9Z3q0T_48-YuM',
                    timestamp: timestamp
                }
            );
    
            console.log(`Đã xóa ảnh cũ với public_id: ${publicId}`);
        } catch (error) {
            console.warn('Không tìm thấy ảnh cũ hoặc lỗi khi xóa:', error.response?.data || error.message);
        }
    
        const formData = new FormData();
        formData.append('file', images);
        formData.append('upload_preset', 'phatwarehouse');
        formData.append('public_id', publicId);
    
        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dsygvdfd2/image/upload',
                formData
            );
            const uploadedUrl = response.data.secure_url;
    
            setImageUrls(uploadedUrl);
            refInput.current['image'] = uploadedUrl;
            console.log('Uploaded Image URL:', uploadedUrl);
        } catch (error) {
            console.error('Lỗi khi tải hình ảnh:', error);
        }
    };

    const filteredRows = rows.filter(row => 
        row.productName.toLowerCase().includes(search.toLowerCase()) &&
        ((filter != "" && subfilter != "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter): true)
    );
    

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
                                onChange={(e) => setSearch(e.target.value)}
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
                                    onChange={handleFilterChange}
                                >
                                <MenuItem value="">
                                    <em>Không chọn</em>
                                </MenuItem>
                                <MenuItem value={"Loại"}>Loại</MenuItem>
                                <MenuItem value={"Nhà cung cấp"}>Nhà cung cấp</MenuItem>
                                </Select>
                            </FormControl>

                            {subFilterVisible && (
                                <FormControl sx={{ width: "200px", marginRight: "0.5rem" }}>
                                    <InputLabel id="sub-filter-label">
                                        {filter === 'Loại' ? 'Chọn loại' : 'Chọn nhà cung cấp'}
                                    </InputLabel>
                                    <Select
                                        labelId="sub-filter-label"
                                        id="sub-filter"
                                        value={subfilter}
                                        label={filter === 'Loại' ? 'Chọn loại' : 'Chọn nhà cung cấp'}
                                        onChange={handleSubFilterChange}
                                    >
                                        <MenuItem value="">
                                            <em>Không chọn</em>
                                        </MenuItem>
                                        {filter === 'Loại' ? (
                                            listCategory.map((category) => {
                                                return (
                                                    <MenuItem value={category.categoryName}>{category.categoryName}</MenuItem>
                                                );
                                            })
                                        ) : (
                                            listSupplier.map((supplier) => {
                                                return (
                                                    <MenuItem value={supplier.nameSupplier}>{supplier.nameSupplier}</MenuItem>
                                                );
                                            })
                                        )}
                                    </Select>
                                </FormControl>
                            )}
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
                <MyTable tableColumns={columns} tableRows={filteredRows} handleDeleteButton={handleDeleteButton} handleEditButton={handleEditButton} handleClickRow={handleClickRow}/>
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
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Thêm sản phẩm
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} name="productName" label="Tên sản phẩm" variant="outlined" />
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Loại</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    name="categoryId"
                                    label="Loại"
                                    onChange={handleChange}
                                    >
                                        {listCategory.map((category) => {
                                            return (
                                                <MenuItem value={category.id}>{category.categoryName}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Nhà cung cấp</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    name="supplierId"
                                    label="Nhà cung cấp"
                                    onChange={handleChange}
                                    >
                                        {listSupplier.map((supplier) => {
                                            return (
                                                <MenuItem value={supplier.id}>{supplier.nameSupplier}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} name="unit" label="Đơn vị" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} name="inventory_quantity" label="Số lượng" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"32%" }} onChange={handleChange} name="price" label="Giá" variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={(newValue) => {
                                            handleChangeProductionDate(newValue);
                                        }}
                                        label="Ngày sản xuất" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={(newValue) => {
                                            handleChangeExpirationDate(newValue);
                                        }}
                                        label="Ngày hết hạn" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} multiline="true" name="description" label="Mô tả sản phẩm" variant="outlined" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{margin: '1%', width: "100%"}}
                                />
                                
                                {images !== undefined && (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 100,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Box>
                                )}

                            </Stack>
                            <Button 
                                className="btn-setting"
                                onClick={handleAddProduct}
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                Thêm sản phẩm
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEdit}
                onClose={()=>{
                    setOpenEdit(false)
                    fetchRows()
                }}
                closeAfterTransition
            >
                <Fade in={openEdit}>
                    <Box sx={style}>
                        <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}>
                            <Typography 
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Cập nhật sản phẩm
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} defaultValue={selectedRow?.productName || ''} name="productName" label="Tên sản phẩm" variant="outlined" />
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Loại</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    name="categoryId"
                                    defaultValue={selectedRow?.categoryId ?? ''}
                                    label="Loại"
                                    onChange={handleChange}
                                    >
                                        {listCategory.map((category) => {
                                            return (
                                                <MenuItem value={category.id}>{category.categoryName}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Nhà cung cấp</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    name="supplierId"
                                    defaultValue={selectedRow?.supplierId ?? ''}
                                    label="Nhà cung cấp"
                                    onChange={handleChange}
                                    >
                                        {listSupplier.map((supplier) => {
                                            return (
                                                <MenuItem value={supplier.id}>{supplier.nameSupplier}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} defaultValue={selectedRow?.unit || ''} name="unit" label="Đơn vị" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} defaultValue={selectedRow?.inventory_quantity || 0} name="inventory_quantity" label="Số lượng" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"32%" }} onChange={handleChange} defaultValue={selectedRow?.price || 0} name="price" label="Giá" variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={(newValue) => {
                                            handleChangeProductionDate(newValue);
                                        }}
                                        defaultValue={selectedRow?.production_date ? dayjs(selectedRow?.production_date) : null}
                                        label="Ngày sản xuất" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }}
                                        onChange={(newValue) => {
                                            handleChangeExpirationDate(newValue);
                                        }}
                                        defaultValue={selectedRow?.expiration_date ? dayjs(selectedRow.expiration_date) : null}
                                        label="Ngày hết hạn" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} defaultValue={selectedRow?.description || ''} multiline="true" name="description" label="Mô tả sản phẩm" variant="outlined" />
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        name="productStatus"
                                        defaultValue={selectedRow?.productStatus ?? ''}
                                        label="Trạng thái"
                                        onChange={handleChange}
                                    >
                                        {productStatus.map((status, index) => {
                                            return (
                                                <MenuItem key={index} value={status}>{status}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{margin: '1%', width: "48%"}}
                                />
                                
                                {(imageUrls !== null || images !== null) && (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 100,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                            <Button 
                                className="btn-setting"
                                onClick={handleUpdateProduct}
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
export default Product