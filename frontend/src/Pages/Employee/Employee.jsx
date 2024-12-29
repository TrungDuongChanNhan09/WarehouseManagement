import React, { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppBarMenu from "../../Component/AppBar/AppBar";
import ApiService from "../../Service/ApiService.jsx";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State for confirm delete dialog
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // Employee selected for deletion
  const [newEmployee, setNewEmployee] = useState({
    userName: "",
    fullName: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

  // Fetch employees from API when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await ApiService.getAllEmployees(); // Fetching employee data
        setEmployees(data); // Storing fetched data in the state
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees by search term
  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Handle page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page for pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add a new employee
  const handleAddEmployee = async () => {
    // Kiểm tra nếu có trường thông tin nào trống
    if (
      !newEmployee.userName ||
      !newEmployee.fullName ||
      !newEmployee.password ||
      !newEmployee.role
    ) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return; // Dừng nếu có trường bị trống
    }

    // Tạo đối tượng dữ liệu theo kiểu yêu cầu
    const formData = {
      username: newEmployee.userName, // Đặt tên theo đúng kiểu dữ liệu yêu cầu
      fullName: newEmployee.fullName,
      password: newEmployee.password,
      role: newEmployee.role,
    };

    try {
      await ApiService.addEmployee(formData); // Gọi API thêm nhân viên
      setOpenDialog(false);
      setEmployees(await ApiService.getAllEmployees()); // Làm mới danh sách nhân viên
      setErrorMessage(""); // Reset error message after success
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMessage("Lỗi khi thêm nhân viên. Vui lòng thử lại.");
    }
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await ApiService.deleteEmployee(employeeToDelete); // Gọi API xóa nhân viên
        setEmployees(await ApiService.getAllEmployees()); // Làm mới danh sách nhân viên sau khi xóa
        setOpenConfirmDialog(false); // Đóng dialog confirm
      } catch (error) {
        console.error("Error deleting employee:", error);
        setOpenConfirmDialog(false);
      }
    }
  };

  // Handle edit action
  const handleEdit = (id) => {
    console.log("Edit employee with ID:", id);
  };

  // Handle delete action
  const handleDelete = (id) => {
    setEmployeeToDelete(id); // Lưu ID nhân viên sẽ bị xóa
    setOpenConfirmDialog(true); // Mở dialog xác nhận xóa
  };

  return (
    <Container maxWidth="xl" className="employee-page">
      <AppBarMenu />

      {/* Employee Management Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#E2F1E7",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginTop: "20px",
        }}
      >
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
            sx={{
              backgroundColor: "#243642",
              height: "50px",
              padding: "0 20px",
              fontWeight: "bold",
            }}
            onClick={() => setOpenDialog(true)}
          >
            + Thêm Nhân Viên
          </Button>
        </Stack>
      </Stack>

      {/* Employee Table */}
      <TableContainer
        component={Paper}
        className="employee-table"
        sx={{ marginTop: "20px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Nhân Viên</TableCell>
              <TableCell>Giới Tính</TableCell>
              <TableCell>Ngày Sinh</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai Trò</TableCell>          
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  <TableCell>{new Date(employee.dateOfBirth).toLocaleDateString()}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.role}</TableCell>             
                  <TableCell>
                    <IconButton onClick={() => handleEdit(employee.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(employee.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
        <DialogTitle>Thêm Tài Khoản Nhân Viên Mới</DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>} {/* Display error message */}
          <TextField
            label="Tên Nhân Viên"
            fullWidth
            margin="normal"
            value={newEmployee.fullName}
            onChange={(e) => {
              setNewEmployee({ ...newEmployee, fullName: e.target.value });
            }}
          />
          <TextField
            label="Tên Tài Khoản"
            fullWidth
            margin="normal"
            value={newEmployee.userName}
            onChange={(e) => {
              setNewEmployee({ ...newEmployee, userName: e.target.value });
            }}
          />
          <TextField
            label="Mật Khẩu"
            type="password"
            fullWidth
            margin="normal"
            value={newEmployee.password}
            onChange={(e) => {
              setNewEmployee({ ...newEmployee, password: e.target.value });
            }}
          />
          <TextField
            label="Vai Trò"
            fullWidth
            margin="normal"
            value={newEmployee.role}
            onChange={(e) => {
              setNewEmployee({ ...newEmployee, role: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="default">
            Hủy
          </Button>
          <Button onClick={handleAddEmployee} color="primary">
            Thêm Tài Khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa nhân viên này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="default">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employee;
