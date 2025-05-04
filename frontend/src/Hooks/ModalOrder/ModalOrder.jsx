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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar, Alert
} from "@mui/material";
import ApiService from "../../Service/ApiService";

const OrderModal = ({ openModal, handleCloseModal, newOrder, setNewOrder, setOrders, fetchOrders }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ApiService.getProduct();
        setOrderItems(products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  const fetchShelves = async (product) => {
    try {
      console.log("Fetching shelves for product:", product.productName);
      const response = await ApiService.getShelfByProductName(product.productName);
      
      console.log("Fetched shelves:", response); 

      if (Array.isArray(response)) {
        setShelves(response); // Set shelves based on the response
      } else {
        console.error("Error: Response is not an array of shelf codes");
      }
    } catch (error) {
      console.error("Error fetching shelves", error);
    }
  };

  const handleAddOrderItem = (product) => {
    const newItem = {
      orderItemCode: "",
      quantity: 1,
      totalPrice: product.price,
      productName: product.productName,
      price: product.price,
      product_id: product.id,
      orderItemState: "IN_ORDER",
      shelf: "", 
    };

    setNewOrder({
      ...newOrder,
      orderItems: [...newOrder.orderItems, newItem],
    });

    // Fetch shelves after adding the product
    fetchShelves(product);
  };

  const handleRemoveOrderItem = (orderItemCode) => {
    const updatedOrderItems = newOrder.orderItems.filter((item) => item.orderItemCode !== orderItemCode);
    setNewOrder({
      ...newOrder,
      orderItems: updatedOrderItems,
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
      const orderItemResponses = await Promise.all(
        newOrder.orderItems.map(async (item) => {
          const orderItemData = {
            orderItemCode: item.orderItemCode,
            product_id: item.product_id,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            orderItemState: item.orderItemState,
            shelfCode: item.shelf ? [item.shelf] : [],
          };
    
          // Log the order item data before submitting
          console.log("Submitting order item:", orderItemData);
    
          const response = await ApiService.addOrderItem(orderItemData);
    
          setNewOrder({
            ...newOrder,
            orderItems: newOrder.orderItems.map((orderItem) =>
              orderItem.orderItemCode === item.orderItemCode
                ? { ...orderItem, orderItem_id: response.orderItem_id }
                : orderItem
            ),
          });
    
          return response.orderItemCode;
        })
      );
    
      const orderData = {
        orderItem_code: orderItemResponses,
        delivery_Address: newOrder.address,
        orderCode: newOrder.orderCode,
        created_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      };
    
      // Log the complete order data before submitting
      console.log("Submitting order data:", orderData);
    
      const response = await ApiService.addOrder(orderData);
      setOrders((prevOrders) => [...prevOrders, response]);
      
      // Hiển thị Snackbar thông báo thành công
      setSnackbarMessage('Đơn hàng đã được thêm thành công!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Thêm 2 giây delay trước khi đóng modal
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
      
      fetchOrders();
    } catch (error) {
      console.error("Error submitting order", error);
      
      // Hiển thị Snackbar thông báo lỗi
      setSnackbarMessage('Có lỗi xảy ra khi thêm đơn hàng!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
            Thêm Đơn Hàng
          </Typography>
          <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
            <Box sx={{ width: "100%", md: "50%", marginBottom: 2 }}>
              <TextField
                fullWidth
                label="Order Code" // Changed label to "Order Code"
                value={newOrder.orderCode}
                onChange={(e) => setNewOrder({ ...newOrder, orderCode: e.target.value })} // Corrected to update `orderCode`
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
                          <TableCell>Mã Gói Hàng (Order Item Code)</TableCell>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Tổng giá</TableCell>
                          <TableCell>Chọn kệ</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newOrder.orderItems.map((item, index) => (
                          <TableRow key={index}>
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
                              <FormControl fullWidth>
                                <InputLabel>Chọn kệ</InputLabel>
                                <Select
                                  value={item.shelf}
                                  onChange={(e) => {
                                    handleOrderItemChange(item.orderItemCode, "shelf", e.target.value);
                                  }}
                                  label="Chọn kệ"
                                >
                                  {shelves.map((shelf, index) => (
                                    <MenuItem key={index} value={shelf}>
                                      {shelf}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
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
                        .filter((product) => product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.price} VND</TableCell>
                            <TableCell>{product.inventory_quantity}</TableCell>
                            <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleAddOrderItem(product)}
                              sx={{
                                backgroundColor: "#243642",
                                "&:hover": {
                                  backgroundColor: "#1c2b35",
                                },
                              }}
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

          <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", mt: 3 }}>
            <Typography variant="h6">Tổng cộng: {totalAmount} VND</Typography>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{
                backgroundColor: "#c62828", 
                '&:hover': {
                  backgroundColor: "#b71c1c", 
                },
              }}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitOrder}
              sx={{
                backgroundColor: "#243642", 
                '&:hover': {
                  backgroundColor: "#1c2b35", 
                },
              }}
            >
              Thêm
            </Button>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000} // Tự động đóng snackbar sau 3 giây
              onClose={() => setSnackbarOpen(false)}
            >
              <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>

          </Stack>
        </Box>
      </Fade>
      
    </Modal>
  );
};

export default OrderModal;
