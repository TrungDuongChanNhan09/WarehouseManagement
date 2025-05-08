package com.example.backend.repository;

import com.example.backend.model.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    Product findByproductName(String productName);

    @Query("{ 'productName': { $regex: ?0, $options: 'i' } }")
    List<Product> searchByProductName(String productName);

    @Query("{ 'expiration_date': { $gte: ?0, $lte: ?1 } }")
    List<Product> findProductsExpiringWithin(Date startDate, Date endDate);
}
