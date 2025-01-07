package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.model.Supplier;
import com.example.backend.serviceImpl.ShelfService;

import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.request.ProductRequest;
import com.example.backend.respone.ProductRespone;
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

    @Autowired
    private SupplierRepository supplierRepository;
    @Override
    public List<ProductRespone> getAllProduct() {
        List<ProductRespone> productRespones = new ArrayList<>();
        for(Product i : productRepository.findAll()){
            ProductRespone productRespone = new ProductRespone();
            productRespone.setId(i.getId());
            Category category = categoryRepository.findById(i.getCategoryId()).orElse(null);
            Supplier supplier = supplierRepository.findById(i.getSupplierId()).orElse(null);
            productRespone.setProduction_date(i.getProduction_date());
            productRespone.setProductName(i.getProductName());
            productRespone.setDescription(i.getDescription());
            productRespone.setImage(i.getImage());
            productRespone.setUnit(i.getUnit());
            productRespone.setPrice(i.getPrice());
            productRespone.setInventory_quantity(i.getInventory_quantity());
            productRespone.setExpiration_date(i.getExpiration_date());
            productRespone.setCategoryId(i.getCategoryId());
            productRespone.setSupplierId(i.getSupplierId());
            productRespone.setSupplierName(supplier.getNameSupplier());
            productRespone.setCategoryName(category.getCategoryName());
            productRespones.add(productRespone);
            productRespone.setStatus(i.getProductStatus());
        }

        return productRespones;
    }

    @Override
    public Product addProduct(ProductRequest product) {
        Product existingProduct = this.productRepository.findByproductName(product.getProductName());
        if(existingProduct != null) {
            existingProduct.setInventory_quantity(existingProduct.getInventory_quantity() + product.getInventory_quantity());
            return productRepository.save(existingProduct);
        }

        Product newProduct = new Product();

        newProduct.setProductName(product.getProductName());
        newProduct.setProduction_date(product.getProduction_date());
        newProduct.setUnit(product.getUnit());
        newProduct.setSupplierId(product.getSupplierId());
        newProduct.setCategoryId(product.getCategoryId());
        newProduct.setExpiration_date(product.getExpiration_date());
        newProduct.setImage(product.getImage());
        newProduct.setDescription(product.getDescription());
        newProduct.setInventory_quantity(product.getInventory_quantity());
        newProduct.setPrice(product.getPrice());
        return productRepository.save(newProduct);
    }

    @Override
    public Product updateProduct(String productId, Product product) throws Exception {
        Product existingProduct = this.productRepository.findById(productId).orElse(null);
        if (existingProduct == null) {
            throw new Exception("Product not found");
        } else {
            existingProduct.setProductName(product.getProductName());
            existingProduct.setProduction_date(product.getProduction_date());
            existingProduct.setExpiration_date(product.getExpiration_date());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setInventory_quantity(product.getInventory_quantity());
            existingProduct.setImage(product.getImage());
            existingProduct.setCategoryId(product.getCategoryId());
            existingProduct.setUnit(product.getUnit());
            existingProduct.setSupplierId(product.getSupplierId());
            existingProduct.setPrice(product.getPrice());
            return this.productRepository.save(existingProduct);
        }
    }

    @Override
    public List<Product> filterProductByCategory(String categoryName) throws Exception {
        Category category = categoryRepository.findBycategoryName(categoryName);
        if(category == null){
            throw new Exception("Product with category not found...");
        }
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
    public List<Product> filterProductBySupplier(String supplierName) throws Exception {
        Supplier supplier = supplierRepository.findBynameSupplier(supplierName);
        if(supplier == null){
            throw new Exception("Product with supplier not found...");
        }
        List<Product> products = productRepository.findAll();
        List<Product> filterProduct = new ArrayList<>();
        for (Product product : products){
            if(product.getSupplierId().equals(supplier.getId())){
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
//        Product product = new Product();
//        product.setProductName(productName);
//        ExampleMatcher matcher = ExampleMatcher.matchingAny()
//                .withMatcher("productName", ExampleMatcher.GenericPropertyMatchers.contains().ignoreCase());
//        Example<Product> example = Example.of(product, matcher);
        return this.productRepository.searchByProductName(productName);
    }

    @Override
    public void deleteProductById(String productId) {
        productRepository.deleteById(productId);
    }
}
