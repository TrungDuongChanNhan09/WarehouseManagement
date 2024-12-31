import React from "react";
import { useState, useEffect } from "react";
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
  const [search, setSearch] = useState("");
  const [shelfs, setShelfs] = useState([]);
  const [filteredShelfs, setFilteredShelfs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newShelfData, setNewShelfData] = useState({
    shelfCode: "",
    inventoryid: "",
    productId: "",
    quantity: 0,
    capacity: 0,
  });

  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    const fetchShelfs = async () => {
      try {
        const response = await ApiService.getAllShelf();
        setShelfs(response);
        setFilteredShelfs(response);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu kệ hàng", error.message);
      }
    };

    fetchShelfs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = shelfs.filter((shelf) =>
      shelf.shelfCode.toLowerCase().includes(value)
    );
    setFilteredShelfs(filtered);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewShelfData({
      shelfCode: "",
      inventoryid: "",
      productId: "",
      quantity: 0,
      capacity: 0,
    });
  };

  const handleAddNewShelf = async () => {
    try {
      const response = await ApiService.addShelf(newShelfData);
      alert("Thêm kệ hàng mới thành công!");
      setShelfs((prev) => [...prev, response]);
      setFilteredShelfs((prev) => [...prev, response]);
      handleCloseAddModal();
    } catch (error) {
      alert("Lỗi khi thêm kệ hàng mới. Vui lòng thử lại.");
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
                        onClick={handleOpenAddModal}
                    >
                        Thêm kệ hàng
                    </Button>
                    </Stack>
                    
                </Stack>

            </Stack>
            <TableShelf searchShelfs={filteredShelfs} />
          <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
            <Fade in={isAddModalOpen}>
              <Box sx={style}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "1rem",
                  }}
                >
                  Thêm kệ hàng mới
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Tên kệ hàng"
                    value={newShelfData.shelfCode}
                    onChange={(e) =>
                      setNewShelfData({ ...newShelfData, shelfCode: e.target.value })
                    }
                  />
                  <TextField
                    label="Kho hàng"
                    value={newShelfData.inventoryid}
                    onChange={(e) =>
                      setNewShelfData({
                        ...newShelfData,
                        inventoryid: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Loại sản phẩm"
                    value={newShelfData.productId}
                    onChange={(e) =>
                      setNewShelfData({ ...newShelfData, productId: e.target.value })
                    }
                  />
                  <TextField
                    label="Tổng sản phẩm"
                    type="number"
                    value={newShelfData.quantity}
                    onChange={(e) =>
                      setNewShelfData({
                        ...newShelfData,
                        quantity: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <TextField
                    label="Sức chứa (sản phẩm)"
                    type="number"
                    value={newShelfData.capacity}
                    onChange={(e) =>
                      setNewShelfData({
                        ...newShelfData,
                        capacity: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <Button
                    sx={{
                      backgroundColor: "#243642",
                    }}
                    variant="contained"
                    onClick={handleAddNewShelf}
                  >
                    Lưu
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Modal>
        </Container>
    )
}
export default Shelf


