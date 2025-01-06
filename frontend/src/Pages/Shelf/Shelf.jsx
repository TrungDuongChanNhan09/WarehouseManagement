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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,   // Import Snackbar
  Alert      // Import Alert
} from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";
import ApiService from "../../Service/ApiService.jsx";
import TableShelf from "../../Hooks/TableShelf/TableShelf.jsx";

const style = {
  position: "absolute",
  top: "47%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Shelf = () => {
  const [search, setSearch] = useState("");
  const [shelfs, setShelfs] = useState([]);
  const [inventorys, setInventorys] = useState([]); // Kho hàng
  const [products, setProducts] = useState([]); // Kho hàng
  const [filteredShelfs, setFilteredShelfs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInventoryName, setSelectedInventoryName] = useState(""); 
  const [newShelfData, setNewShelfData] = useState({
    shelfCode: "",
    inventoryid: "", 
    productId: "",
    quantity: 0,
    capacity: 0,
  });

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message content
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity type (success, error, etc.)

  const fetchInventorys = async () => {
    try {
      const response = await ApiService.getAllInventory();
      const openInventorys = response.filter(inventory => inventory.status === "OPEN");
      setInventorys(openInventorys);
      console.log(openInventorys)
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu kho hàng", error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await ApiService.getAllProduct();
      const inStockProducts = response.filter(product => product.productStatus === "IN_STOCK");
      setProducts(inStockProducts); 
      console.log(inStockProducts);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sản phẩm", error.message);
    }
  };
  

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
    fetchInventorys();
    fetchProducts();
  }, []);

  // Tìm kiếm kệ hàng
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
    setSelectedInventoryName(""); 
  };

  // Thêm kệ hàng mới
  const handleAddNewShelf = async () => {
    try {
      const response = await ApiService.addShelf(newShelfData);
      // Set Snackbar message and severity for success
      setSnackbarMessage("Thêm kệ hàng mới thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true); // Open Snackbar
      setShelfs((prev) => [...prev, response]);
      setFilteredShelfs((prev) => [...prev, response]);
      handleCloseAddModal();
    } catch (error) {
      // Set Snackbar message and severity for error
      setSnackbarMessage("Lỗi khi thêm kệ hàng mới. Vui lòng thử lại.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); // Open Snackbar
    }
  };

  // Xử lý khi chọn kho hàng
  const handleInventorySelect = (event) => {
    const selectedId = event.target.value;
    const selectedInventory = inventorys.find((inv) => inv.id === selectedId);
    setNewShelfData({
      ...newShelfData,
      inventoryid: selectedId, // Lưu ID kho hàng vào dữ liệu kệ
    });
    setSelectedInventoryName(selectedInventory?.nameInventory || "");
  };

  return (
    <Container maxWidth="xl" className="Shelf">
      <PrimarySearchAppBar />
      <Stack
        className="shelf-bar"
        sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem" }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", width: "200px" }}
            variant="p"
          >
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
              <FormControl fullWidth>
                <p>Kho hàng</p>
                <Select
                  value={newShelfData.inventoryid} 
                  onChange={handleInventorySelect}  
                  displayEmpty
                >
                  {inventorys.map((inventory) => (
                    <MenuItem key={inventory.id} value={inventory.id}>
                      {inventory.nameInventory}  
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <p>Loại sản phẩm</p>
                <Select
                  value={newShelfData.productId} // Hiển thị sản phẩm đã chọn
                  onChange={(e) => setNewShelfData({ ...newShelfData, productId: e.target.value })}
                  displayEmpty
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.productName}  {/* Hiển thị tên sản phẩm */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Shelf;

