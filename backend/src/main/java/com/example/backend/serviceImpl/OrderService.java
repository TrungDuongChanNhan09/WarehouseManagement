package com.example.backend.serviceImpl;

import com.example.backend.model.*;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.request.OrderItemRequest;
import com.example.backend.request.OrderStateRequest;
import com.example.backend.request.OrderStatusRequest;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements com.example.backend.service.OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Override
    public Order createOrder(OrderItemRequest order, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order existingOrder = orderRepository.findByorderCode(order.getOrderCode());
        if(existingOrder != null){
            throw new Exception("Order code is already used");
        }
        Order newOrder = new Order();
        LocalDate date = LocalDate.now();
        newOrder.setCreated_at(date);
        newOrder.setDelivery_Address(order.getDelivery_Address());
        newOrder.setOrderItem_code(order.getOrderItem_code());
        newOrder.setUserId(user.getId());
        newOrder.setOrderItem_quantity(order.getOrderItem_code().size());
        int totalPrice = 0;
        for(String orderItemCode : order.getOrderItem_code()){
            OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
            totalPrice += orderItem.getTotalPrice();
            orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
            orderItemRepository.save(orderItem);
        }
        newOrder.setOrderPrice(totalPrice);
        newOrder.setOrderCode(order.getOrderCode());
        return orderRepository.save(newOrder);
    }

    @Override
    public Order updateOrder(OrderItemRequest order, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if(existingOrder == null){
            throw new Exception("Order not found");
        }

        if(existingOrder.getOrderState() == ORDER_STATE.ON_GOING || existingOrder.getOrderState() == ORDER_STATE.DELIVERED){
            throw new Exception("Cannot update order");
        }
        Order newOrder = new Order();
        LocalDate date = LocalDate.now();
        existingOrder.setUpdate_at(date);
        existingOrder.setDelivery_Address(order.getDelivery_Address());
        existingOrder.setOrderItem_code(order.getOrderItem_code());
        existingOrder.setOrderItem_quantity(order.getOrderItem_code().size());
        int totalPrice = 0;
        for(String orderItemCode : order.getOrderItem_code()){
            OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
            totalPrice += orderItem.getTotalPrice();
            orderItem.setOrderItemState(ORDER_ITEM_STATE.IN_ORDER);
            orderItemRepository.save(orderItem);
        }
        existingOrder.setOrderPrice(totalPrice);
        return orderRepository.save(existingOrder);
    }

    @Override
    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    @Override
    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id).orElse(null);
        for(String i : order.getOrderItem_code()){
            orderItemRepository.deleteByorderItemCode(i);
        }
        orderRepository.deleteById(id);
    }

    @Override
    public List<Order> getOrderByUserId(String userId) {
        return orderRepository.findByuserId(userId);
    }

    @Override
    public Order updateOrderState(OrderStateRequest state, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if(existingOrder == null){
            throw new Exception("Order not found");
        }

        if(existingOrder.getOrderState() == ORDER_STATE.DELIVERED){
            throw new Exception("Cannot update order");
        }

        existingOrder.setOrderState(state.getState());
        if (state.getState() == ORDER_STATE.CANCELLED) {
            for(String orderItemCode : existingOrder.getOrderItem_code()){
                OrderItem orderItem = orderItemRepository.findByorderItemCode(orderItemCode);
                orderItem.setOrderItemState(ORDER_ITEM_STATE.OUT_ORDER);
                orderItemRepository.save(orderItem);
            }
            existingOrder.setOrderStatus(ORDER_STATUS.OUT_EXPORT);
        }
        return orderRepository.save(existingOrder);
    }



    @Override
    public List<Order> getOrderByState(ORDER_STATE orderState) {
        List<Order> orders = new ArrayList<>();
        for(Order order : orderRepository.findAll()){
            if(order.getOrderState() == orderState){
                orders.add(order);
            }
        }
        return orders;
    }

    @Override
    public List<Order> getOrderByStatus(ORDER_STATUS orderStatus) {
        List<Order> orders = new ArrayList<>();
        for(Order order : orderRepository.findAll()){
            if(order.getOrderStatus() == orderStatus){
                orders.add(order);
            }
        }
        return orders;
    }

    @Override
    public OrderQuantity getOrderQuantity() {
        int on_pending = 0;
        int confirmed = 0;
        int delivered = 0;
        int on_going = 0;
        int cancel = 0;
        OrderQuantity orderQuantity = new OrderQuantity();
        for(Order order : orderRepository.findAll()){
            if(order.getOrderState() == ORDER_STATE.ON_GOING){
                on_going += 1;
            }
            if(order.getOrderState() == ORDER_STATE.DELIVERED){
                delivered += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CANCELLED){
                cancel += 1;
            }
            if(order.getOrderState() == ORDER_STATE.PENDING){
                on_pending += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CONFIRMED){
                confirmed += 1;
            }
        }
        orderQuantity.setCancelQuantity(cancel);
        orderQuantity.setConfirmedQuantity(confirmed);
        orderQuantity.setPendingQuantity(on_pending);
        orderQuantity.setDeliveredQuantity(delivered);
        orderQuantity.setOnGoingQuantity(on_going);

        return orderQuantity;
    }

    @Override
    public Order getOrderByOrderCode(String orderCode) {
        return orderRepository.findByorderCode(orderCode);
    }

    @Override
    public Order updateOrderStatus(OrderStatusRequest status, String orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if(existingOrder == null){
            throw new Exception("Order not found");
        }
        existingOrder.setOrderStatus(status.getOrderStatus());
        return orderRepository.save(existingOrder);
    }

    @Override
    public OrderQuantity getOrderQuantityByMonth(int month, int year) {
        int on_pending = 0;
        int confirmed = 0;
        int delivered = 0;
        int on_going = 0;
        int cancel = 0;
        OrderQuantity orderQuantity = new OrderQuantity();
        for(Order order : orderRepository.findOrdersByMonthAndYear(month, year)){
            if(order.getOrderState() == ORDER_STATE.ON_GOING){
                on_going += 1;
            }
            if(order.getOrderState() == ORDER_STATE.DELIVERED){
                delivered += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CANCELLED){
                cancel += 1;
            }
            if(order.getOrderState() == ORDER_STATE.PENDING){
                on_pending += 1;
            }
            if(order.getOrderState() == ORDER_STATE.CONFIRMED){
                confirmed += 1;
            }
        }
        orderQuantity.setCancelQuantity(cancel);
        orderQuantity.setConfirmedQuantity(confirmed);
        orderQuantity.setPendingQuantity(on_pending);
        orderQuantity.setDeliveredQuantity(delivered);
        orderQuantity.setOnGoingQuantity(on_going);

        return orderQuantity;
    }
}
