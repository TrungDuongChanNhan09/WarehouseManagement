package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.request.CategoryRequest;
import com.example.backend.service.CategoryService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private UserService userService;
    @GetMapping("")
    public ResponseEntity<List<Category>> getAllCategory(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(categoryService.getAllCategory(), HttpStatus.OK);
    }

    @GetMapping("/getCategoryName")
    public ResponseEntity<List<String>> getAllCategoryName(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(categoryService.getCategoryName(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Category>> getCategoryById(@RequestHeader("Authorization") String jwt, @PathVariable String id) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(categoryService.getCategoryById(id), HttpStatus.OK);
    }
}
