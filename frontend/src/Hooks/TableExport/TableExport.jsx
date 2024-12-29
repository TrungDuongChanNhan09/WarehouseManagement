import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Box, Typography, Paper } from "@mui/material";
import { ExpandMore, ExpandLess, Edit, Delete } from "@mui/icons-material";

const TableExport = ({ exportShipments, expandedShipmentId, onRowExpand, onEdit, onDelete }) => {
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
          {exportShipments.map((shipment) => (
            <React.Fragment key={shipment.id}>
              <TableRow hover>
                <TableCell>
                  <IconButton onClick={() => onRowExpand(shipment.id)}>
                    {expandedShipmentId === shipment.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </TableCell>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.export_address}</TableCell>
                <TableCell>{shipment.exportState}</TableCell>
                <TableCell>{shipment.createdAt || "Chưa có ngày tạo"}</TableCell>
                <TableCell>{shipment.updatedAt || "Chưa có ngày cập nhật"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(shipment)}>
                    <Edit />
                  </IconButton>
                  <IconButton sx={{ ml: 1 }} onClick={() => onDelete(shipment.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                  <Collapse in={expandedShipmentId === shipment.id} timeout="auto" unmountOnExit>
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
                          {shipment.orders?.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
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

export default TableExport;
