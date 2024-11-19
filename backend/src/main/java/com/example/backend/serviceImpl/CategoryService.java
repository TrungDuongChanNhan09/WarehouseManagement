package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CategoryService implements com.example.backend.service.CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
