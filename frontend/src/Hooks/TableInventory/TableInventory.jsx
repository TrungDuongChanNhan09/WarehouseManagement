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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ApiService from "../../Service/ApiService";

const columns = [
  { id: "id", label: "ID", minWidth: 30 },
  { id: "nameInventory", label: "Tên kho hàng", maxWidth: 140 },
  { id: "typeInventory", label: "Loại kho hàng", maxWidth: 140 },
  { id: "status", label: "Tình trạng", minWidth: 140 },
  { id: "quantity", label: "Hàng tồn kho (sản phẩm)", minWidth: 140 },
  { id: "number_shelf", label: "Tổng số kệ", maxWidth: 150 },
  { id: "capacity_shelf", label: "Sức chứa (sản phẩm)", maxWidth: 100 },
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

const TableInventory = (filteredInventorys) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inventorys, setInventorys] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const fetchInventorys = async () => {
    try {
      const response = await ApiService.getAllInventory();
      setInventorys(response);
    } catch (error) {
      console.error("Lỗi khi tải thông tin các Inventory", error.message);
    }
  };

  useEffect(() => {
    fetchInventorys();
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
      await ApiService.updateInventory(editData.id, editData);
      alert("Cập nhật thành công!");
      setInventorys((prev) =>
        prev.map((item) => (item.id === editData.id ? editData : item))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      alert("Lỗi khi cập nhật kho hàng!");
    }
  };

  const handleDelete = async () => {
    if (selectedRow && selectedRow.id) {
      const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa kho hàng "${selectedRow.nameInventory}"?`);
      if (confirmDelete) {
        try {
          await ApiService.deleteInventory(selectedRow.id);
          alert("Kho hàng đã được xóa thành công!");
          setInventorys((prev) => prev.filter((item) => item.id !== selectedRow.id));
        } catch (error) {
          alert("Lỗi khi xóa kho hàng. Vui lòng thử lại.");
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

           
              <TableCell align="center">Tùy chọn</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredInventorys.length > 0 ? filteredInventorys : inventorys)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return <TableCell key={column.id}>{value}</TableCell>;
                  })}
                  <TableCell align="center">
                    <IconButton onClick={(event) => handleOpenMenu(event, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={inventorys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
       {(role === "ROLE_ADMIN") && (
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
       )}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Fade in={isEditModalOpen}>
          <Box sx={style}>
            <Typography sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "1rem" }}>
              Thông tin kho hàng
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Tên kho hàng"
                value={editData.nameInventory || ""}
                onChange={(e) => setEditData({ ...editData, nameInventory: e.target.value })}
              />
              <TextField
                label="Loại kho hàng"
                value={editData.typeInventory || ""}
                onChange={(e) => setEditData({ ...editData, typeInventory: e.target.value })}
              />
              <TextField
                label="Tình trạng"
                value={editData.status || ""}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              />
              <TextField
                label="Tổng số kệ"
                value={editData.number_shelf || ""}
                onChange={(e) => setEditData({ ...editData, number_shelf: e.target.value })}
              />
              <TextField
                label="Sức chứa sản phẩm"
                value={editData.capacity_shelf || ""}
                onChange={(e) => setEditData({ ...editData, capacity_shelf: e.target.value })}
              />
              <TextField
                label="Mô tả"
                value={editData.typeInventoryDescription || ""}
                onChange={(e) => setEditData({ ...editData, typeInventoryDescription: e.target.value })}
              />
              <Button sx={{backgroundColor:"#243642"}} variant="contained" onClick={handleSaveUpdate}>
                Cập nhật
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};

export default TableInventory;
