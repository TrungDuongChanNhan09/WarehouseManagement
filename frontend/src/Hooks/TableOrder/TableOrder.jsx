import React, { useState } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material';
import ApiService from "../../Service/ApiService.jsx";
import OrderUpdateModal from '../ModalUpdateOrder/ModalUpdateOrder.jsx';

const OrderTable = ({ orders, searchQuery, statusFilter }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Expand/Collapse Row
  const handleExpandRow = async (orderId, orderItemCodes) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    if (orderItemCodes && orderItemCodes.length > 0) {
      try {
        const fetchedItems = [];
        for (let code of orderItemCodes) {
          const item = await ApiService.getOrderItemByCode([code]);
          fetchedItems.push(item);
        }
        setOrderItems((prevItems) => ({ ...prevItems, [orderId]: fetchedItems }));
      } catch (error) {
        console.error("Error fetching order items for orderId:", orderId, error);
      }
    }
  };

  // Confirm Delete Handler
  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await ApiService.deleteOrder(orderToDelete);
        console.log(`Deleted order with ID: ${orderToDelete}`);
        setOrderToDelete(null);
        setOpenConfirmDialog(false);
      } catch (error) {
        console.error(`Error deleting order with ID ${orderToDelete}:`, error);
      }
    }
  };

  const handleCancelDelete = () => {
    setOrderToDelete(null);
    setOpenConfirmDialog(false);
  };

  const handleEdit = async (orderId) => {
    console.log(`Open update modal for order with ID: ${orderId}`);
    try {
      // Fetch the full order details
      const order = await ApiService.getOrderById(orderId);
      setSelectedOrder(order); // Store the selected order in state
      setOpenUpdateModal(true); // Open the update modal
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedOrder(null); // Reset the selected order when closing the modal
  };

  // Filter orders
  const filteredOrders = orders.filter(
    (order) =>
      (order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? order.status === statusFilter : true)
  );

  return (
    <>
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
                <TableRow hover>
                  <TableCell>
                    <IconButton onClick={() => handleExpandRow(order.id, order.orderItemCodes)}>
                      {expandedOrderId === order.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.orderCode}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Không xác định"}
                  </TableCell>
                  <TableCell>{order.value} VND</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(order.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(order.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
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
                            {orderItems[order.id]?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.orderItemCode}</TableCell>
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

      {/* Update Modal */}
      <OrderUpdateModal 
        openModal={openUpdateModal}
        handleCloseModal={handleCloseUpdateModal}
        selectedOrder={selectedOrder} // Pass the selected order details to the modal
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa đơn hàng này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="default">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderTable;
