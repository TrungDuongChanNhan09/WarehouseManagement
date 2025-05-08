import { Container } from "@mui/material";
import React from "react";
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
    Select,
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
    Alert,  // Add Alert for Snackbar content, 
  } from "@mui/material";
  import MoreVertIcon from "@mui/icons-material/MoreVert";
  import ApiService from "../../Service/ApiService";
  import { useState, useEffect } from "react";

const columns = [
    { id: "stt", label: "STT", minWidth: 30 },
    { id: "title", label: "Chủ đề", maxWidth: 100 },
    { id: "description", label: "Mô tả", maxWidth: 140 },
    { id: "userName", label: "Người tạo", maxWidth: 140 },
    { id: "reportStatus", label: "Trạng thái", maxWidth: 140 },
    { id: "reportPriority", label: "Mức ưu tiên", minWidth: 120 },
    { id: "createdAt", label: "Ngày tạo", maxWidth: 100 },
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




const TableReport = ({valueReport}) =>{
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [report, setReport] = useState([]);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
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
          await ApiService.updateReport(editData.id, editData);
          setSnackBarMessage('Cập nhật thành công!');
          setSnackbarSeverity("success");
          setSnackBarOpen(true);
          setReport((prev) =>
            prev.map((item) => (item.id === editData.id ? editData : item))
          );
          setIsEditModalOpen(false);
        } catch (error) {
          setSnackBarMessage('Lỗi khi cập nhật.');
          setSnackbarSeverity("error");
          setSnackBarOpen(true);
        }
      };
    const handleDelete = async () => {
        
    };
    const handleCloseSnackBar = () => {
        setSnackBarOpen(false);
      };
    return(
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
                    {valueReport
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell>{index + 1}</TableCell> 
                        {columns.slice(1).map((column) => {
                            let value = row[column.id];
                            return <TableCell key={column.id}>{value}</TableCell>;
                        })}
                        {/* {role === "ROLE_STAFF" && ( */}
                            <TableCell align="center">
                            <IconButton onClick={(event) => handleOpenMenu(event, row)}>
                                <MoreVertIcon />
                            </IconButton>
                            </TableCell>
                        {/* )} */}
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                // count={searchShelfs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {role === "ROLE_ADMIN" && (
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleUpdate}>Chi tiết</MenuItem>
                </Menu>
            )}

            {role === "ROLE_STAFF" && (
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem onClick={handleUpdate}>Chi tiết</MenuItem>
                    <MenuItem onClick={handleDelete}>Xóa</MenuItem>
                </Menu>
            )}
            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <Fade in={isEditModalOpen}>
                <Box sx={style}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "1rem" }}>
                    Chi tiết báo cáo
                    </Typography>
                    <Stack spacing={2}>
                    <TextField
                        label="Chủ đề"
                        value={editData.title || ""}
                        onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                        }
                        // disabled
                    />
                    <TextField
                        label="Mô tả"
                        value={editData.description || ""}
                        onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                        }
                        // disabled
                    />
                    <TextField
                        label="Người tạo"
                        value={editData.userName || ""}
                        onChange={(e) =>
                        setEditData({ ...editData, userName: e.target.value })
                        }
                        // disabled
                    />

                    {/* <TextField
                        label="Trạng thái"
                        value={editData.reportStatus || ""}
                        onChange={(e) =>
                        setEditData({ ...editData, reportStatus: e.target.value })
                        }
                        // disabled
                    /> */}

                <Select
                    label="Trạng thái"
                    value={editData.reportStatus}
                    onChange={(e) =>
                        setEditData({ ...editData, reportStatus: e.target.value })
                    }
                >
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="IN_PROCESS">IN_PROCESS</MenuItem>
                    <MenuItem value="PROCESSED">PROCESSED</MenuItem>
                </Select>

                    <TextField
                        label="Mức ưu tiên"
                        value={editData.reportPriority || ""}
                        onChange={(e) =>
                        setEditData({ ...editData, reportPriority: e.target.value })
                        }
                        // disabled
                    />
                    <TextField
                        label="Ngày tạo"
                        value={editData.createdAt || ""}
                        onChange={(e) =>
                        setEditData({ ...editData, createdAt: e.target.value })
                        }
                        // disabled
                    />

                {/* {role === "ROLE_STAFF" && ( */}

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                        <Button
                        variant="contained"
                        onClick={handleSaveUpdate}
                        >
                        Cập nhật
                        </Button>
                    </Stack>
                {/* )} */}
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
    )
}
export default TableReport