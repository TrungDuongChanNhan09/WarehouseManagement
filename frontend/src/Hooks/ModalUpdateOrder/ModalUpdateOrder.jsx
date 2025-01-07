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
  MenuItem,
  Snackbar, SnackbarContent,
  Alert,
} from "@mui/material";
import ApiService from "../../Service/ApiService";

const OrderUpdateModal = ({ openModal, handleCloseModal, selectedOrder, fetchOrders,  reloadOrderItems }) => {
  const [orderDetails, setOrderDetails] = useState({
    orderCode: "",
    orderPrice: 0,
    orderState: "PENDING",
    orderItem_code: [],
    orderItem_quantity: 0,
    delivery_Address: "",
    created_at: "",
    update_at: "",
  });

  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchOrderData = async () => {
      // Kiểm tra nếu chưa chọn đơn hàng
      if (!selectedOrder) {
        console.log("No order selected, skipping fetch.");
        return;
      }
  
      try {
        console.log("1. Fetching data for order ID:", selectedOrder.id);
        setOrderDetails(selectedOrder);
  
        console.log("2. Fetching order items for orderItemCode:", selectedOrder.orderItem_code);
  
        // Lấy danh sách các order items
        const orderItemCodes = selectedOrder.orderItem_code; 
        const productDetails = [];
        for (const orderItemCode of orderItemCodes) {
          try {
            console.log(`3. Fetching details for order item code: ${orderItemCode}`);
            
            const fetchedOrderItems = await ApiService.getOrderItemByCode(orderItemCode);
            console.log(`4. Fetched details for order item ${orderItemCode}:`, fetchedOrderItems);
  
            // Lấy thông tin sản phẩm cho từng item
            const fetchedProduct = await ApiService.getProductById(fetchedOrderItems.product_id);
            console.log(`5. Fetched Product for item ${orderItemCode}:`, fetchedProduct);
  
            // Lấy thông tin kệ cho sản phẩm này
            const shelvesResponse = await ApiService.getShelfByProductName(fetchedProduct.productName);
            // Kiểm tra nếu có kệ và lấy mã kệ
            if (Array.isArray(shelvesResponse) && shelvesResponse.length > 0) {
              const shelfCodes = shelvesResponse.map(shelf => shelf || "Unknown Shelf");
  
              productDetails.push({
                ...fetchedOrderItems,
                productName: fetchedProduct.productName,
                productPrice: fetchedProduct.price,
                shelfCode: shelfCodes, 
                product_id: fetchedOrderItems.product_id,
              });
            } else {
              productDetails.push({
                ...fetchedOrderItems,
                productName: fetchedProduct.productName,
                productPrice: fetchedProduct.price,
                shelfCode: [],
              });
            }
          } catch (error) {
            console.error(`9. Error fetching product or shelf data for Order Item Code: ${orderItemCode}`, error);
          }
        }
        console.log("10. Order Items with Product and Shelf Details:", productDetails);
        setOrderItems(productDetails); 
  
      } catch (error) {
        console.error("11. Error fetching order data", error.response?.data || error.message);
      }
    };
  
    fetchOrderData();
  }, [selectedOrder]);
  
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ApiService.getProduct();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
  
    fetchProducts();
  }, []);

  const handleInputChange = (orderItemCode, field, value) => {
    setOrderItems((prevOrderItems) =>
      prevOrderItems.map((item) =>
        item.orderItemCode === orderItemCode
          ? { ...item, [field]: value }
          : item
      )
    );
  };
  
  const handleOrderItemChange = (itemCode, field, value) => {
    const updatedItems = orderItems.map((item) =>
      item.orderItemCode === itemCode ? { ...item, [field]: value } : item
    );
    setOrderItems(updatedItems);
  };

  // Handle removal of an order item
  const handleRemoveOrderItem = (itemCode) => {
    setOrderItems(orderItems.filter((item) => item.orderItemCode !== itemCode));
  };

  const handleAddOrderItem = async (productId) => {
    const product = products.find((product) => product.id === productId);
    if (product) {
      try {
        // Lấy kệ cho sản phẩm
        const shelvesResponse = await ApiService.getShelfByProductName(product.productName);
        console.log("shelvesResponse:", shelvesResponse);
  
        if (Array.isArray(shelvesResponse)) {
          const shelfCodes = shelvesResponse.map(shelf => shelf.shelfCode || shelf);
  
          setOrderItems((prevOrderItems) => [
            ...prevOrderItems,
            {
              ...product,
              quantity: 1, 
              orderItemCode: `orderItem-${Date.now()}`, 
              shelfCode: shelfCodes,
              productPrice: product.price, 
              product_id: product.id, 
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching shelf code:", error.message);
      }
    } else {
      console.error("Product not found for productId:", productId);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  async function handleSubmitOrder() {
    try {
      if (!orderItems || orderItems.length === 0) {
        console.error("No items in the order. Please add items before submitting.");
        setSnackbarSeverity('error');
        setSnackbarMessage("Đơn hàng không có sản phẩm. Vui lòng thêm sản phẩm trước khi cập nhật.");
        setSnackbarOpen(true);
        return;
      }
  
      for (const item of orderItems) {
        try {
          const existingItem = await ApiService.getOrderItemByCode(item.orderItemCode);
  
          if (!existingItem || !existingItem.orderItem_id) {
            const newItemData = {
              product_id: item.product_id,
              quantity: item.quantity || 0,
              totalPrice: item.productPrice * item.quantity,
              orderItemCode: item.orderItemCode,
              orderItemState: "IN_ORDER",
              shelfCode: item.shelfCode || [],
            };
  
            // Log thông tin item khi tạo mới
            console.log("Sending new order item data:", newItemData);
            await ApiService.addOrderItem(newItemData);
            console.log(`Created new order item: ${item.orderItemCode}`);
          } else {
            const updatedItemData = {
              orderItem_id: existingItem.orderItem_id,
              product_id: item.product_id,
              quantity: item.quantity || 0,
              totalPrice: item.productPrice * item.quantity,
              orderItemCode: item.orderItemCode,
              orderItemState: "IN_ORDER",
              shelfCode: item.shelfCode || [],
            };
  
            // Log thông tin item khi cập nhật
            console.log("Sending updated order item data:", updatedItemData);
            await ApiService.updateOrderItem(existingItem.orderItem_id, updatedItemData);
            console.log(`Updated order item: ${item.orderItemCode}`);
          }
        } catch (error) {
          console.error(`Error processing order item ${item.orderItemCode}:`, error.message);
        }
      }
  
      // Cập nhật thông tin đơn hàng
      const currentTime = new Date().toISOString();
      const orderData = {
        orderItem_code: orderItems.map((item) => item.orderItemCode).filter(Boolean),
        delivery_Address: orderDetails.delivery_Address || "N/A",
        created_at: orderDetails.created_at || currentTime,
        update_at: currentTime,
        orderCode: orderDetails.orderCode || "N/A",
      };
  
      console.log("Sending order data:", orderData);
  
      if (selectedOrder.id) {
        await ApiService.updateOrder(selectedOrder.id, orderData);
        console.log("Order details updated successfully.");
      } else {
        console.error("No selected order to update.");
        setSnackbarSeverity('error');
        setSnackbarMessage("Không có đơn hàng được chọn để cập nhật.");
        setSnackbarOpen(true);
        return;
      }
  
      // Cập nhật trạng thái đơn hàng bằng API riêng
      const orderStatePayload = { state: orderDetails.orderState };
      console.log("Sending order state update:", orderStatePayload);
      await ApiService.updateOrderState(selectedOrder.id, orderStatePayload);
      console.log("Order state updated successfully.");
  
      setSnackbarSeverity('success');
      setSnackbarMessage('Cập nhật đơn hàng thành công');
      setSnackbarOpen(true);
  
      handleCloseModal();
      reloadOrderItems(selectedOrder.id, orderData.orderItem_code);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error.message);
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message || "Có lỗi xảy ra khi cập nhật.");
      setSnackbarOpen(true);
    }
  }
  
  
  // Calculate total order price based on item quantities and prices
  const totalAmount = orderItems.reduce((total, item) => {
    return total + item.productPrice * item.quantity;
  }, 0);

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
            Cập nhật Đơn Hàng
          </Typography>
          <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
            <Box sx={{ width: "100%", md: "50%", marginBottom: 2 }}>
              <TextField
                fullWidth
                label="Mã đơn hàng"
                value={orderDetails.orderCode}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, orderCode: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Địa chỉ"
                value={orderDetails.delivery_Address}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, delivery_Address: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />
             <TextField
                fullWidth
                select
                label="Trạng thái"
                value={orderDetails.orderState}
                onChange={(e) => {
                  const selectedStatus = e.target.value;
                  setOrderDetails({
                    ...orderDetails,
                    orderState: selectedStatus,
                  });
                }}
              >
                {[
                  { label: "Đang chờ", value: "PENDING" },
                  { label: "Đang xử lý", value: "ON_GOING" },
                  { label: "Đã giao", value: "DELIVERED" },
                  { label: "Đã xác nhận", value: "CONFIRMED" },
                ].map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>

              {orderItems.length > 0 && (
               <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
               <TableContainer>
                 <Table size="small">
                   <TableHead>
                     <TableRow>
                       <TableCell>Mã Gói Hàng</TableCell>
                       <TableCell>Tên sản phẩm</TableCell>
                       <TableCell>Kệ</TableCell>
                       <TableCell>Số lượng</TableCell>
                       <TableCell>Tổng giá</TableCell>
                       <TableCell>Hành động</TableCell>
                       <TableCell sx={{ display: "none" }}>ID Sản Phẩm</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {orderItems.map((item, index) => (
                       <TableRow key={index}>
                         <TableCell>
                           <TextField
                             value={item.orderItemCode || ""}
                             onChange={(e) => handleInputChange(item.orderItemCode, "orderItemCode", e.target.value)}
                             variant="outlined"
                             fullWidth
                           />
                         </TableCell>
                         <TableCell>{item.productName}</TableCell>
                         <TableCell>
                           <TextField
                             select
                             value={item.shelfCode && item.shelfCode.length > 0 ? item.shelfCode[0] : ""}
                             onChange={(e) => handleOrderItemChange(item.orderItemCode, "shelfCode", e.target.value || null)}
                           >
                             <MenuItem value="">
                               <em>Chọn kệ</em>
                             </MenuItem>
                             {item.shelfCode && item.shelfCode.map((shelfCode, index) => (
                               <MenuItem key={index} value={shelfCode}>
                                 {shelfCode}
                               </MenuItem>
                             ))}
                           </TextField>
                         </TableCell>
                         <TableCell>
                           <TextField
                             type="number"
                             value={item.quantity}
                             onChange={(e) => handleOrderItemChange(item.orderItemCode, "quantity", parseInt(e.target.value, 10))}
                           />
                         </TableCell>
                         <TableCell>{item.productPrice * item.quantity} VND</TableCell>
                         <TableCell>
                           <Button color="error" onClick={() => handleRemoveOrderItem(item.orderItemCode)}>
                             Xóa
                           </Button>
                         </TableCell>
                         <TableCell sx={{ display: "none" }}>{item.productId}</TableCell>
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
                        <TableCell>Số lượng trong kho</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Thêm vào đơn hàng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products
                        .filter((product) => product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.inventory_quantity}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleAddOrderItem(product.id)}
                              sx={{
                                backgroundColor: "#243642",
                                '&:hover': {
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
          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="h6">Tổng tiền: {totalAmount} VND</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseModal}
                sx={{
                  backgroundColor: "#f44336", 
                  '&:hover': {
                    backgroundColor: "#d32f2f",
                  },
                }}
              >
                Đóng
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitOrder}
                sx={{
                  backgroundColor: "#243642", 
                  '&:hover': {
                    backgroundColor: "#1c2b35",
                  },
                }}
              >
                Cập nhật đơn hàng
              </Button>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: '100%' }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderUpdateModal;
