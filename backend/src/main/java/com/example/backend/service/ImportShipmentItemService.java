package com.example.backend.service;

import java.util.List;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;


public interface ImportShipmentItemService {
    ImportShipmentItem createImportShipmentItem(ImportShipmentItem item) throws Exception;
    ImportShipmentItem updateImportShipmentItem(String id, ImportShipmentItem item);
    ImportShipmentItem getImportShipmentItemById(String id);
    List<ImportShipmentItem> getAllImportShipmentItems();
    void deleteImportShipmentItem(String id);   
    
    List<ImportShipmentItem> searchImportShipmentItems(String productname);
    
}