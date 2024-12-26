package com.example.backend.service;

import com.example.backend.model.Category;
import com.example.backend.request.CategoryRequest;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> getAllCategory();

    Category createCategory(CategoryRequest categoryRequest) throws Exception;

    void deleteCategory(String categoryId);
    List<String> getCategoryName();

    Optional<Category> getCategoryById(String id);
}
