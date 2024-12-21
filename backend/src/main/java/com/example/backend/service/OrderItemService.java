package com.example.backend.service;

import com.example.backend.model.OrderItem;

import java.util.List;
import java.util.Optional;

public interface OrderItemService {
    OrderItem createOrderItem(OrderItem orderItem) throws Exception;
    OrderItem updateOrderItem(OrderItem orderItem, String id) throws Exception;
    void deleteOrderItem(String id);
    Optional<OrderItem> getOrderItemById(String id);
    List<OrderItem> getAllOrderItem();
    List<String> getAllOrderItemCode();
}
