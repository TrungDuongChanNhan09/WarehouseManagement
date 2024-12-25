package com.example.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import com.example.backend.model.Product;

public interface ImportShipmentService {
    ImportShipment createImportShipment(ImportShipment importShipment);
    ImportShipment updateImportShipment(String id, ImportShipment importShipment);
    ImportShipment getImportShipmentById(String id);
    List<ImportShipment> getAllImportShipments();
    List<ImportShipmentItem> getImportShipmentItemsByImportShipmentId(String importshipmentId) throws Exception;
    BigDecimal getImportShipmentTotalCost(String importShipmentId) throws Exception ;
    void deleteImportShipment(String id) throws Exception;
    int getQuantityItem(String id) throws Exception;

    List<ImportShipment> searchImportShipmentsBysuppiler(String suppiler);
    List<ImportShipment> getImportShipmentsByDateRange(LocalDate startDate, LocalDate endDate) throws Exception;
}
