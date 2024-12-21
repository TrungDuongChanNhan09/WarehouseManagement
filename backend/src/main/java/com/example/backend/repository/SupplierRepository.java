package com.example.backend.repository;

import com.example.backend.model.Supplier;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends MongoRepository<Supplier, String> {
    Supplier findBynameSupplier(String supplierName);
}
