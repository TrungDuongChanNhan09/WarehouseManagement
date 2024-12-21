package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.Product;
import com.example.backend.model.Shelf;

public interface ShelfRepository extends MongoRepository<Shelf, String> {
    List<Shelf> findByInventoryId(String inventoryId);
    Shelf findByshelfid(String shelfid);
    List<Product> findProductsByProductIds(List<String> productIds);
}