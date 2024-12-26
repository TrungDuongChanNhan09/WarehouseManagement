package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.model.Inventory;
import com.example.backend.model.Shelf;

public interface ShelfRepository extends MongoRepository<Shelf, String> {
    List<Shelf> findByinventoryid(String inventoryId);
    List<Shelf> findByproductId(String productId);

    Shelf findByshelfCode(String shelfCode);
    @Query("{ 'shelfCode': { $regex: ?0, $options: 'i' } }")
    List<Shelf> searchByshelfCode(String shelfCode);
}