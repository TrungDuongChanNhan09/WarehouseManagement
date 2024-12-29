import React, { useState } from "react";
import {
  Container,
  Stack,
  Button,
  Typography,
  InputBase,
  Modal,
  Fade,
  Box,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { ExpandMore, ExpandLess, Add, Edit, Delete } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import './Order.scss';
import PrimarySearchAppBar from "../../Component/AppBar/AppBar";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  width: "100%",
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 1, 1, 0),
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
  [theme.breakpoints.up("sm")]: {
    width: "12ch",
    "&:focus": {
      width: "20ch",
    },
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: "flex",
  alignItems: "center",
  width: "10%",
}));

const OrderWithExpandableRows = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newOrder, setNewOrder] = useState({
    customer: "",
    address: "",
    orderItems: [],
  });
  const [orderItems, setOrderItems] = useState([
    { id: "P101", name: "Product 1", price: 100000 },
    { id: "P102", name: "Product 2", price: 200000 },
    { id: "P103", name: "Product 3", price: 300000 },
  ]);
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "ABC",
      date: "01/11/2024",
      value: "200,000 VND",
      status: "Pending",
      orderItems: [
        { orderItemId: "1a", productId: "P101", quantity: 2, totalPrice: 400000 },
        { orderItemId: "1b", productId: "P102", quantity: 1, totalPrice: 200000 },
      ],
    },
    {
      id: 2,
      customer: "John",
      date: "02/11/2024",
      value: "500,000 VND",
      status: "Confirmed",
      orderItems: [
        { orderItemId: "2a", productId: "P201", quantity: 3, totalPrice: 600000 },
      ],
    },
  ]);

  const handleExpandRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      setNewOrder({
        ...order,
        orderItems: order.orderItems.map(item => ({ ...item, productId: item.productId, quantity: item.quantity })),
      });
    } else {
      setNewOrder({
        customer: "",
        address: "",
        orderItems: [],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleQuantityChange = (productId, newQuantity) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: prevOrder.orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity } : item
      ),
    }));
  };

  const handleAddOrderItem = (item) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: [...prevOrder.orderItems, { ...item, orderItemId: `${prevOrder.orderItems.length + 1}a`, totalPrice: item.price * item.quantity }],
    }));
  };

  const handleDeleteOrderItem = (itemId) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      orderItems: prevOrder.orderItems.filter((item) => item.orderItemId !== itemId),
    }));
  };

  const handleSubmitOrder = () => {
    const newOrderValue = newOrder.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setOrders([
      ...orders,
      {
        ...newOrder,
        id: orders.length + 1,
        value: `${newOrderValue} VND`,
        date: new Date().toLocaleDateString(),
        status: "Pending",
      },
    ]);
    setNewOrder({
      customer: "",
      address: "",
      orderItems: [],
    });
    handleCloseModal();
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? order.status === statusFilter : true)
  );

  return (
    <Container maxWidth="lg" className="order-page" sx={{ backgroundColor: "#ef1e7", paddingTop: 0 }}>
      <PrimarySearchAppBar />

      <Stack className="order-bar" sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem", marginTop: 0 }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", flex: "1" }} variant="p">
            Quản lý Đơn Hàng
          </Typography>

          <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{ flex: "2", justifyContent: "flex-end" }}>
            <Search sx={{ width: "300px" }}>
              <StyledInputBase
                sx={{ padding: "0.5rem", width: "100%" }}
                placeholder="Tìm kiếm"
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>

            <FormControl sx={{ width: "200px" }}>
              <InputLabel id="status-filter-label">Lọc theo</InputLabel>
              <Select
                sx={{ backgroundColor: "white", border: "none" }}
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Lọc theo"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Pending">Chờ xử lý</MenuItem>
                <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={() => handleOpenModal()}
              sx={{
                color: "white",
                height: "50px",
                backgroundColor: "#243642",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
              }}
              variant="contained"
            >
              <Add sx={{ color: "white" }} />
              Thêm Đơn Hàng
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ marginTop: 0 }}>
        <TableContainer component={Paper}>
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
                      <IconButton onClick={() => handleOpenModal(order)}>
                        <Edit />
                      </IconButton>
                      <IconButton sx={{ ml: 1 }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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
                              {order.orderItems.map((item) => (
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
      </Box>
{/* Modal for Adding/Editing Order */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",  // Increased width to take up more space
              maxWidth: "1200px", // Limit max width
              height: "80%", // Adjust height to fit more content
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Ensure the modal can scroll if needed
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Thêm hoặc Chỉnh sửa Đơn Hàng
            </Typography>
            <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
              {/* Left side: Customer Info */}
              <Box sx={{ width: "100%", md: "50%", marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Tên người nhận"
                  value={newOrder.customer}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customer: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={newOrder.address}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, address: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Sản phẩm đã chọn
                </Typography>
                {newOrder.orderItems.length > 0 && (
                  <Box sx={{ maxHeight: 400, overflowY: "auto" }}>  {/* Scrollable area for items */}
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Kệ</TableCell>
                            <TableCell>Tổng giá</TableCell>
                            <TableCell>Hành động</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {newOrder.orderItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.productId}</TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.productId,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  sx={{ width: "60px" }}
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.shelf || ""}
                                  onChange={(e) =>
                                    handleShelfChange(item.productId, e.target.value)
                                  }
                                  sx={{ width: "100px" }}
                                >
                                  {item.availableShelves.map((shelf) => (
                                    <MenuItem key={shelf} value={shelf}>
                                      {shelf}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </TableCell>
                              <TableCell>{item.totalPrice} VND</TableCell>
                              <TableCell>
                                <Button
                                  color="error"
                                  onClick={() => handleRemoveOrderItem(item.productId)}
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
                <StyledInputBase
                  placeholder="Tìm sản phẩm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}> {/* Scrollable area for product list */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Giá</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Thêm</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price} VND</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                defaultValue={1}
                                onChange={(e) => {
                                  const quantity = parseInt(e.target.value, 10);
                                  const totalPrice = product.price * quantity;
                                  setNewOrder((prevOrder) => ({
                                    ...prevOrder,
                                    orderItems: [
                                      ...prevOrder.orderItems,
                                      { ...product, quantity, totalPrice },
                                    ],
                                  }));
                                }}
                                sx={{ width: "60px" }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleAddOrderItem({
                                    ...product,
                                    quantity: 1,
                                    totalPrice: product.price,
                                    availableShelves: product.shelves || [], // danh sách các kệ
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitOrder}
              >
                Lưu đơn hàng
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

    </Container>
  );
};

export default OrderWithExpandableRows;
