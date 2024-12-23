import React, { useState } from "react";
import "./Employee.scss";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppBarMenu from "../../Component/AppBar/AppBar"; // Assuming this is the AppBar component

const Employee = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    warehouseId: "",
    userName: "",
    email: "",
    address: "",
    image: "",
    role: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const mockEmployees = [
    { id: 1, userId: "1", warehouseId: "A1", email: "john@example.com", userName: "John Doe", address: "New York", image: "image_url", role: "ADMIN" },
    // Add more mock employees here
  ];

  const filteredEmployees = mockEmployees.filter((emp) =>
    emp.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page change
  };

  const handleAddEmployee = () => {
    // Add new employee logic
    console.log(newEmployee);
    setOpenDialog(false); // Close the dialog after adding employee
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEmployee({ ...newEmployee, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="xl" className="employee-page">
      <AppBarMenu />
      
      {/* Employee Management Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem", marginTop: "20px" }}>
        <Typography variant="h6" fontWeight="bold" color="#495E57">
          Quản Lý Nhân Viên
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
            onClick={() => setOpenDialog(true)} // Open dialog to add new employee
          >
            + Thêm Nhân Viên
          </Button>
        </Stack>
      </Stack>

      {/* Employee Table */}
      <TableContainer component={Paper} className="employee-table" sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Kho</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Địa Chỉ</TableCell>
              <TableCell>Vai Trò</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow key={employee.userId}>
                  <TableCell>{employee.warehouseId}</TableCell>
                  <TableCell>{employee.userName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.address}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <IconButton color="default">
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
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Employee Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Mã Kho"
            fullWidth
            margin="normal"
            value={newEmployee.warehouseId}
            onChange={(e) => setNewEmployee({ ...newEmployee, warehouseId: e.target.value })}
          />
          <TextField
            label="Tên"
            fullWidth
            margin="normal"
            value={newEmployee.userName}
            onChange={(e) => setNewEmployee({ ...newEmployee, userName: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <TextField
            label="Địa Chỉ"
            fullWidth
            margin="normal"
            value={newEmployee.address}
            onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
          />
          
          {/* Role Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Vai Trò</InputLabel>
            <Select
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              label="Vai Trò"
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="STAFF">STAFF</MenuItem>
            </Select>
          </FormControl>
          
          {/* Image Upload */}
          <div style={{ marginTop: "1rem" }}>
            <Typography variant="body2" color="textSecondary">
              Tải ảnh đại diện lên:
            </Typography>
            {imagePreview && (
              <img src={imagePreview} alt="preview" style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "1rem" }} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "1rem" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="default">
            Hủy
          </Button>
          <Button onClick={handleAddEmployee} color="primary">
            Thêm Nhân Viên
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employee;
