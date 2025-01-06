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

  const handleModalSubmit = () => {
    setOpenModal(false);
    fetchExportShipments();
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

  // Handle deleting shipment and updating orders to OUT_EXPORT with confirmation
  const handleDeleteShipment = async (shipmentId) => {
    const confirmation = window.confirm("Bạn chắc chắn muốn xóa xuất hàng này?");
    if (!confirmation) return; // If user cancels the deletion, return early.

    try {

      await ApiService.deleteExport(shipmentId);
      setExportShipments((prev) => prev.filter((shipment) => shipment.id !== shipmentId)); // Update shipment list
      console.log("Export shipment deleted.");
    } catch (error) {
      console.error("Error deleting shipment:", error);
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
                      shipment.exportState === "DELIVERED" ? "Đã giao" : 
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

      {/* Modal for adding or editing export shipment */}
      <ModalExport
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        shipment={editingShipment} // Pass the shipment with orders to the modal
        orders={editingOrders} // Pass the orders to the modal
      />
    </Container>
  );
};

export default ExportShipment;
