package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class ProductService implements com.example.backend.service.ProductService {
    @Autowired
    private UserService userService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String productId, Product product) {
        Product existingProduct = this.productRepository.findById(productId).orElse(null);
        if (existingProduct == null) {
            return null;
        } else {
            existingProduct.setProductName(product.getProductName());
            existingProduct.setProduction_date(product.getProduction_date());
            existingProduct.setExpiration_date(product.getExpiration_date());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setInventory_quantity(product.getInventory_quantity());
            existingProduct.setImage(product.getImage());
            existingProduct.setCategoryId(product.getCategoryId());
            existingProduct.setUnit(product.getUnit());
            return this.productRepository.save(product);
        }
    }

    @Override
    public List<Product> filterProductByCategory(String categoryName) {
        Category category = categoryRepository.findBycategoryName(categoryName);
        List<Product> products = productRepository.findAll();
        List<Product> filterProduct = new ArrayList<>();
        for (Product product : products){
            if(product.getCategoryId().equals(category.getId())){
                filterProduct.add(product);
            }
        }
        return filterProduct;
    }

    @Override
    public Optional<Product> getProductById(String productId) {
        return productRepository.findById(productId);
    }

    @Override
    public List<Product> searchProductByName(String productName) {
        Product product = new Product();
        product.setProductName(productName);
        ExampleMatcher matcher = ExampleMatcher.matchingAny()
                .withMatcher("productName", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());
        Example<Product> example = Example.of(product, matcher);
        return this.productRepository.findAll(example);
    }

    @Override
    public void deleteProductById(String productId) {
        productRepository.deleteById(productId);
    }
}
