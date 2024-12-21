package com.example.backend.repository;

import com.example.backend.model.OrderItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends MongoRepository<OrderItem, String> {
    OrderItem findByorderItemCode(String orderItemCode);

    void deleteByorderItemCode(String orderItemCode);
}
