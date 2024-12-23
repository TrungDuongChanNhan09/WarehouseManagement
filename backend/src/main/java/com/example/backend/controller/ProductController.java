package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.request.ProductRequest;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @PostMapping("")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest product, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.addProduct(product), HttpStatus.CREATED);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@RequestBody Product product, @RequestHeader("Authorization") String jwt, @PathVariable String productId) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.updateProduct(productId, product), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        productService.deleteProductById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("")
    private ResponseEntity<List<Product>> getAllProduct(@RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.getAllProduct(), HttpStatus.OK);
    }

    @GetMapping("/getById/{id}")
    private ResponseEntity<Optional<Product>> getProductById(@PathVariable String id, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);
    }

    @GetMapping("/getByName/{name}")
    private ResponseEntity<List<Product>> getProductByName(@PathVariable String name, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.searchProductByName(name), HttpStatus.OK);
    }

    @GetMapping("/getByCategory/{categoryName}")
    private ResponseEntity<List<Product>> getProductByCategory(@PathVariable String categoryName, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.filterProductByCategory(categoryName), HttpStatus.OK);
    }

    @GetMapping("/getBySupplier/{supplierName}")
    private ResponseEntity<List<Product>> getProductBySupplier(@PathVariable String supplierName, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(productService.filterProductBySupplier(supplierName), HttpStatus.OK);
    }
}
