package com.example.backend.service;

import com.example.backend.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategory();

    Category createCategory(Category category);

    void deleteCategory(String categoryId);
}
