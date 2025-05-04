package com.example.backend.repository;

import com.example.backend.model.Category;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findBycategoryName(String categoryName);
}
