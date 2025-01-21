package com.example.backend.serviceImpl;

import com.example.backend.ENUM.EXPORT_STATE;
import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import com.example.backend.model.*;
import com.example.backend.repository.ExportRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.request.ExportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExportService implements com.example.backend.service.ExportService {
    @Autowired
    private ExportRepository exportRepository;

    @Autowired
    private OrderRepository orderRepository;
    @Override
    public Export createExport(ExportRequest export) {
        Export newExport = new Export();
        LocalDate currentDate = LocalDate.now();
        if(export.getCreated_at() == null)
            newExport.setCreatedAt(currentDate);
        else if (export.getCreated_at().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        newExport.setCreatedAt(export.getCreated_at());
        newExport.setOrderCode(export.getOrderCode());
        newExport.setOrderQuantity(export.getOrderCode().size());
        newExport.setExport_address(export.getExport_address());
        int totalPrice = 0;
        for (String i : export.getOrderCode()){
            Order order = orderRepository.findByorderCode(i);
            order.setOrderStatus(ORDER_STATUS.IN_EXPORT);
            totalPrice += order.getOrderPrice();
            orderRepository.save(order);
        }
        newExport.setPrice(totalPrice);
        newExport.setRevenue(totalPrice*0.1);
        return exportRepository.save(newExport);
    }

    @Override
    public Export updateExport(String exportId, ExportRequest export) throws Exception {
        Export existingExport = exportRepository.findById(exportId).orElse(null);
        if(existingExport == null){
            throw new Exception("Export not found");
        }
        LocalDate currentDate = LocalDate.now();
        if(export.getCreated_at() == null)
            existingExport.setCreatedAt(currentDate);
        else if (export.getUpdated_at().compareTo(currentDate) > 0) {
            throw new IllegalArgumentException("Ngày nhập không được lớn hơn ngày hiện tại.");
        }
        existingExport.setExport_address(export.getExport_address());
        existingExport.setOrderCode(export.getOrderCode());
        existingExport.setOrderQuantity(export.getOrderCode().size());
        existingExport.setUpdatedAt(currentDate);
        int totalPrice = 0;

        for (String i : export.getOrderCode()){
            Order order = orderRepository.findByorderCode(i);
            order.setOrderStatus(ORDER_STATUS.IN_EXPORT);
            totalPrice += order.getOrderPrice();
            orderRepository.save(order);
        }
        existingExport.setPrice(totalPrice);
        existingExport.setRevenue(totalPrice*0.1);
        return exportRepository.save(existingExport);
    }

    @Override
    public void deleteExport(String exportId) {
        Export export = exportRepository.findById(exportId).orElse(null);
        if(export.getExportState() == EXPORT_STATE.PENDING){
            for(String orderCode : export.getOrderCode()){
                Order order = orderRepository.findByorderCode(orderCode);
                order.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
                orderRepository.save(order);
            }
        }
        exportRepository.deleteById(exportId);
    }

    @Override
    public Export getExportById(String exportId) throws Exception {
        Export export = exportRepository.findById(exportId).orElse(null);
        if(export == null){
            throw new Exception("Export is not found");
        }
        return export;
    }

    @Override
    public List<Export> getAllExport() {
        return exportRepository.findAll();
    }

    @Override
    public List<Export> getExportByState(EXPORT_STATE exportState) {
        List<Export> exports = new ArrayList<>();
        for(Export export : exportRepository.findAll()){
            if (export.getExportState() == exportState){
                exports.add(export);
            }
        }
        return exports;
    }

   @Override
    public Export updateExportStatus(String exportId, EXPORT_STATE exportState) throws Exception {
        Export existingExport = exportRepository.findById(exportId).orElse(null);
        if(existingExport == null){
            throw new Exception("Export not found");
        }
        existingExport.setExportState(exportState);
        if(exportState == EXPORT_STATE.ON_GOING){
            for(String orderCode : existingExport.getOrderCode()){
                Order order = orderRepository.findByorderCode(orderCode);
                order.setOrderState(ORDER_STATE.ON_GOING);
                orderRepository.save(order);
            }
        }
        return exportRepository.save(existingExport);
    }

    @Override
    public List<Export> getExportByDateRange(LocalDate startDate, LocalDate endDate) throws Exception {
        List<Export> importShipments = exportRepository.findBycreatedAtBetween(startDate, endDate);
        if (importShipments == null || importShipments.isEmpty()) {
            throw new Exception("No import shipments found for the given date range.");
        }
        return importShipments;
    }
}
