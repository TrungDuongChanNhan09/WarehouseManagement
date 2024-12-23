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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppBarMenu from "../../Component/AppBar/AppBar";
const Employee = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  const mockEmployees = [
    { id: 1, name: "John Doe", gender: "Male", dob: "12/12/1998", phone: "0987654321", address: "New York" },
    { id: 2, name: "Jane Smith", gender: "Female", dob: "01/01/2000", phone: "0987123456", address: "Los Angeles" },
    { id: 3, name: "David Brown", gender: "Male", dob: "03/05/1995", phone: "0912345678", address: "Chicago" },
    { id: 4, name: "Sarah Johnson", gender: "Female", dob: "06/10/1997", phone: "0945671234", address: "Houston" },
    { id: 5, name: "Chris Lee", gender: "Male", dob: "09/07/1999", phone: "0967894321", address: "San Francisco" },
    { id: 6, name: "Michael Scott", gender: "Male", dob: "05/12/1987", phone: "0912345678", address: "Scranton" },
    { id: 7, name: "Pam Beesly", gender: "Female", dob: "12/12/1988", phone: "0987654321", address: "Scranton" },
    { id: 8, name: "Dwight Schrute", gender: "Male", dob: "02/12/1980", phone: "0912345678", address: "Scranton" },
    { id: 9, name: "Angela Martin", gender: "Female", dob: "06/01/1985", phone: "0967894321", address: "Scranton" },
    { id: 10, name: "Ryan Howard", gender: "Male", dob: "01/01/1982", phone: "0912345678", address: "Scranton" },
  ];
  const filteredEmployees = mockEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <Container maxWidth="xl" className="employee-page">
      <Stack className="body-employee" spacing={3}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="header-employee">
          <Typography variant="h5" fontWeight="bold" color="#495E57">
            Employee Management
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              className="search-bar"
            />
            <Button variant="contained" className="add-employee-btn">
              + Add Employee
            </Button>
          </Stack>
        </Stack>

        {/* Employee Table */}
        <TableContainer component={Paper} className="employee-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.gender}</TableCell>
                    <TableCell>{employee.dob}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.address}</TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
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
      </Stack>
    </Container>
  );
};

export default Employee;
