package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.request.CategoryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public Category createCategory(CategoryRequest category) throws Exception {
        Category existingCategory = categoryRepository.findBycategoryName(category.getCategoryName());
        if(existingCategory != null){
            throw new Exception("Category is already exist");
        }
        Category newCategory = new Category();
        newCategory.setCategoryName(category.getCategoryName());
        newCategory.setDescription(category.getDescription());
        return categoryRepository.save(newCategory);
    }

    @Override
    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public List<String> getCategoryName(){
        List<Category> categories = categoryRepository.findAll();
        List<String> categoryName = new ArrayList<>();
        for(Category category : categories){
            categoryName.add(category.getCategoryName());
        }
        return categoryName;
    }
}
