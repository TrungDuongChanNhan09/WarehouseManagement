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
  Snackbar, Alert,Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Add, Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import ModalExport from "../../Hooks/ModalExport/ModalExport.jsx";
import ApiService from "../../Service/ApiService";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";

const ExportShipment = () => {
  const [openModal, setOpenModal] = useState(false);
  const [exportShipments, setExportShipments] = useState([]);
  const [filteredExportShipments, setFilteredExportShipments] = useState([]);
  const [expandedShipmentId, setExpandedShipmentId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // Selected date for filtering
  const [expandedShipmentOrders, setExpandedShipmentOrders] = useState({}); // Store order details for each shipment
  const [editingShipment, setEditingShipment] = useState(null); // Store the shipment being edited
  const [editingOrders, setEditingOrders] = useState([]); // Store orders related to the shipment
  const [notification, setNotification] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);


  const fetchExportShipments = async () => {
    try {
      const exportResponse = await ApiService.getAllExport();
      console.log("Response data from API:", exportResponse);
      if (Array.isArray(exportResponse)) {
        setExportShipments(exportResponse);
        setFilteredExportShipments(exportResponse); // Set initial filtered data
      } else {
        console.error("Data is not an array");
        setExportShipments([]);
        setFilteredExportShipments([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setExportShipments([]);
      setFilteredExportShipments([]);
    }
  };
  useEffect(() => {
  

    fetchExportShipments();
  }, []);

  // Filter shipments by creation date
  const handleFilter = () => {
    if (!selectedDate) {
      // If no date selected, show all
      setFilteredExportShipments(exportShipments);
      return;
    }

    const filtered = exportShipments.filter((shipment) => {
      const shipmentDate = new Date(shipment.createdAt).toLocaleDateString();
      const selectedDateFormatted = new Date(selectedDate).toLocaleDateString();
      return shipmentDate === selectedDateFormatted;
    });

    setFilteredExportShipments(filtered);
  };

  const handleOpenModal = (shipment = null) => {
    if (shipment) {
      setEditingShipment({ ...shipment });
      // Fetch orders associated with the shipment when editing
      setEditingOrders(shipment.orders || []); // Set orders related to this shipment
    } else {
      setEditingShipment(null); // Reset editing shipment for new export
      setEditingOrders([]); // Reset orders for new export
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingShipment(null); // Reset editing shipment when closing the modal
    setEditingOrders([]); // Reset orders when closing the modal
  };
  const handleModalSubmit = (isSuccess) => {
    // Kiểm tra lại isSuccess để xác định là thành công hay thất bại
    if (isSuccess) {
      setNotification({
        type: "success",
        message: "Cập nhật thành công!"
      });
    } else {
      setNotification({
        type: "error",
        message: "Cập nhật thất bại. Vui lòng thử lại."
      });
    }
  
    // Đóng modal và làm mới dữ liệu
    setOpenModal(false);
    fetchExportShipments(); // Gọi lại API để lấy dữ liệu mới nhất
  };
  
  
  
  // Function to fetch order details by order code
  const fetchOrderDetails = async (orderCode) => {
    try {
      const orderDetails = await ApiService.getOrderByOrderCode(orderCode);
      // Store the fetched order details in the expandedShipmentOrders state
      setExpandedShipmentOrders((prev) => ({
        ...prev,
        [orderCode]: orderDetails.data,
      }));
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleDeleteShipment = (shipmentId) => {
    // Set shipmentIdToDelete cho đối tượng cần xóa
    setShipmentToDelete(shipmentId);
    setOpenDialog(true); // Mở dialog xác nhận xóa
  };
  
  const handleConfirmDelete = async () => {
    if (!shipmentToDelete) return;
  
    try {
      // Gọi API xóa xuất hàng
      await ApiService.deleteExport(shipmentToDelete);
      // Cập nhật lại danh sách xuất hàng
      setExportShipments((prev) =>
        prev.filter((shipment) => shipment.id !== shipmentToDelete)
      );
      // Hiển thị thông báo thành công
      setNotification({
        type: "success",
        message: "Xuất hàng đã được xóa thành công!",
      });
      fetchExportShipments();
      setOpenDialog(false); // Đóng Dialog sau khi xóa thành công
    } catch (error) {
      console.error("Error deleting shipment:", error);
      // Hiển thị thông báo lỗi nếu có lỗi
      setNotification({
        type: "error",
        message: "Xóa xuất hàng thất bại. Vui lòng thử lại.",
      });
      setOpenDialog(false); // Đóng Dialog trong trường hợp có lỗi
    }
  };
  
  const handleCancelDelete = () => {
    setOpenDialog(false); // Đóng dialog khi người dùng hủy
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
            {/* Date filter */}
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

            {/* Button to add new export shipment */}
            <Button
              onClick={() => handleOpenModal()}
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
              <TableCell>STT</TableCell>
              <TableCell sx={{ display: "none" }}>ID</TableCell>
              <TableCell>Địa chỉ xuất hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExportShipments.length > 0 ? (
             filteredExportShipments.map((shipment, index) => (
                <React.Fragment key={shipment.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => setExpandedShipmentId(expandedShipmentId === shipment.id ? null : shipment.id)}>
                        {expandedShipmentId === shipment.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{index + 1}</TableCell> 
                    <TableCell sx={{ display: "none" }}>{shipment.id}</TableCell>
                    <TableCell>{shipment.export_address || "Chưa có địa chỉ"}</TableCell>
                    <TableCell>
                      {shipment.exportState === "PENDING" ? "Đang chờ" : 
                      shipment.exportState === "ON_GOING" ? "Đang giao" : 
                      shipment.exportState === "CONFIRMED" ? "Đã xác nhận" : 
                      shipment.exportState || "Chưa có trạng thái"}
                    </TableCell>

                    <TableCell>{new Date(shipment.createdAt).toLocaleDateString("en-GB") || "Chưa có ngày tạo"}</TableCell>
                    <TableCell>
                      {shipment.updatedAt ? 
                        new Date(shipment.updatedAt).toLocaleDateString('en-GB') : 
                        "Chưa có ngày cập nhật"}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(shipment)}>
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
                          <Typography sx={{ fontWeight: "bold", marginBottom: "1rem" }}>Đơn hàng liên quan:</Typography>

                          {/* Orders Table */}
                          <TableContainer component={Paper} sx={{ marginBottom: "1rem" }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Order Code</TableCell>
                                  <TableCell>Địa chỉ</TableCell>
                                  <TableCell>Ngày tạo</TableCell>
                                  <TableCell>Tổng giá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {shipment.orderCode?.length > 0 ? (
                                  shipment.orderCode.map((orderCode, index) => {
                                    fetchOrderDetails(orderCode);
                                    return (
                                      <TableRow key={index}>
                                        <TableCell>{orderCode}</TableCell>
                                        {expandedShipmentOrders[orderCode] ? (
                                          <>
                                            <TableCell>{expandedShipmentOrders[orderCode].delivery_Address}</TableCell>
                                            <TableCell>{new Date(expandedShipmentOrders[orderCode].created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                            {expandedShipmentOrders[orderCode].orderPrice ? 
                                              expandedShipmentOrders[orderCode].orderPrice : 
                                              "Chưa có giá đơn hàng"}
                                          </TableCell>
                                          </>
                                        ) : (
                                          <TableCell colSpan={3}>Đang tải thông tin đơn hàng...</TableCell>
                                        )}
                                      </TableRow>
                                    );
                                  })
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center">Không có đơn hàng liên quan</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

       <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn chắc chắn muốn xóa xuất hàng này?"}
        </DialogTitle>
        <DialogContent>
          {/* Nội dung có thể thêm thông tin thêm nếu cần */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>


      {/* Modal for adding or editing export shipment */}
      <ModalExport
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        setNotification={setNotification}
        shipment={editingShipment} // Pass the shipment with orders to the modal
        orders={editingOrders} // Pass the orders to the modal
      />
    </Container>
  );
};

export default ExportShipment;
