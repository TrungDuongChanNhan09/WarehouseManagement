import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Box, Typography } from '@mui/material';
import { ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material';
import ApiService from "../../Service/ApiService";  // Assuming this is where your API service is located

const OrderTable = ({ orders, searchQuery, statusFilter }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatedOrders, setUpdatedOrders] = useState(orders);  // State to store updated orders with item details

  // Fetch order items details based on provided orderItem_code and orderItem_quantity
  useEffect(() => {
    const fetchOrderItems = async () => {
      const updatedOrdersList = [...orders];  // Copy orders to avoid direct mutation

      // Loop through each order to add order item details
      for (let order of updatedOrdersList) {
        // Check if we have orderItem_code and orderItem_quantity
        if (order.orderItem_code && order.orderItem_code.length > 0) {
          // Process each order item code and quantity
          order.orderItems = order.orderItem_code.map((orderItemCode, index) => ({
            orderItemId: `${order.id}-${index}`,
            orderItemCode,  // Use orderItem_code as item code
            quantity: order.orderItem_quantity[index],
            totalPrice: 0, // Can calculate if you have prices for items
          }));
        }
      }

      // Update the state with the updated order list
      setUpdatedOrders(updatedOrdersList);
    };

    // Run the fetch process if orders change
    fetchOrderItems();
  }, [orders]);  // Dependency array ensures this effect runs when orders change

  // Toggle row expand/collapse
  const handleExpandRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Filter orders based on search query and status
  const filteredOrders = updatedOrders.filter(
    (order) =>
      (order.delivery_Address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderStatus?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? order.orderStatus === statusFilter : true)
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Date Order</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
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
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.delivery_Address}</TableCell>
                <TableCell>{order.created_at}</TableCell>
                <TableCell>{order.orderPrice} VND</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(order.id)}>
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
                        Order Items
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID Gói hàng</TableCell>
                            <TableCell>Tên gói hàng</TableCell> {/* Using orderItemCode */}
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Tổng giá</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems?.map((item) => (
                            <TableRow key={item.orderItemId}>
                              <TableCell>{item.orderItemId}</TableCell>
                              <TableCell>{item.orderItemCode}</TableCell> {/* Display the orderItemCode */}
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

// Example of handleEdit and handleDelete functions
const handleEdit = (orderId) => {
  console.log('Edit Order:', orderId);
};

const handleDelete = (orderId) => {
  console.log('Delete Order:', orderId);
};

export default OrderTable;
