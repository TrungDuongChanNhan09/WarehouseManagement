package com.example.backend.service;

import com.example.backend.model.Product;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProduct();
    Product addProduct(Product product);
    Product updateProduct(String productId, Product product);
    List<Product> filterProductByCategory(String categoryName);
    Optional<Product> getProductById(String productId);
    List<Product> searchProductByName(String productName);
    void deleteProductById(String productId);
}
