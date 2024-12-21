package com.example.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;

public interface InventoryService {
    List<Inventory> getAllInventories();
    void addInventory(Inventory item) throws Exception;
    void updateInventory(String inventoryId, Inventory updatedInventory) throws Exception;
    void deleteInventory(String inventoryId);
    Optional<Inventory> getInventoryById(String inventoryId);
    boolean inventoryExists(String inventoryId);
    void updateInventoryStatus(String inventoryId, String status) throws Exception;
    void updateInventoryQuantity(String inventoryId);

    List<Inventory> filterInventoriesByType(String type);
    List<Inventory> searchInventoriesByName(String keyword);

    //Page<Inventory> getInventoriesByWarehouse(String warehouseId, Pageable pageable);
    int getInventoryQuantity(String inventoryId);
    List<Inventory> getInventoriesByStatus(String status);

    List<String> getDistinctInventoryTypes();

    int calculateNewQuantity(String inventory_id);
}
