package com.example.backend.controller;

import java.util.List;

import com.example.backend.respone.ApiResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.request.CategoryRequest;
import com.example.backend.request.UserInforRequest;
import com.example.backend.service.CategoryService;
import com.example.backend.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin/category")
@Tag(name = "Category API")
public class AdminCategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private UserService userService;
    @PostMapping("")
    public ResponseEntity<CategoryRequest> createCategory(@RequestBody CategoryRequest category, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        Category newCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<List<Category>> deleteCategory(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception{
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
