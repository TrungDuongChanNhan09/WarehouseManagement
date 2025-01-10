import React, { useState, useEffect } from "react";
import {
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar, 
  Alert
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import AppBarMenu from "../../Component/AppBar/AppBar";
import ApiService from "../../Service/ApiService.jsx";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: "", description: "" });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Confirmation dialog state
  const [categoryToDelete, setCategoryToDelete] = useState(null); // To store category ID to delete
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", 
  });
  
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const data = await ApiService.getAllCategory();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.categoryName || !newCategory.description) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }
    try {
      await ApiService.addCategory(newCategory);
      setNewCategory({ categoryName: "", description: "" });
      fetchCategories();
      setOpenDialog(false);
      showSnackbar("Thêm danh mục thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      showSnackbar("Lỗi khi thêm danh mục. Vui lòng thử lại.", "error");
    }
  };
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) {
      console.log("Không có danh mục được chọn để xóa.");
      return;
    }
    try {
      await ApiService.deleteCategory(categoryToDelete);
      fetchCategories(); // Làm mới danh sách
      setOpenConfirmDialog(false);
      showSnackbar("Xóa danh mục thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      showSnackbar("Xóa danh mục thất bại. Vui lòng thử lại.", "error");
    }
  };
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" className="category-page">
      {/* AppBarMenu */}
      <AppBarMenu />

      {/* Search and Add Button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem", marginTop: "20px" }}
      >
        <Typography variant="h6" fontWeight="bold" color="#495E57">
          Quản Lý Danh Mục
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm..."
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#243642", height: "50px", padding: "0 20px", fontWeight: "bold" }}
            onClick={() => setOpenDialog(true)}
          >
            + Thêm Danh Mục
          </Button>
        </Stack>
      </Stack>

      {/* Category Table */}
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Danh Mục</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="default"
                      onClick={() => {
                        console.log("Selected category for deletion:", category);
                        setCategoryToDelete(category.id);
                        setOpenConfirmDialog(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Add Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Danh Mục"
            fullWidth
            margin="normal"
            value={newCategory.categoryName}
            onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
          />
          <TextField
            label="Mô Tả"
            fullWidth
            margin="normal"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="default">
            Hủy
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Thêm Danh Mục
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa danh mục này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="default">
            Hủy
          </Button>
          <Button onClick={handleDeleteCategory} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "left", horizontal: "bottom" }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        sx={{ width: "auto" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

    </Container>
  );
};

export default Category;
