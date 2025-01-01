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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      // Kiểm tra nếu chưa chọn đơn hàng
      if (!selectedOrder) {
        console.log("No order selected, skipping fetch.");
        return;
      }
  
      try {
        // Log order ID đang xử lý
        console.log("1. Fetching data for order ID:", selectedOrder.id);
        setOrderDetails(selectedOrder);
  
        // Log thông tin orderItem_code đang được sử dụng
        console.log("2. Fetching order items for orderItemCode:", selectedOrder.orderItem_code);
  
        // Lấy danh sách các order items
        const fetchedOrderItems = await ApiService.getOrderItemByCode(selectedOrder.orderItem_code);
        console.log("3. Fetched Order Items:", fetchedOrderItems);
  
        // Kiểm tra nếu dữ liệu trả về là một mảng
        if (Array.isArray(fetchedOrderItems)) {
          console.log("4. Order Items is an array. Processing each item...");
  
          const productDetails = []; // Mảng để lưu thông tin chi tiết sản phẩm
  
          // Duyệt qua từng item trong order và lấy thông tin sản phẩm
          for (const item of fetchedOrderItems) {
            try {
              // Log thông tin sản phẩm theo product_id
              console.log(`5. Fetching product for item with product_id: ${item.product_id}`);
              const fetchedProduct = await ApiService.getProductById(item.product_id);
              console.log(`6. Fetched Product for item ${item.orderItemCode}:`, fetchedProduct);
  
              // Lấy thông tin kệ cho sản phẩm này
              console.log(`7. Fetching shelf data for Order Item Code: ${item.orderItemCode}, Product Name: ${item.productName}`);
              const shelvesResponse = await ApiService.getShelfByProductName(fetchedProduct.productName);
              console.log(`8. Fetched Shelves for Product ${item.productName}:`, shelvesResponse);
  
              // Kiểm tra nếu có kệ và lấy mã kệ
              const shelfCodes = shelvesResponse ? shelvesResponse.map(shelf => shelf.code) : [];
              console.log(`9. Shelf Codes for Product ${item.productName}:`, shelfCodes);
  
              // Thêm chi tiết vào danh sách productDetails
              productDetails.push({
                ...item,
                productName: item.productName,
                productPrice: item.price,
                orderItemCode: item.orderItemCode,  // Đảm bảo orderItemCode có trong dữ liệu
                shelfCode: shelfCodes,  // Lưu kệ vào
              });
            } catch (error) {
              console.error(`10. Error fetching product or shelf data for Order Item Code: ${item.orderItemCode}`, error);
            }
          }
  
          // Log danh sách các item sau khi đã lấy đủ thông tin
          console.log("11. Order Items with Product and Shelf Details:", productDetails);
          setOrderItems(productDetails); // Cập nhật state với danh sách item đã xử lý
        } else if (fetchedOrderItems && typeof fetchedOrderItems === 'object') {
          // Nếu là đối tượng, vẫn gọi API để lấy sản phẩm và kệ
          console.log("12. Fetched Order Item is a single object. Processing single item...");
  
          try {
            console.log("13. Fetching product for single item with product_id:", fetchedOrderItems.product_id);
            const fetchedProduct = await ApiService.getProductById(fetchedOrderItems.product_id);
            console.log("14. Fetched Product for single item:", fetchedProduct);
  
            console.log(`15. Fetching shelf data for Order Item Code: ${fetchedOrderItems.orderItemCode}, Product Name: ${fetchedOrderItems.productName}`);
            const shelvesResponse = await ApiService.getShelfByProductName(fetchedProduct.productName);
            console.log(`16. Fetched Shelves for Product ${fetchedOrderItems.productName}:`, shelvesResponse);
  
            const shelfCodes = shelvesResponse ? shelvesResponse.map(shelf => shelf.code) : [];
            console.log(`17. Shelf Codes for Product ${fetchedOrderItems.productName}:`, shelfCodes);
  
            const productDetails = [
              {
                ...fetchedOrderItems, 
                productName: fetchedProduct.productName, 
                productPrice: fetchedProduct.price,     
                orderItemCode: fetchedOrderItems.orderItemCode,
              },
            ];
            
  
            console.log("18. Order Item (single) with Product and Shelf Details:", productDetails);
            setOrderItems(productDetails); // Cập nhật state với thông tin sản phẩm duy nhất
          } catch (error) {
            console.error(`19. Error fetching product or shelf data for Order Item Code: ${fetchedOrderItems.orderItemCode}`, error);
          }
        } else {
          console.error("20. Fetched Order Items is not in expected format", fetchedOrderItems);
        }
      } catch (error) {
        // Log lỗi nếu có vấn đề trong quá trình fetching dữ liệu
        console.error("21. Error fetching order data", error.response?.data || error.message);
      }
    };
    fetchOrderData();
  }, [selectedOrder]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ApiService.getProduct();
        console.log("asf fetching products");
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
  
    fetchProducts();
  }, []);
  
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

  const handleAddOrderItem = (productCode) => {
    console.log("Adding product:", productCode); // Debug: Log the productCode being added
  
    // Find the product details by productCode
    const product = products.find((product) => product.productCode === productCode);
  
    if (product) {
      console.log("Product found:", product); 
    
      setOrderItems([
        ...orderItems,
        {
          ...product,
          quantity: 1,
          orderItemCode: `orderItem-${Date.now()}`
        },
      ]);
    } else {
      console.error("Product not found for productCode:", productCode);
    }
  };
  

  const handleSubmitOrder = async () => {
    try {
      // Kiểm tra nếu không có order items, thông báo lỗi
      if (!orderItems || orderItems.length === 0) {
        console.error("No items in the order. Please add items before submitting.");
        return;
      }
  
      // Khởi tạo mảng để chứa các promises tạo mới item
      const createItemPromises = [];
  
      // Duyệt qua các item trong orderItems, tạo mới nếu cần
      for (const item of orderItems) {
        if (!item.orderItemCode) {
          // Nếu không có orderItemCode, nghĩa là đây là item mới, cần tạo
          const createItem = ApiService.addOrderItem({
            productId: item.productId, // Bạn có thể thay đổi tùy thuộc vào cấu trúc dữ liệu
            quantity: item.quantity,
            shelfCode: item.shelfCode,
          });
  
          createItemPromises.push(createItem); // Thêm promise tạo item mới vào mảng
        }
      }
  
      // Đợi tất cả các item mới được tạo
      const createdItems = await Promise.all(createItemPromises);
      console.log("All new order items have been created successfully.");
  
      // Cập nhật orderItemCode cho các item đã được tạo mới
      createdItems.forEach((newItem, index) => {
        if (!orderItems[index].orderItemCode) {
          orderItems[index].orderItemCode = newItem.orderItemCode;
        }
      });
  
      // Cập nhật thời gian update_at
      const currentTime = new Date().toISOString();
  
      // Tiến hành chuẩn bị dữ liệu để gửi đi
      const orderData = {
        ...orderDetails, // Thông tin chi tiết đơn hàng
        orderItem_code: orderItems.map((item) => item.orderItemCode).filter(Boolean),
        update_at: currentTime, // Thêm thời gian cập nhật
      };
  
      // Log toàn bộ thông tin dữ liệu sẽ được gửi
      console.log("Order data prepared for submission:", JSON.stringify(orderData, null, 2));
  
      // Kiểm tra nếu `selectedOrder.id` có tồn tại
      if (selectedOrder.id) {
        console.log("Submitting order update for order ID:", selectedOrder.id);
        await ApiService.updateOrder(selectedOrder.id, orderData);
        console.log("Order updated successfully.");
      } else {
        console.error("No selected order to update.");
      }
  
      handleCloseModal(); // Đóng modal sau khi gửi thành công
    } catch (error) {
      console.error("Error submitting order:", error.response?.data || error.message);
    }
  };
  
  
  

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
                  const mappedStatus = selectedStatus === "Đang chờ" ? "PENDING" : "DELIVERED";
                  setOrderDetails({ ...orderDetails, orderState: mappedStatus });
                }}
                sx={{ marginBottom: 2 }}
              >
                {[
                  { label: "Đang chờ", value: "PENDING" },
                  { label: "Đã giao", value: "DELIVERED" }
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item, index) => (
                          <TableRow key={index}>
                           <TableCell>
                          <TextField
                            value={item.orderItemCode || "N/A"}
                            onChange={(e) => handleInputChange(item.id, e.target.value)} // Add handler for updates
                            variant="outlined"
                            fullWidth
                          />
                        </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <TextField
                                select
                                value={item.shelfCode && item.shelfCode.length > 0 ? item.shelfCode[0] : ""}
                                onChange={(e) =>
                                  handleOrderItemChange(item.orderItemCode, "shelfCode", e.target.value || null)
                                }
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
                                onChange={(e) =>
                                  handleOrderItemChange(item.orderItemCode, "quantity", parseInt(e.target.value, 10))
                                }
                              />
                            </TableCell>
                            <TableCell>{item.productPrice * item.quantity} VND</TableCell>
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
                        <TableCell>Số lượng trong kho</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Thêm vào đơn hàng</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products
                        .filter((product) => product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((product) => (
                          <TableRow key={product.productCode}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.inventory_quantity}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleAddOrderItem(product.productCode)}
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
        onClick={handleCloseModal}  // Gọi hàm đóng modal
        sx={{
          backgroundColor: "#f44336",  // Màu đỏ cho nút đóng
          '&:hover': {
            backgroundColor: "#d32f2f",  // Màu khi hover
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
     
    </Box>
  </Box>
</Box>

      </Fade>
    </Modal>
  );
};

export default OrderUpdateModal;
