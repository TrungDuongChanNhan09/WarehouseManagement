import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Fade,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ApiService from "../../Service/ApiService";

const OrderModal = ({ openModal, handleCloseModal, newOrder, setNewOrder, setOrders }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ApiService.getProduct();
        setOrderItems(products); // Assuming the API returns a list of products
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddOrderItem = (product) => {
    // Create a new order item for the selected product
    const newItem = {
      orderItem_id: "",  // Initially empty for user to fill
      orderItemCode: "",  // Empty for the user to fill manually
      quantity: 1,
      totalPrice: product.price,
      productName: product.productName,
      price: product.price,
      product_id: product.id,
      orderItemState: "IN_ORDER",
    };

    // Add the new order item to the order
    setNewOrder({
      ...newOrder,
      orderItems: [...newOrder.orderItems, newItem], // Add new item to the order
    });
  };

  const handleRemoveOrderItem = (orderItemCode) => {
    setNewOrder({
      ...newOrder,
      orderItems: newOrder.orderItems.filter((item) => item.orderItemCode !== orderItemCode),
    });
  };

  const handleQuantityChange = (orderItemCode, newQuantity) => {
    const updatedItems = newOrder.orderItems.map((item) =>
      item.orderItemCode === orderItemCode
        ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price }
        : item
    );
    setNewOrder({
      ...newOrder,
      orderItems: updatedItems,
    });
  };

  const handleOrderItemChange = (orderItemCode, field, value) => {
    const updatedItems = newOrder.orderItems.map((item) =>
      item.orderItemCode === orderItemCode
        ? { ...item, [field]: value }
        : item
    );
    setNewOrder({
      ...newOrder,
      orderItems: updatedItems,
    });
  };

  const handleSubmitOrder = async () => {
    try {
      // Log order items before sending the request to the API
      console.log("Order Items: ", newOrder.orderItems);

      // Step 1: Create order items first (submit orderItems)
      const orderItemResponses = await Promise.all(
        newOrder.orderItems.map(async (item) => {
          // Log each individual order item
          console.log("Processing Order Item: ", item);

          const orderItemData = {
            orderItem_id: item.orderItem_id || null,
            orderItemCode: item.orderItemCode,
            product_id: item.product_id,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            orderItemState: item.orderItemState,
          };

          if (!orderItemData.orderItemCode) {
            console.error("Order item code is missing");
            throw new Error("Order item code is missing");
          }

          // Call the API to add the order item
          const response = await ApiService.addOrderItem(orderItemData);
          // Update the orderItem_id after the API call returns
          setNewOrder({
            ...newOrder,
            orderItems: newOrder.orderItems.map((orderItem) =>
              orderItem.orderItemCode === item.orderItemCode
                ? { ...orderItem, orderItem_id: response.orderItem_id }
                : orderItem
            ),
          });
        })
      );

      // Step 2: Now create the order with orderItem codes and other details
      const orderData = {
        orderItemCodes: newOrder.orderItems.map((item) => item.orderItemCode),
        deliveryAddress: newOrder.address,
        orderCode: newOrder.orderCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Log the final order data before submission
      console.log("Final Order Data: ", orderData);

      // Call API to create the order
      const response = await ApiService.addOrder(orderData);
      setOrders((prevOrders) => [...prevOrders, response]);

      // Close modal after submitting
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  const totalAmount = newOrder.orderItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  return (
    <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
      <Fade in={openModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "1200px",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Thêm hoặc Chỉnh sửa Đơn Hàng
          </Typography>
          <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
            {/* Left side: Customer Info */}
            <Box sx={{ width: "100%", md: "50%", marginBottom: 2 }}>
              <TextField
                fullWidth
                label="Tên người nhận"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Địa chỉ"
                value={newOrder.address}
                onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Sản phẩm đã chọn
              </Typography>
              {newOrder.orderItems.length > 0 && (
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order Item ID</TableCell>
                          <TableCell>Mã Gói Hàng (Order Item Code)</TableCell>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Tổng giá</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newOrder.orderItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                value={item.orderItem_id}
                                onChange={(e) =>
                                  handleOrderItemChange(item.orderItemCode, "orderItem_id", e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={item.orderItemCode}
                                onChange={(e) =>
                                  handleOrderItemChange(item.orderItemCode, "orderItemCode", e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.orderItemCode, parseInt(e.target.value, 10))}
                                sx={{ width: "60px" }}
                              />
                            </TableCell>
                            <TableCell>{item.totalPrice} VND</TableCell>
                            <TableCell>
                              <Button color="error" onClick={() => handleRemoveOrderItem(item.orderItemCode)}>
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>

            {/* Right side: Product selection */}
            <Box sx={{ width: "100%", md: "50%" }}>
              <Typography variant="h6">Danh sách sản phẩm</Typography>
              <TextField
                placeholder="Tìm sản phẩm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Số lượng trong kho</TableCell>
                        <TableCell>Thêm</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems
                        .filter((product) =>
                          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.price} VND</TableCell>
                            <TableCell>{product.inventory_quantity}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleAddOrderItem({
                                    ...product,
                                  })
                                }
                              >
                                Thêm
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Stack>

          {/* Display total price */}
          <Box sx={{ marginTop: 4, textAlign: "right" }}>
            <Typography variant="h6">Tổng giá: {totalAmount} VND</Typography>
            <Button variant="contained" color="primary" onClick={handleSubmitOrder}>
              Lưu đơn hàng
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderModal;
