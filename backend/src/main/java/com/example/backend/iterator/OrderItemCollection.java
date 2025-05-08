package com.example.backend.iterator;

import com.example.backend.model.OrderItem;
import java.util.List;

public class OrderItemCollection {
    private final List<OrderItem> orderItems;

    public OrderItemCollection(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public OrderItemIterator createIterator() {
        return new OrderItemIterator(orderItems);
    }
}
