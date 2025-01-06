import React from "react";
import { useEffect, useState } from "react";
import './Report.css'
import PrimarySearchAppBar from "../../Component/AppBar/AppBar";

import { Container, Stack, Typography, TextField, Button, Modal, Fade, Box, Snackbar, Alert, Select, Menu, MenuItem} from "@mui/material";
import TableReport from "../../Hooks/TableReport.jsx/TableReport";
import { useScatterChartProps } from "@mui/x-charts/internals";
import ApiService from "../../Service/ApiService.jsx";

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

const Report = () => {
    const [report, setReport] = useState([]);
    const [reportOrStaff, setReportOrStaff] = useState([])
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);  // Control Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message content
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity type (success, error, etc.)
    const [newReportData, setNewReportData] = useState({
        title: "",
        userName: "", 
        description: "",
        reportPriority: "",
        createdAt: "",
      });
    
    const fetchReport = async() => {
        try {
            const response = await ApiService.getAllReport();
            setReport(response);
            console.log(report)
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu các báo cáo", error.message);   
        }
    }
    const fetchReportOrStaff = async() => {
        try {
            const response = await ApiService.getAllReportOrStaff();
            setReportOrStaff(response);
            console.log(reportOrStaff)
        } catch (error) {
        console.error("Lỗi khi tải dữ liệu các báo cáo", error.message);
        }
    }

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewReportData({
            title: "",
            userName: "", 
            description: "",
            reportPriority: "",
            createdAt: "",
        });
    };
    const handleAddNewReport = async () => {
        try {
            const response = await ApiService.addReport(newReportData);
            // Set Snackbar message and severity for success
            setSnackbarMessage("Thêm báo cáo mới thành công!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true); // Open Snackbar
            setReport((prev) => [...prev, response]);
            handleCloseAddModal();
        } catch (error) {
            // Set Snackbar message and severity for error
            setSnackbarMessage("Lỗi khi thêm báo cáo" + error);
            setSnackbarSeverity("error");
            setOpenSnackbar(true); // Open Snackbar
        }
    };
    
    useEffect(() => {
        fetchReport();
        fetchReportOrStaff()
    }, [])

    
    return(
        <Container maxWidth="xl" className="Report">
            <PrimarySearchAppBar/>
            <Stack
                className="shelf-bar"
                sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem" }}
            >
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography
                    sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", width: "200px" }}
                    variant="p"
                >
                    Quản lý báo cáo
                </Typography>
                <Stack direction="row" spacing={2} sx={{ marginBottom: "10px"}}>
                    <TextField
                    placeholder="Tìm kiếm"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    />
                    <Button
                    sx={{
                        backgroundColor: "#243642",
                        width:"200px",
                        color: "white",
                        ":hover": {
                        backgroundColor: "#1A2B36",
                        },
                    }}
                    variant="contained"
                    onClick={handleOpenAddModal}
                    >
                    Tạo báo cáo
                    </Button>
                </Stack>
                </Stack>
            </Stack>
            {role === "ROLE_ADMIN" && (
            <TableReport valueReport={report}/>
            )}
            {role === "ROLE_STAFF" && (
            <TableReport valueReport={reportOrStaff}/>
            )}

        <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
            <Fade in={isAddModalOpen}>
            <Box sx={style}>
                <Typography
                sx={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "1rem",
                }}
                >
                Tạo báo cáo mới
                </Typography>
                <Stack spacing={2}>
                <TextField
                    label="Tên báo cáo"
                    value={newReportData.title}
                    onChange={(e) =>
                    setNewReportData({ ...newReportData, title: e.target.value })
                    }
                />
            
                <TextField
                    label="Nội dung"
                    value={newReportData.description}
                    onChange={(e) =>
                        setNewReportData({ ...newReportData, description: e.target.value })
                    }
                />
                {/* <TextField
                    label="Mức ưu tiên"
                    value={newReportData.reportPriority}
                    onChange={(e) =>
                        setNewReportData({ ...newReportData, reportPriority: e.target.value })
                    }
                /> */}
                <TextField
                    label="Người tạo"
                    value={newReportData.userName}
                    onChange={(e) =>
                        setNewReportData({ ...newReportData, userName: e.target.value })
                    }
                />


                <Select
                    label="Mức ưu tiên"
                    value={newReportData.reportPriority}
                    onChange={(e) =>
                        setNewReportData({ ...newReportData, reportPriority: e.target.value })
                    }
                >
                    <MenuItem value="LOW">LOW</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="HIGH">HIGH</MenuItem>
                </Select>
                <TextField
                    label="Ngày tạo"
                    value={newReportData.createdAt}
                    onChange={(e) =>
                        setNewReportData({ ...newReportData, createdAt: e.target.value })
                    }
                />
                
                
                <Button
                    sx={{
                    backgroundColor: "#243642",
                    }}
                    variant="contained"
                    onClick={handleAddNewReport}
                >
                    Lưu
                </Button>
                </Stack>
            </Box>
            </Fade>
        </Modal>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
        </Container>
    )
}
export default Report