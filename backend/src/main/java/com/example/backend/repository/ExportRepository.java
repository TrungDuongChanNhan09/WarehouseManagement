package com.example.backend.repository;

import com.example.backend.model.Export;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExportRepository extends MongoRepository<Export, String> {
    List<Export> findBycreatedAtBetween(LocalDate startDate, LocalDate endDate);
}
