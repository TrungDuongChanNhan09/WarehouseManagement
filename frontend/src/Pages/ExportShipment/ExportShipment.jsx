import React, { useState, useEffect } from "react";
import {
  Container,
  Stack,
  Button,
  Typography,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TextField,
} from "@mui/material";
import { Add, Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import ModalExport from "../../Hooks/ModalExport/ModalExport.jsx"; // Modal component
import ApiService from "../../Service/ApiService"; // API service
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";

const ExportShipment = () => {
  const [openModal, setOpenModal] = useState(false);
  const [exportShipments, setExportShipments] = useState([]);
  const [filteredExportShipments, setFilteredExportShipments] = useState([]);
  const [expandedShipmentId, setExpandedShipmentId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // Ngày đã chọn để lọc
  const [expandedShipmentOrders, setExpandedShipmentOrders] = useState({});
  const [editingShipment, setEditingShipment] = useState(null); // Lưu thông tin xuất hàng đang chỉnh sửa

  useEffect(() => {
    const fetchExportShipments = async () => {
      try {
        const exportResponse = await ApiService.getAllExport();
        console.log("Dữ liệu phản hồi từ API:", exportResponse);
        if (Array.isArray(exportResponse)) {
          setExportShipments(exportResponse);
          setFilteredExportShipments(exportResponse); // Set initial filtered data
        } else {
          console.error("Dữ liệu không phải là mảng");
          setExportShipments([]);
          setFilteredExportShipments([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setExportShipments([]);
        setFilteredExportShipments([]);
      }
    };

    fetchExportShipments();
  }, []);

  // Hàm lọc xuất hàng theo ngày tạo
  const handleFilter = () => {
    if (!selectedDate) {
      // Nếu không có ngày chọn, hiển thị tất cả
      setFilteredExportShipments(exportShipments);
      return;
    }

    const filtered = exportShipments.filter((shipment) => {
      // Chỉ lọc theo ngày tạo
      const shipmentDate = new Date(shipment.createdAt).toLocaleDateString();
      const selectedDateFormatted = new Date(selectedDate).toLocaleDateString();
      return shipmentDate === selectedDateFormatted;
    });

    setFilteredExportShipments(filtered);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleModalSubmit = () => {
    if (editingShipment) {
      console.log("Cập nhật xuất hàng:", editingShipment);
      // Gọi API cập nhật xuất hàng
      ApiService.updateExport(editingShipment.id, editingShipment)
        .then(() => {
          console.log("Cập nhật xuất hàng thành công.");
          setOpenModal(false); // Đóng modal sau khi cập nhật
          setEditingShipment(null); // Reset thông tin sửa
          fetchExportShipments(); // Tải lại danh sách xuất hàng
        })
        .catch((error) => console.error("Lỗi khi cập nhật xuất hàng:", error));
    } else {
      console.log("Xuất hàng đã được tạo thành công");
      setOpenModal(false); // Đóng modal sau khi submit
    }
  };

  // Hàm xử lý mở modal để sửa thông tin
  const handleEditShipment = (shipment) => {
    setEditingShipment({ ...shipment }); // Set thông tin xuất hàng đang sửa vào state
    setOpenModal(true); // Mở modal
  };

  // Hàm xử lý xóa xuất hàng
  const handleDeleteShipment = async (shipmentId) => {
    try {
      await ApiService.deleteExport(shipmentId); // Gọi API xóa xuất hàng
      setExportShipments((prev) => prev.filter((shipment) => shipment.id !== shipmentId)); // Cập nhật lại danh sách xuất hàng
      console.log("Xuất hàng đã được xóa.");
    } catch (error) {
      console.error("Lỗi khi xóa xuất hàng:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <PrimarySearchAppBar />
      <Stack
        className="order-bar"
        sx={{
          backgroundColor: "#E2F1E7",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginTop: 0,
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", flex: "1" }} variant="p">
            Quản lý Xuất Hàng
          </Typography>

          <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{ flex: "2", justifyContent: "flex-end" }}>
            {/* Bộ lọc theo ngày */}
            <TextField
              label="Chọn ngày"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              size="small"
            />

            <Button
              onClick={handleFilter}
              sx={{
                backgroundColor: "#243642",
                color: "white",
                textTransform: "none",
              }}
              variant="contained"
            >
              Lọc
            </Button>

            {/* Nút Thêm Xuất Hàng */}
            <Button
              onClick={handleOpenModal}
              sx={{
                color: "white",
                height: "50px",
                backgroundColor: "#243642",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
              }}
              variant="contained"
            >
              <Add sx={{ color: "white" }} />
              Thêm Xuất Hàng
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Địa chỉ xuất hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExportShipments.length > 0 ? (
              filteredExportShipments.map((shipment) => (
                <React.Fragment key={shipment.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => setExpandedShipmentId(expandedShipmentId === shipment.id ? null : shipment.id)}>
                        {expandedShipmentId === shipment.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{shipment.id}</TableCell>
                    <TableCell>{shipment.export_address || "Chưa có địa chỉ"}</TableCell>
                    <TableCell>{shipment.exportState || "Chưa có trạng thái"}</TableCell>
                    <TableCell>{shipment.createdAt || "Chưa có ngày tạo"}</TableCell>
                    <TableCell>{shipment.updatedAt || "Chưa có ngày cập nhật"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditShipment(shipment)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteShipment(shipment.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row for Orders */}
                  {expandedShipmentId === shipment.id && (
                    <TableRow key={`details-${shipment.id}`}>
                      <TableCell colSpan={7}>
                        <Box sx={{ padding: "1rem" }}>
                          <Typography sx={{ fontWeight: "bold" }}>Đơn hàng liên quan:</Typography>
                          <ul>
                            {shipment.orderCode?.length > 0 ? (
                              shipment.orderCode.map((orderCode, index) => (
                                <li key={index}>
                                  <strong>Order Code:</strong> {orderCode}
                                </li>
                              ))
                            ) : (
                              <Typography>Không có đơn hàng liên quan</Typography>
                            )}
                          </ul>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">Không có dữ liệu xuất hàng.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for adding/export shipment */}
      <ModalExport open={openModal} onClose={handleCloseModal} onSubmit={handleModalSubmit} shipment={editingShipment} />
    </Container>
  );
};

export default ExportShipment;
