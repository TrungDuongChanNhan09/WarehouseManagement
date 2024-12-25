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
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess, Add, Edit, Delete } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
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

const ExportShipment = () => {
  const [expandedShipmentId, setExpandedShipmentId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newExport, setNewExport] = useState({
    export_address: "",
    export_state: "",
    order_ids: [],
    order_quantity: 0,
  });

  const [exportShipments, setExportShipments] = useState([
    {
      export_id: "EXP001",
      export_address: "123 Main St",
      export_state: "Pending",
      created_At: "01/11/2024",
      updated_At: "01/11/2024",
      order_ids: ["O001", "O002"],
      order_quantity: 3,
    },
    {
      export_id: "EXP002",
      export_address: "456 Oak Ave",
      export_state: "Shipped",
      created_At: "02/11/2024",
      updated_At: "02/11/2024",
      order_ids: ["O003"],
      order_quantity: 1,
    },
  ]);

  const handleExpandRow = (shipmentId) => {
    setExpandedShipmentId((prev) => (prev === shipmentId ? null : shipmentId));
  };

  const handleOpenModal = (shipment = null) => {
    if (shipment) {
      // Edit mode
      setNewExport({
        ...shipment,
      });
    } else {
      // Add new export shipment
      setNewExport({
        export_address: "",
        export_state: "",
        order_ids: [],
        order_quantity: 0,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleSubmitExport = () => {
    const newExportId = `EXP${exportShipments.length + 1}`;
    setExportShipments([
      ...exportShipments,
      {
        ...newExport,
        export_id: newExportId,
        created_At: new Date().toLocaleDateString(),
        updated_At: new Date().toLocaleDateString(),
      },
    ]);
    setNewExport({
      export_address: "",
      export_state: "",
      order_ids: [],
      order_quantity: 0,
    });
    handleCloseModal();
  };

  const filteredShipments = exportShipments.filter(
    (shipment) =>
      shipment.export_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.export_state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 2 }}>
      <PrimarySearchAppBar />

      <Stack sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem", marginTop: 0 }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", width: "200px" }} variant="p">
            Quản lý Xuất Hàng
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

            <Button onClick={() => handleOpenModal()} sx={{ color: "white", height: "50px", backgroundColor: "#243642" }} variant="contained">
              <Add sx={{ color: "white" }} />
              Thêm Xuất Hàng
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
                <TableCell>Địa chỉ xuất hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <React.Fragment key={shipment.export_id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton onClick={() => handleExpandRow(shipment.export_id)}>
                        {expandedShipmentId === shipment.export_id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{shipment.export_id}</TableCell>
                    <TableCell>{shipment.export_address}</TableCell>
                    <TableCell>{shipment.export_state}</TableCell>
                    <TableCell>{shipment.created_At}</TableCell>
                    <TableCell>{shipment.updated_At}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(shipment)}>
                        <Edit />
                      </IconButton>
                      <IconButton sx={{ ml: 1 }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedShipmentId === shipment.export_id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom>
                            Các Đơn Hàng trong Xuất Hàng
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Số lượng</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {shipment.order_ids.map((orderId, index) => (
                                <TableRow key={orderId}>
                                  <TableCell>{orderId}</TableCell>
                                  <TableCell>{shipment.order_quantity}</TableCell>
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

      {/* Modal for Adding/Editing Export Shipment */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={openModal}>
          <Box sx={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 1000, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>Thêm hoặc Chỉnh sửa Xuất Hàng</Typography>
            <Stack direction="row" spacing={4}>
              {/* Left side: Export Info */}
              <Box sx={{ width: "45%" }}>
                <TextField
                  fullWidth
                  label="Địa chỉ xuất hàng"
                  value={newExport.export_address}
                  onChange={(e) => setNewExport({ ...newExport, export_address: e.target.value })}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  fullWidth
                  label="Trạng thái xuất hàng"
                  value={newExport.export_state}
                  onChange={(e) => setNewExport({ ...newExport, export_state: e.target.value })}
                  sx={{ marginBottom: "1rem" }}
                />
              </Box>

              {/* Right side: Order IDs */}
              <Box sx={{ width: "50%" }}>
                <Typography variant="h6" gutterBottom>
                  Danh sách Đơn Hàng
                </Typography>
                {/* Here, you can display order ids or provide a selection mechanism */}
              </Box>
            </Stack>

            <Box sx={{ marginTop: "2rem", textAlign: "right" }}>
              <Button variant="contained" sx={{ backgroundColor: "#243642", color: "white" }} onClick={handleSubmitExport}>
                Lưu Xuất Hàng
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default ExportShipment;
