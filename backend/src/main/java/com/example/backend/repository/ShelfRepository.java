package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;

public interface ShelfRepository extends MongoRepository<Shelf, String> {
    List<Shelf> findByinventoryid(String inventoryId);
    List<Shelf> findByproductId(String productId);
    @Query("{ 'nameInventory': { $regex: ?0, $options: 'i' } }")
    List<Shelf> searchBynameShelf(String shelfName);
}