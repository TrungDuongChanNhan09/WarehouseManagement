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

const OrderUpdateModal = ({
  openModal,
  handleCloseModal,
  selectedOrder,
  setOrders,
}) => {
  const [orderDetails, setOrderDetails] = useState({
    orderCode: "",
    address: "",
    status: "PENDING",
    orderItems: [],
  });
  const [orderItems, setOrderItems] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ApiService.getProduct();
        setOrderItems(products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    const fetchShelves = async () => {
        try {
          const shelves = await ApiService.getShelfByProductName(selectedOrder?.productName || "");
          setShelves(shelves);
        } catch (error) {
          console.error("Error fetching shelves", error);
        }
      };
      

    fetchProducts();
    if (selectedOrder) {
      setOrderDetails(selectedOrder);
      fetchShelves();
    }
  }, [selectedOrder]);

  const handleOrderItemChange = (orderItemCode, field, value) => {
    const updatedItems = orderDetails.orderItems.map((item) =>
      item.orderItemCode === orderItemCode
        ? { ...item, [field]: value }
        : item
    );
    setOrderDetails({
      ...orderDetails,
      orderItems: updatedItems,
    });
  };

  const handleAddOrderItem = (product) => {
    const newItem = {
      orderItemCode: "",
      quantity: 1,
      totalPrice: product.price,
      productName: product.productName,
      price: product.price,
      shelfCode: "",
      productId: product.id,
    };
    setOrderDetails({
      ...orderDetails,
      orderItems: [...orderDetails.orderItems, newItem],
    });
  };

  const handleRemoveOrderItem = (orderItemCode) => {
    setOrderDetails({
      ...orderDetails,
      orderItems: orderDetails.orderItems.filter(
        (item) => item.orderItemCode !== orderItemCode
      ),
    });
  };

  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        ...orderDetails,
        orderItems: orderDetails.orderItems.map((item) => ({
          orderItemCode: item.orderItemCode,
          productId: item.productId,
          quantity: item.quantity,
          shelfCode: item.shelfCode,
          totalPrice: item.totalPrice,
        })),
      };

      if (selectedOrder) {
        await ApiService.updateOrder(selectedOrder.id, orderData);
      } else {
        const response = await ApiService.addOrder(orderData);
        setOrders((prevOrders) => [...prevOrders, response]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  const totalAmount = orderDetails.orderItems.reduce(
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
            {selectedOrder ? "Cập nhật Đơn Hàng" : "Tạo Đơn Hàng"}
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
                value={orderDetails.address}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, address: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={orderDetails.status}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, status: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              >
                {["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>

              {orderDetails.orderItems.length > 0 && (
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
                        {orderDetails.orderItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                value={item.orderItemCode}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.orderItemCode,
                                    "orderItemCode",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <TextField
                                select
                                value={item.shelfCode}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.orderItemCode,
                                    "shelfCode",
                                    e.target.value
                                  )
                                }
                              >
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
                                value={item.quantity}
                                onChange={(e) =>
                                  handleOrderItemChange(
                                    item.orderItemCode,
                                    "quantity",
                                    parseInt(e.target.value, 10)
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>{item.totalPrice} VND</TableCell>
                            <TableCell>
                              <Button
                                color="error"
                                onClick={() => handleRemoveOrderItem(item.orderItemCode)}
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
                          product.productName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
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
                                onClick={() => handleAddOrderItem(product)}
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
            <Typography variant="h6">Tổng giá: {totalAmount} VND</Typography>
            <Button variant="contained" color="primary" onClick={handleSubmitOrder}>
              {selectedOrder ? "Cập nhật đơn hàng" : "Lưu đơn hàng"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default OrderUpdateModal;
