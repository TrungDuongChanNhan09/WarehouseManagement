package com.example.backend.service;

import com.example.backend.model.ORDER_STATE;
import com.example.backend.model.Order;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.request.OrderStatusRequest;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(OrderItemRequest order, String jwt) throws Exception;
    Order updateOrder(OrderItemRequest order, String orderId) throws Exception;
    List<Order> getAllOrder();
    Optional<Order> getOrderById(String id);
    void deleteOrder(String id);
    List<Order> getOrderByUserId(String userId);
    Order updateOrderStatus(OrderStatusRequest state, String orderId) throws Exception;
}
