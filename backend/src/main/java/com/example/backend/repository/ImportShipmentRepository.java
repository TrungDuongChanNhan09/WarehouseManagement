package com.example.backend.repository;

import com.example.backend.model.ImportShipment;
import com.example.backend.model.Shelf;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ImportShipmentRepository extends MongoRepository<ImportShipment, String> {
    List<ImportShipment> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate);
    @Query("{ 'suppiler': { $regex: ?0, $options: 'i' } }")
    List<ImportShipment> searchBysuppiler(String suppiler);
}