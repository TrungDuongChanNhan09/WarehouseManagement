import React, { useState, useEffect } from "react";
import {
  Modal,
  Fade,
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar, Alert
} from "@mui/material";
import ApiService from "../../Service/ApiService.jsx";

const ModalExport = ({ open, onClose, onSubmit, shipment,setNotification }) => {
  const [orders, setOrders] = useState([]); 
  const [selectedOrderIds, setSelectedOrderIds] = useState([]); 
  const [exportAddress, setExportAddress] = useState("");
  const [exportState, setExportState] = useState("PENDING");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  useEffect(() => {
    // Fetch all orders for selection
    const fetchOrders = async () => {
      try {
        const data = await ApiService.getAllOrders(); // Fetch all orders from API
        console.log("Fetched Orders:", data); // Log fetched orders for debugging

        // Kiểm tra xem dữ liệu có hợp lệ không
        if (data && Array.isArray(data)) {
          // Filter orders that are marked as "OUT_EXPORT"
          const filteredOrders = data.filter(order => order.orderStatus === "OUT_EXPORT");
          setOrders(filteredOrders);
        } else {
          console.error("Dữ liệu không hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();

    if (shipment) {
      setExportAddress(shipment.export_address || "");
      setExportState(shipment.exportState || "PENDING");

      // Set the selected order IDs
      setSelectedOrderIds(shipment.orderCode || []);
    } else {
      // Reset the selected orders when no shipment is passed
      setSelectedOrders([]);
      setExportAddress("");
      setExportState("PENDING");
    }
  }, [shipment]); // Re-run whenever the shipment prop changes

  useEffect(() => {
    // Log selected orders when they change
    console.log("Selected Orders:", selectedOrders); // Log full details of selected orders

    // Fetch the full details for selected orders whenever the selectedOrderIds change
    const fetchSelectedOrderDetails = async () => {
      if (selectedOrderIds.length === 0) {
        setSelectedOrders([]);
        return;
      }

      try {
        const orderDetails = await Promise.all(
          selectedOrderIds.map(async (orderCode) => {
            const response = await ApiService.getOrderByOrderCode(orderCode); // Fetch order by orderCode
            console.log("Fetched Order Details Response:", response); // Log the full response for debugging

            if (response && response.data) {
              return response.data; // Return only the 'data' part of the response
            } else {
              console.error("Dữ liệu không hợp lệ cho orderCode:", orderCode);
              return null; // Return null if data is invalid
            }
          })
        );

        // Lọc ra các order hợp lệ
        setSelectedOrders(orderDetails.filter(order => order !== null));

      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchSelectedOrderDetails();
  }, [selectedOrderIds]); // Re-run whenever selectedOrderIds changes

  const handleAddOrder = async (orderCode) => {
    if (!selectedOrderIds.includes(orderCode)) {
      setSelectedOrderIds((prevSelected) => [...prevSelected, orderCode]);
  
      // Tìm đơn hàng trong danh sách `orders` và thêm vào `selectedOrders`
      const orderToAdd = orders.find((order) => order.orderCode === orderCode);
      if (orderToAdd) {
        setSelectedOrders((prevSelected) => [...prevSelected, orderToAdd]);
      }
  
      // Xóa đơn hàng khỏi danh sách `orders`
      setOrders((prevOrders) => prevOrders.filter((order) => order.orderCode !== orderCode));
    }
  };

  const handleRemoveOrder = async (orderCode) => {
    try {
      const removedOrder = selectedOrders.find((order) => order.orderCode === orderCode);
      setSelectedOrders((prevSelected) => prevSelected.filter((order) => order.orderCode !== orderCode));
      if (removedOrder) {
        setOrders((prevOrders) => [...prevOrders, removedOrder]);
      }
      setSelectedOrderIds((prevSelected) => prevSelected.filter((code) => code !== orderCode));
      const response = await ApiService.getOrderByOrderCode(orderCode);
      const orderId = response.data.id;
      const formData = { orderStatus: "OUT_EXPORT" };
      await ApiService.updateOrderStatus(orderId, formData);
  
      console.log(`Order ${orderId} status updated to OUT_EXPORT`);
    } catch (error) {
      console.error(`Error updating order status for ${orderCode}:`, error);
    }
  };
  
  const handleSubmit = async () => {
    if (selectedOrderIds.length === 0) {
      console.error("No orders selected, cannot submit export.");
      const notificationData = {
        type: "warning",
        message: "Vui lòng chọn ít nhất một đơn hàng.",
      };
      setNotification(notificationData);
      setSnackbarMessage(notificationData.message);
      setSnackbarSeverity("warning");
      setOpenSnackbar(true); 
      return;
    }

    const getDateOnly = (date) => date.toISOString().split("T")[0];

    const newExport = {
      orderCode: selectedOrderIds,
      exportState: exportState,
      export_address: exportAddress,
      created_at: shipment ? getDateOnly(new Date(shipment.createdAt)) : getDateOnly(new Date()),
      updated_at: getDateOnly(new Date()),
    };

    try {
      setLoading(true);

      if (shipment) {
        if (exportState === "PENDING" || exportState === "CONFIRMED") {
          console.log("Updating export with data:", newExport);
          await ApiService.updateExport(shipment.id, newExport);
          setSnackbarMessage("Cập nhật xuất hàng thành công!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else if (exportState === "ON_GOING") {
          await ApiService.updateExportState(shipment.id, { exportState });
          setSnackbarMessage("Cập nhật trạng thái xuất hàng thành công!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true); 
        }
      } else {
        await ApiService.addExport(newExport);
        setSnackbarMessage("Tạo xuất hàng mới thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true); 
      }

      setTimeout(() => {
        setLoading(false);
        onSubmit();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi tạo hoặc cập nhật xuất hàng:", error);
      setSnackbarMessage("Có lỗi xảy ra khi cập nhật xuất hàng.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); 
    }
};


  const handleUpdateExportState = async (newState) => {
    if (!shipment || !shipment.id) {
      console.error("Không thể cập nhật trạng thái: thiếu thông tin xuất hàng.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const updatedExport = {
        exportState: newState, 
      };
      await ApiService.updateExportState(shipment.id, updatedExport);
      setExportState(newState); // Cập nhật trạng thái trong UI
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái xuất hàng:", error);
      setOpenSnackbar(true);
    }
  };
  
  
  const handleClose = () => {
    // Reset all states when closing
    setSelectedOrderIds([]);
    setSelectedOrders([]);
    setExportAddress("");
    setExportState("PENDING");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, bgcolor: "background.paper", boxShadow: 24, p: 4,overflow: "auto",   maxHeight: "90vh", }}>
          <Typography sx={{ fontWeight: "bold", mb: 2 }}>{shipment ? "Chỉnh Sửa Xuất Hàng" : "Tạo Xuất Hàng"}</Typography>

          {/* Địa chỉ xuất hàng */}
          <TextField
            fullWidth
            label="Địa chỉ xuất hàng"
            value={exportAddress}
            onChange={(e) => setExportAddress(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />

          {/* Selected orders */}
          <Typography sx={{ fontWeight: "bold", mb: 2 }}>Đơn Hàng Đã Chọn</Typography>
          <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Đơn Hàng</TableCell>
                  <TableCell>Địa Chỉ Giao Hàng</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.delivery_Address}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => handleRemoveOrder(order.orderCode)}>
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Export State */}
          {shipment && (
            <FormControl fullWidth sx={{ marginTop: "1rem" }}>
              <InputLabel>Trạng Thái Xuất Hàng</InputLabel>
              <Select
                value={exportState}
                onChange={(e) => {
                  setExportState(e.target.value); // Cập nhật giá trị exportState
                }}
              >
                <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                <MenuItem value="ON_GOING">Đang giao</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* All available orders */}
          <Typography sx={{ fontWeight: "bold", mb: 2, marginTop: "2rem" }}>Chọn Đơn Hàng</Typography>
          <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Đơn Hàng</TableCell>
                  <TableCell>Địa Chỉ Giao Hàng</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.delivery_Address}</TableCell>
                    <TableCell>
                      {selectedOrderIds.includes(order.orderCode) ? (
                        <Button variant="outlined" color="error" onClick={() => handleRemoveOrder(order.orderCode)}>
                          Xóa
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          sx={{ backgroundColor: "#243642", color: "white", "&:hover": { backgroundColor: "#1a2a33" } }} 
                          onClick={() => handleAddOrder(order.orderCode)}
                        >
                          Thêm
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1500}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>


          {/* Submit Button */}
          <Box sx={{ marginTop: "2rem", textAlign: "right" }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Đóng
            </Button>
            <Button 
              variant="contained" 
              sx={{ backgroundColor: "#243642", color: "white", "&:hover": { backgroundColor: "#1a2a33" }, marginLeft: "1rem" }} 
              onClick={handleSubmit}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalExport;
