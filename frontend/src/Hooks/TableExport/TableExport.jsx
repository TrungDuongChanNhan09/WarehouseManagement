import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";

const ExportShipmentTable = ({ shipments, expandedShipmentId, handleExpandRow, handleOpenModal, handleDeleteShipment }) => {
  return (
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
          {shipments.map((shipment) => (
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
                  <IconButton sx={{ ml: 1 }} onClick={() => handleDeleteShipment(shipment.export_id)}>
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
  );
};

export default ExportShipmentTable;
