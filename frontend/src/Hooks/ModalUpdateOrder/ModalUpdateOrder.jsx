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
} from "@mui/material";
import ApiService from "../../Service/ApiService";

const OrderUpdateModal = ({ openModal, handleCloseModal, selectedOrder }) => {
  const [orderDetails, setOrderDetails] = useState({
    orderCode: "",
    orderPrice: 0,
    orderStatus: "PENDING",
    orderItem_code: [], 
    orderItem_quantity: 0,
    delivery_Address: "",
    created_at: "",
    update_at: "",
  });

  const [orderItems, setOrderItems] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!selectedOrder) {
        console.log("No order selected, skipping fetch.");
        return;
      }

      try {
        console.log("Fetching data for order ID:", selectedOrder.id);

        setOrderDetails(selectedOrder);

        // Fetch order items details (like product_name, product_price)
        const fetchedOrderItems = [];
        for (const itemCode of selectedOrder.orderItem_code) {
          const orderItemDetails = await ApiService.getOrderItemByCode(itemCode);
          fetchedOrderItems.push(orderItemDetails);
        }
        setOrderItems(fetchedOrderItems);

        // Fetch product details for each order item
        const productDetails = [];
        for (const item of fetchedOrderItems) {
          const product = await ApiService.getProductById(item.product_id); // Get product details by product_id
          productDetails.push({
            ...item,
            productName: product.productName,
            productPrice: product.price,
          });
        }
        setOrderItems(productDetails);

        // Fetch shelves data for each product in order
        const shelvesData = [];
        for (const item of selectedOrder.orderItem_code) {
          const shelvesResponse = await ApiService.getShelfByProductName(item);
          if (shelvesResponse) {
            shelvesData.push(...shelvesResponse);
          }
        }
        setShelves(shelvesData);
      } catch (error) {
        console.error("Error fetching order data", error);
      }
    };

    if (selectedOrder) {
      fetchOrderData();
    }
  }, [selectedOrder]);

  // Handle changes in order item selection (quantity or shelf code)
  const handleOrderItemChange = (itemCode, field, value) => {
    const updatedItems = orderDetails.orderItem_code.map((item, index) =>
      item === itemCode ? { ...item, [field]: value } : item
    );
    setOrderDetails({
      ...orderDetails,
      orderItem_code: updatedItems,
    });
  };

  // Handle removal of an order item
  const handleRemoveOrderItem = (itemCode) => {
    setOrderDetails({
      ...orderDetails,
      orderItem_code: orderDetails.orderItem_code.filter((item) => item !== itemCode),
    });
  };

  // Submit the order update
  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        ...orderDetails,
        orderItem_code: orderDetails.orderItem_code.map((item) => ({
          orderItemCode: item,
          quantity: orderDetails.orderItem_quantity, // Assume single quantity for all items
        })),
      };

      if (selectedOrder.id) {
        // Update existing order
        await ApiService.updateOrder(selectedOrder.id, orderData);
      }

      handleCloseModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  // Calculate total order price based on item quantities and prices
  const totalAmount = orderDetails.orderItem_code.reduce((total, itemCode) => {
    const product = orderItems.find(item => item.productCode === itemCode);
    return product ? total + (product.price * orderDetails.orderItem_quantity) : total;
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
                value={orderDetails.orderStatus}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, orderStatus: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              >
                {["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>

              {orderDetails.orderItem_code.length > 0 && (
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderDetails.orderItem_code.map((itemCode, index) => {
                          const product = orderItems.find((p) => p.productCode === itemCode);
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <TextField
                                  value={itemCode}
                                  onChange={(e) =>
                                    handleOrderItemChange(itemCode, "orderItemCode", e.target.value)
                                  }
                                />
                              </TableCell>
                              <TableCell>{product?.productName}</TableCell>
                              <TableCell>
                                <TextField
                                  select
                                  value={product.shelfCode || ""}
                                  onChange={(e) =>
                                    handleOrderItemChange(itemCode, "shelfCode", e.target.value || null)
                                  }
                                >
                                  <MenuItem value="">
                                    <em>Chọn kệ</em>
                                  </MenuItem>
                                  {shelves.map((shelf) => (
                                    <MenuItem key={shelf.code} value={shelf.code}>
                                      {shelf.code}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={orderDetails.orderItem_quantity}
                                  onChange={(e) =>
                                    setOrderDetails({
                                      ...orderDetails,
                                      orderItem_quantity: parseInt(e.target.value, 10),
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {product?.productPrice * orderDetails.orderItem_quantity} VND
                              </TableCell>
                              <TableCell>
                                <Button color="error" onClick={() => handleRemoveOrderItem(itemCode)}>
                                  Xóa
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems
                        .filter((product) => product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((product) => (
                          <TableRow key={product.productCode}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.inventory_quantity}</TableCell>
                            <TableCell>{product.productPrice}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ marginTop: 4 }}>
            <Button variant="contained" onClick={handleSubmitOrder}>
              Cập nhật đơn hàng
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Hủy
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderUpdateModal;
