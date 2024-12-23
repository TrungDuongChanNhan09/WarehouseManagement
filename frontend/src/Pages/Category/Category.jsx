import React, { useState } from "react";
import "./Category.scss";
import {
  Container,
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppBarMenu from "../../Component/AppBar/AppBar";

const Category = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState({
    categoryId: "",
    categoryName: "",
    description: "",
  });

  const mockCategories = [
    { categoryId: "1", categoryName: "Electronics", description: "Devices and gadgets" },
    { categoryId: "2", categoryName: "Clothing", description: "Apparel and accessories" },
  ];

  const filteredCategories = mockCategories.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleAddCategory = () => {
    // Add new category logic
    console.log(newCategory);
    setOpenDialog(false); 
  };

  const handleEditCategory = () => {
    console.log(editCategory);
    setOpenEditDialog(false);
  };

  const handleOpenEditDialog = (category) => {
    setEditCategory(category);
    setOpenEditDialog(true);
  };

  return (
    <Container maxWidth="xl" className="category-page">
      <AppBarMenu />

      {/* Category Management Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem", marginTop: "20px" }}>
        <Typography variant="h6" fontWeight="bold" color="#495E57">
          Quản Lý Danh Mục
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm..."
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            className="search-bar"
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#243642", height: "50px", padding: "0 20px", fontWeight: "bold" }}
            onClick={() => setOpenDialog(true)} // Open dialog to add new category
          >
            + Thêm Danh Mục
          </Button>
        </Stack>
      </Stack>

      {/* Category Table */}
      <TableContainer component={Paper} className="category-table" sx={{ marginTop: "20px" }}>
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
                    <IconButton color="default" onClick={() => handleOpenEditDialog(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="default">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
