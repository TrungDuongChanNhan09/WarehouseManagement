package com.example.backend.repository;

import com.example.backend.model.Export;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportRepository extends MongoRepository<Export, String> {

}
