import React, { useState, useEffect } from "react";
import {
  Paper,
  Modal,
  Fade,
  TextField,
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Menu,
  MenuItem,
  IconButton,
  Snackbar,  // Add Snackbar for notifications
  Alert,  // Add Alert for Snackbar content
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ApiService from "../../Service/ApiService";

const columns = [
  { id: "stt", label: "STT", minWidth: 30 },
  { id: "customId", label: "ID", maxWidth: 100 },
  { id: "shelfCode", label: "Tên kệ hàng", maxWidth: 140 },
  { id: "inventoryid", label: "Kho hàng", maxWidth: 140 },
  { id: "productId", label: "Loại sản phẩm", maxWidth: 140 },
  { id: "quantity", label: "Tổng sản phẩm", minWidth: 140 },
  { id: "capacity", label: "Sức chứa (sản phẩm)", maxWidth: 100 },
];

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

const TableShelf = ({ searchShelfs }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [shelfs, setShelfs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [inventoryNames, setInventoryNames] = useState({}); 
  const [productNames, setProductNames] = useState({}); 
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const fetchShelfs = async () => {
    try {
      const response = await ApiService.getAllShelf();
      console.log(response)
      setShelfs(response);
      const inventoryNameMap = {};
      const productNameMap = {};
      for (let shelf of response) {
        const inventoryData = await ApiService.getSingleInventory(shelf.inventoryid);
        inventoryNameMap[shelf.inventoryid] = inventoryData.nameInventory;
        
        const productData = await ApiService.getSingleProduct(shelf.productId);
        productNameMap[shelf.productId] = productData.productName;
      }
      setInventoryNames(inventoryNameMap);  
      setProductNames(productNameMap);
    } catch (error) {
      console.error("Lỗi khi tải thông tin các Shelf", error.message);
      setSnackBarMessage('Lỗi khi tải dữ liệu kệ hàng.');
      setSnackBarOpen(true);
    }
  };

  useEffect(() => {
    fetchShelfs();
  }, []);

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleUpdate = () => {
    if (selectedRow) {
      setEditData(selectedRow);
      setIsEditModalOpen(true);
    }
    handleCloseMenu();
  };

  const handleSaveUpdate = async () => {
    try {
      await ApiService.updateShelf(editData.id, editData);
      setSnackBarMessage('Cập nhật thành công!');
      setSnackBarOpen(true);
      setShelfs((prev) =>
        prev.map((item) => (item.id === editData.id ? editData : item))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      setSnackBarMessage('Lỗi khi cập nhật kệ hàng.');
      setSnackBarOpen(true);
    }
  };

  const handleDelete = async () => {
    if (selectedRow && selectedRow.id) {
      const confirmDelete = window.confirm(
        `Bạn có chắc chắn muốn xóa kệ hàng "${selectedRow.shelfCode}"?`
      );
      if (confirmDelete) {
        try {
          await ApiService.deleteShelf(selectedRow.id);
          setSnackBarMessage('Kệ hàng đã được xóa thành công!');
          setSnackBarOpen(true);
          setShelfs((prev) => prev.filter((item) => item.id !== selectedRow.id));
        } catch (error) {
          setSnackBarMessage('Lỗi khi xóa kệ hàng. Vui lòng thử lại.');
          setSnackBarOpen(true);
        } finally {
          handleCloseMenu();
        }
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              {role === "ROLE_STAFF" && (
                <TableCell align="center">Tùy chọn</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchShelfs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell>{index + 1}</TableCell> 
                  <TableCell>{`SH${(index + 1).toString().padStart(2, "0")}`}</TableCell> 
                  {columns.slice(2).map((column) => {
                    let value = row[column.id];
                    if (column.id === "inventoryid" && inventoryNames[value]) {
                      value = inventoryNames[value];  
                    }
                    if (column.id === "productId" && productNames[value]) {
                      value = productNames[value];  
                    }
                    return <TableCell key={column.id}>{value}</TableCell>;
                  })}
                  {role === "ROLE_STAFF" && (
                    <TableCell align="center">
                      <IconButton onClick={(event) => handleOpenMenu(event, row)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={searchShelfs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {role === "ROLE_STAFF" && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
          <MenuItem onClick={handleDelete}>Xóa</MenuItem>
        </Menu>
      )}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Fade in={isEditModalOpen}>
          <Box sx={style}>
            <Typography sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "1rem" }}>
              Cập nhật kệ hàng
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Tên kệ hàng"
                value={editData.shelfCode || ""}
                onChange={(e) =>
                  setEditData({ ...editData, shelfCode: e.target.value })
                }
              />
              <TextField
                label="Kho hàng"
                value={inventoryNames[editData.inventoryid] || ""}
                onChange={(e) =>
                  setEditData({ ...editData, inventoryid: e.target.value })
                }
                disabled
              />
              <TextField
                label="Loại sản phẩm"
                value={productNames[editData.productId] || ""}
                onChange={(e) =>
                  setEditData({ ...editData, productId: e.target.value })
                }
                disabled
              />
              <TextField
                label="Tổng sản phẩm"
                value={editData.quantity || ""}
                onChange={(e) =>
                  setEditData({ ...editData, quantity: e.target.value })
                }
              />
              <TextField
                label="Sức chứa (sản phẩm)"
                value={editData.capacity || ""}
                onChange={(e) =>
                  setEditData({ ...editData, capacity: e.target.value })
                }
              />
              <TextField
                label="Vị trí cột"
                value={editData.coloum || ""}
                onChange={(e) =>
                  setEditData({ ...editData, coloum: e.target.value })
                }
                disabled
              />
              <TextField
                label="Vị trí hàng"
                value={editData.row || ""}
                onChange={(e) =>
                  setEditData({ ...editData, row: e.target.value })
                }
                disabled
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                <Button
                  variant="contained"
                  onClick={handleSaveUpdate}
                >
                  Lưu
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: "100%" }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TableShelf;
  