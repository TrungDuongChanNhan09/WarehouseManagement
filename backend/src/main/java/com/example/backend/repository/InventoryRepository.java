package com.example.backend.repository;
import java.util.List;

//import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;

public interface InventoryRepository  extends MongoRepository<Inventory, String> {
    Inventory findByinventoryName(String inventoryName);
    List<Shelf> findByInventoryId(String inventoryId);
    @Query(value = "{}", fields = "{typeInventory: 1, _id: 0}")
    List<String> findDistinctTypeInventory();
    List<Inventory> findByStatus(String status);
    @Query(value = "{ '_id': ?0 }", fields = "{ 'quantity': 1 }")
    int findQuantityById(String inventoryId);
}
