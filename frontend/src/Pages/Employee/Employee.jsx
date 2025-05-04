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
  Snackbar,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import AppBarMenu from "../../Component/AppBar/AppBar";
import ApiService from "../../Service/ApiService.jsx";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null); 
  const [newEmployee, setNewEmployee] = useState({
    userName: "",
    fullName: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const [errorMessage, setErrorMessage] = useState(""); 

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

  const handleAddEmployee = async () => {
    if (!newEmployee.userName || !newEmployee.fullName || !newEmployee.password) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const formData = {
      username: newEmployee.userName,
      fullName: newEmployee.fullName,
      password: newEmployee.password,
    };
  
    try {
      await ApiService.addEmployee(formData); // Gọi API thêm nhân viên
      setOpenDialog(false);
      setEmployees(await ApiService.getAllEmployees()); // Làm mới danh sách nhân viên
      setErrorMessage("");
      showSnackbar("Thêm nhân viên thành công!", "success");
    } catch (error) {
      console.error("Error adding employee:", error);
      showSnackbar("Lỗi khi thêm nhân viên. Vui lòng thử lại.", "error");
    }
  };
  
  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await ApiService.deleteEmployee(employeeToDelete); // Gọi API xóa nhân viên
        setEmployees(await ApiService.getAllEmployees());
        showSnackbar("Xóa nhân viên thành công!", "success"); // Làm mới danh sách nhân viên sau khi xóa
        setOpenConfirmDialog(false); // Đóng dialog confirm
      } catch (error) {
        showSnackbar("Lỗi khi xóa nhân viên", "error");
        console.error("Error deleting employee:", error);
        setOpenConfirmDialog(false);
      }
    }
  };
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
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
                  <TableCell>
                    {new Date(employee.dateOfBirth).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                  {employee.role === 'ROLE_STAFF'
                    ? 'Nhân viên'
                    : employee.role === 'ROLE_ADMIN'
                    ? 'Quản lý'
                    : 'Vai trò không xác định'}
                </TableCell>
                  <TableCell>
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
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Employee;
