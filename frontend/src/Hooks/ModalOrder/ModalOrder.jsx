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
    const existingItem = newOrder.orderItems.find(
      (item) => item.id === product.id
    );
    if (existingItem) {
      // Update quantity if the item is already in the order
      setNewOrder({
        ...newOrder,
        orderItems: newOrder.orderItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: item.totalPrice + product.price }
            : item
        ),
      });
    } else {
      // Add new item to the order
      setNewOrder({
        ...newOrder,
        orderItems: [
          ...newOrder.orderItems,
          { ...product, quantity: 1, totalPrice: product.price },
        ],
      });
    }
  };

  const handleRemoveOrderItem = (productId) => {
    setNewOrder({
      ...newOrder,
      orderItems: newOrder.orderItems.filter((item) => item.id !== productId),
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedItems = newOrder.orderItems.map((item) =>
      item.id === productId
        ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        : item
    );
    setNewOrder({
      ...newOrder,
      orderItems: updatedItems,
    });
  };

  const handleSubmitOrder = async () => {
    try {
      const response = await ApiService.addOrder(newOrder); // Assuming addOrder method exists
      setOrders((prevOrders) => [...prevOrders, response]);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

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
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Tổng giá</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newOrder.orderItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, parseInt(e.target.value, 10))
                                }
                                sx={{ width: "60px" }}
                              />
                            </TableCell>
                            <TableCell>{item.totalPrice} VND</TableCell>
                            <TableCell>
                              <Button
                                color="error"
                                onClick={() => handleRemoveOrderItem(item.id)}
                              >
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
                            <TableCell>{product.inventory_quantity}</TableCell> {/* Display inventory quantity */}
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleAddOrderItem({
                                    ...product,
                                    quantity: 1, // Default quantity is 1
                                    totalPrice: product.price,
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
          <Box sx={{ marginTop: 4, textAlign: "right" }}>
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
