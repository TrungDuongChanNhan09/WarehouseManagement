package com.example.backend.repository;
import java.util.List;

//import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import com.example.backend.model.Inventory;
import com.example.backend.ENUM.INVENTORY_STATE;
public interface InventoryRepository  extends MongoRepository<Inventory, String> {
    Inventory findBynameInventory(String inventoryName);
    @Query("{ 'nameInventory': { $regex: ?0, $options: 'i' } }")
    List<Inventory> searchBynameInventory(String inventoryName);

    List<Inventory> findByStatus(INVENTORY_STATE status);
}
