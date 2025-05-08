package com.example.backend.repository;

import com.example.backend.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Category findBycategoryName(String categoryName);
}
