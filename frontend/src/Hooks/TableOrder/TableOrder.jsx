import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse, Box, Typography } from '@mui/material';
import { ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material';

const OrderTable = ({ orders, searchQuery, statusFilter }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Toggle row expand/collapse
  const handleExpandRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(
    (order) =>
      (order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? order.status === statusFilter : true)
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
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
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.value}</TableCell>
                <TableCell>{order.status}</TableCell>
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
                            <TableCell>Order Item ID</TableCell>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderItems?.map((item) => (
                            <TableRow key={item.orderItemId}>
                              <TableCell>{item.orderItemId}</TableCell>
                              <TableCell>{item.productId}</TableCell>
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
  // Add logic to open an edit modal or navigate to an edit page
};

const handleDelete = (orderId) => {
  console.log('Delete Order:', orderId);
  // Add logic to handle deleting the order (e.g., make API call)
};

export default OrderTable;
