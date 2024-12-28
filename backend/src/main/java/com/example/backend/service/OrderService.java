package com.example.backend.service;

import com.example.backend.model.ORDER_STATE;
import com.example.backend.model.ORDER_STATUS;
import com.example.backend.model.Order;
import com.example.backend.model.OrderQuantity;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.request.OrderStateRequest;
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
    Order updateOrderState(OrderStateRequest state, String orderId) throws Exception;
    List<Order> getOrderByState(ORDER_STATE orderState);
    List<Order> getOrderByStatus(ORDER_STATUS orderStatus);
    OrderQuantity getOrderQuantity();
}
