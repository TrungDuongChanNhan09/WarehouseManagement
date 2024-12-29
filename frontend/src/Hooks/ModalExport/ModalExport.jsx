import React, { useState, useEffect } from "react";
import { Modal, Fade, Box, TextField, Button, Typography, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import ApiService from "../../Service/ApiService";

const ModalExport = ({ open, onClose, onSubmit, shipment }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [exportAddress, setExportAddress] = useState("");
  const [exportState, setExportState] = useState("PENDING");

  useEffect(() => {
    // Lấy danh sách đơn hàng từ API
    const fetchOrders = async () => {
      try {
        const data = await ApiService.getAllOrders(); // Gọi API lấy danh sách đơn hàng
        // Lọc các đơn hàng có trạng thái OUT_EXPORT
        const filteredOrders = data.filter(order => order.orderStatus === "OUT_EXPORT");
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };
    fetchOrders();

    // Nếu đang chỉnh sửa, load dữ liệu của xuất hàng vào modal
    if (shipment) {
      setExportAddress(shipment.export_address || "");
      setExportState(shipment.exportState || "PENDING");

      // Đặt các đơn hàng đã chọn (dựa vào orderCode từ shipment)
      setSelectedOrders(shipment.orderCode || []);
    }
  }, [shipment]);

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleSubmit = async () => {
    // Lấy mã đơn hàng đã chọn
    const orderCodes = selectedOrders.map((orderId) => {
      const order = orders.find((order) => order.id === orderId);
      return order ? order.orderCode : null;
    }).filter(code => code !== null);

    const newExport = {
      orderCode: orderCodes, 
      exportState: exportState, 
      export_address: exportAddress, 
      created_at: shipment ? shipment.createdAt : new Date().toISOString(), // Nếu sửa thì giữ ngày tạo cũ
    };

    try {
      if (shipment) {
        // Cập nhật xuất hàng nếu đang sửa
        await ApiService.updateExport(shipment.id, newExport); 
        console.log("Cập nhật xuất hàng thành công.");
      } else {
        // Thêm mới xuất hàng nếu không có xuất hàng nào
        await ApiService.addExport(newExport);
        console.log("Tạo xuất hàng mới thành công.");
      }
      onSubmit(); // Callback sau khi thành công
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi tạo hoặc cập nhật xuất hàng:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
          <Typography sx={{ fontWeight: "bold", mb: 2 }}>{shipment ? "Chỉnh Sửa Xuất Hàng" : "Tạo Xuất Hàng"}</Typography>
          
          {/* Địa chỉ xuất hàng */}
          <TextField
            fullWidth
            label="Địa chỉ xuất hàng"
            value={exportAddress}
            onChange={(e) => setExportAddress(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />

          <Typography sx={{ fontWeight: "bold", mb: 2 }}>Chọn Đơn Hàng</Typography>

          {/* Bảng hiển thị đơn hàng */}
          <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.length === orders.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(orders.map((order) => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Số lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)} // Kiểm tra đơn hàng có được chọn không
                        onChange={() => handleSelectOrder(order.id)} // Xử lý thay đổi lựa chọn
                      />
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Box sx={{ marginTop: "2rem", textAlign: "right" }}>
            <Button variant="contained" sx={{ backgroundColor: "#243642", color: "white" }} onClick={handleSubmit}>
              {shipment ? "Cập Nhật Xuất Hàng" : "Tạo Xuất Hàng"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalExport;
