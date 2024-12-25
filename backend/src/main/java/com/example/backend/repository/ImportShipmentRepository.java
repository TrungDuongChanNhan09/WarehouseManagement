package com.example.backend.repository;

import com.example.backend.model.ImportShipment;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ImportShipmentRepository extends MongoRepository<ImportShipment, String> {
    List<ImportShipment> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate);
}