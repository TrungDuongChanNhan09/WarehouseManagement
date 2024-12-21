import React, { useState } from "react";
import {
  Paper,
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

const columns = [
  { id: "id", label: "ID", minWidth: 30 },
  { id: "name", label: "Tên kho hàng", minWidth: 170 },
  { id: "code", label: "Trạng thái", minWidth: 100 },
  {
    id: "population",
    label: "Tổng sản phẩm",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Diện tích\u00a0(km\u00b2)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Tổng số kệ",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(id, name, code, population, size) {
  const density = population / size;
  return { id, name, code, population, size, density };
}

const rows = [
  createData(1, "India", "IN", 1324171354, 3287263),
  createData(2, "China", "CN", 1403500365, 9596961),
  createData(3, "Italy", "IT", 60483973, 301340),
  createData(4, "United States", "US", 327167434, 9833520),
  createData(5, "Canada", "CA", 37602103, 9984670),
  createData(6, "Canada", "CA", 37602103, 9984670),
  createData(7, "Canada", "CA", 37602103, 9984670),
  createData(8, "Canada", "CA", 37602103, 9984670),
  createData(9, "Canada", "CA", 37602103, 9984670),
  createData(10, "Canada", "CA", 37602103, 9984670),
];

export default function EnhancedTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [anchorEl, setAnchorEl] = useState(null); // Anchor for menu
  const [selectedRow, setSelectedRow] = useState(null); // Selected row

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleUpdate = () => {
    console.log("Cập nhật:", selectedRow);
    handleCloseMenu();
  };

  const handleDelete = () => {
    console.log("Xóa:", selectedRow);
    handleCloseMenu();
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
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Menu for actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
    </Paper>
  );
}
