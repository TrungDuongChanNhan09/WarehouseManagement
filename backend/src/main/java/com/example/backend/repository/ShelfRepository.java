package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.Shelf;

public interface ShelfRepository extends MongoRepository<Shelf, String> {
    List<Shelf> findByinventoryid(String inventoryId);
    List<Shelf> findByproductId(String productId);

    Shelf findByshelfCode(String shelfCode);
}