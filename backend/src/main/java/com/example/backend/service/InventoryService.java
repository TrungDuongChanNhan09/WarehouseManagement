package com.example.backend.service;

import java.util.List;

import java.util.Optional;
import com.example.backend.model.Inventory;
import com.example.backend.request.InventoryStatus;

public interface InventoryService {
    List<Inventory> getAllInventories();
    Inventory addInventory(Inventory item) throws Exception;
    Inventory updateInventory(String inventoryId, Inventory updatedInventory) throws Exception;
    void deleteInventory(String inventoryId);
    Optional<Inventory> getInventoryById(String inventoryId);
    Inventory updateInventoryStatus(String inventoryId, InventoryStatus status) throws Exception;
    Inventory updateInventoryQuantity(String inventoryId);

    List<Inventory> filterInventoriesByType(String type);
    List<Inventory> searchInventoriesByName(String keyword);

    int getInventoryQuantity(String inventoryId);
    List<Inventory> getInventoriesByStatus(InventoryStatus status);

    List<String> getDistinctInventoryTypes();

    int calculateNewQuantity(String inventory_id);
}
