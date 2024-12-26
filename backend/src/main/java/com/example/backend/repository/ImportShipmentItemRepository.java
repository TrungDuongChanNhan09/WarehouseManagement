package com.example.backend.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.ImportShipmentItem;
import java.util.Optional;

public interface ImportShipmentItemRepository extends MongoRepository<ImportShipmentItem, String> {
    @Query("{ 'importshipmentId': ?0, 'productName': ?1 }")
    Optional<ImportShipmentItem> findByImportshipmentIdAndProductName(String importshipmentId, String productName);
    @Query("{ 'productName': { $regex: ?0, $options: 'i' } }")
    List<ImportShipmentItem> searchByproductName(String productName);
}
