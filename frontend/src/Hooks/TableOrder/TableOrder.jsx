import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";

const OrderTable = ({ orders, searchQuery, statusFilter, handleOpenUpdateModal }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Toggle row expand/collapse
  const handleExpandRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(
    (order) =>
      (order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? order.status === statusFilter : true)
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Ngày đặt hàng</TableCell>
            <TableCell>Giá trị</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              {/* Main Table Row */}
              <TableRow hover>
                <TableCell>
                  <IconButton onClick={() => handleExpandRow(order.id)}>
                    {expandedOrderId === order.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </TableCell>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.value} VND</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenUpdateModal(order)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Collapsible Order Items */}
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                  <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="h6" gutterBottom>
                        Chi tiết gói hàng
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Mã gói hàng</TableCell>
                            <TableCell>Mã kệ</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Tổng giá</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems?.map((item) => (
                            <TableRow key={item.orderItemId}>
                              <TableCell>{item.orderItemId}</TableCell>
                              <TableCell>{item.shelfCode}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.totalPrice} VND</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const handleDelete = (orderId) => {
  console.log("Xóa đơn hàng:", orderId);
};

export default OrderTable;
