package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByuserId(String userId);

    Order findByorderCode(String orderCode);
    @Query("{ '$expr': { '$and': [ { '$eq': [ { '$month': '$created_at' }, ?0 ] }, { '$eq': [ { '$year': '$created_at' }, ?1 ] } ] } }")
    List<Order> findOrdersByMonthAndYear(int month, int year);


}
