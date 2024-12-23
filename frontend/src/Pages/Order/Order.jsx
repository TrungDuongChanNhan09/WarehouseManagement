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
  width: "100%",
}));

const OrderWithExpandableRows = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newOrder, setNewOrder] = useState({
    customer: "",
    address: "",
    items: [],
  });
  const [orderItems, setOrderItems] = useState([
    { id: "P101", name: "Product 1", quantity: 1, price: 100000 },
    { id: "P102", name: "Product 2", quantity: 1, price: 200000 },
    { id: "P103", name: "Product 3", quantity: 1, price: 300000 },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "ABC",
      date: "01/11/2024",
      value: "200,000 VND",
      status: "Pending",
      items: [
        { orderItem_Id: "1a", product_Id: "P101", quantity: 2, totalPrice: 400000 },
        { orderItem_Id: "1b", product_Id: "P102", quantity: 1, totalPrice: 200000 },
      ],
    },
    {
      id: 2,
      customer: "John",
      date: "02/11/2024",
      value: "500,000 VND",
      status: "Confirmed",
      items: [
        { orderItem_Id: "2a", product_Id: "P201", quantity: 3, totalPrice: 600000 },
      ],
    },
  ]);

  const handleExpandRow = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      // Edit mode
      setNewOrder({
        ...order,
        items: order.items.map(item => ({ ...item, product_Id: item.product_Id, quantity: item.quantity })),
      });
    } else {
      // Add new order
      setNewOrder({
        customer: "",
        address: "",
        items: [],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleQuantityChange = (productId, newQuantity) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map((item) =>
        item.product_Id === productId ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity } : item
      ),
    }));
  };

  const handleAddOrderItem = (item) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: [...prevOrder.items, { ...item, orderItem_Id: `${prevOrder.items.length + 1}a`, totalPrice: item.price * item.quantity }],
    }));
  };

  const handleDeleteOrderItem = (itemId) => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.filter((item) => item.orderItem_Id !== itemId),
    }));
  };

  const handleSubmitOrder = () => {
    const newOrderValue = newOrder.items.reduce((sum, item) => sum + item.totalPrice, 0);
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
      items: [],
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
          <Typography sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", width: "200px" }} variant="p">
            Quản lý Đơn Hàng
          </Typography>

          <Stack direction={"row"} alignItems={"center"}>
            <Search>
              <StyledInputBase
                sx={{ padding: "0.5rem" }}
                placeholder="Tìm kiếm"
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>

            <FormControl sx={{ width: "200px", marginLeft: "0.5rem", marginRight: "0.5rem" }}>
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

            <Button onClick={() => handleOpenModal()} sx={{ color: "white", height: "50px", backgroundColor: "#243642" }} variant="contained">
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
                              {order.items.map((item) => (
                                <TableRow key={item.orderItem_Id}>
                                  <TableCell>{item.orderItem_Id}</TableCell>
                                  <TableCell>{item.product_Id}</TableCell>
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
          <Box sx={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>Thêm hoặc Chỉnh sửa Đơn Hàng</Typography>
            <Stack direction="row" spacing={4}>
              {/* Left side: Customer Info */}
              <Box sx={{ width: "45%" }}>
                <TextField
                  fullWidth
                  label="Tên người nhận"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={newOrder.address}
                  onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                  sx={{ marginBottom: "1rem" }}
                />
              </Box>

              {/* Right side: Item Table */}
              <Box sx={{ width: "50%", maxHeight: 400, overflowY: "auto" }}>
                <Typography variant="h6" gutterBottom>
                  Chọn Sản phẩm
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Thêm</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                setOrderItems(orderItems.map((i) =>
                                  i.id === item.id ? { ...i, quantity: e.target.value } : i
                                ))
                              }
                            />
                          </TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleAddOrderItem(item)}
                              sx={{ backgroundColor: "#243642", color: "white" }}
                            >
                              Thêm
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Added items display */}
                {newOrder.items.length > 0 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Các sản phẩm trong đơn hàng</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Xóa</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {newOrder.items.map((item) => (
                            <TableRow key={item.orderItem_Id}>
                              <TableCell>{item.product_Id}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.totalPrice} VND</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleDeleteOrderItem(item.orderItem_Id)}>
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            </Stack>

            <Box sx={{ marginTop: "2rem", textAlign: "right" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#243642", color: "white" }}
                onClick={handleSubmitOrder}
              >
                Lưu Đơn Hàng
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default OrderWithExpandableRows;
