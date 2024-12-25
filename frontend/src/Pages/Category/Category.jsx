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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ApiService from "../../Service/ApiService.jsx";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: "", description: "" });
  const [editCategory, setEditCategory] = useState({ categoryName: "", description: "" });

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

  // Add a new category
  const handleAddCategory = async () => {
    try {
      await ApiService.addCategory(newCategory);
      setNewCategory({ categoryName: "", description: "" });
      fetchCategories(); // Refresh list
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

  // Edit an existing category
  const handleEditCategory = async () => {
    try {
      await ApiService.updateCategory(editCategory);
      fetchCategories(); // Refresh list
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa danh mục:", error);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      await ApiService.deleteCategory(id);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" className="category-page">
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
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton color="default" onClick={() => {
                      setEditCategory(category);
                      setOpenEditDialog(true);
                    }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="default" onClick={() => handleDeleteCategory(category.categoryId)}>
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

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Chỉnh Sửa Danh Mục</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên Danh Mục"
            fullWidth
            margin="normal"
            value={editCategory.categoryName}
            onChange={(e) => setEditCategory({ ...editCategory, categoryName: e.target.value })}
          />
          <TextField
            label="Mô Tả"
            fullWidth
            margin="normal"
            value={editCategory.description}
            onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="default">
            Hủy
          </Button>
          <Button onClick={handleEditCategory} color="primary">
            Lưu Thay Đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Category;
