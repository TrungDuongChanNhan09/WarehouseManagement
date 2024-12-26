package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(
        "orderItems"
)
public class OrderItem {
    @Id
    private String orderItem_id;
    private String product_id;
    private int quantity;
    private int totalPrice;
    private String orderItemCode;
    private ORDER_ITEM_STATE orderItemState = ORDER_ITEM_STATE.OUT_ORDER;
    private List<String> shelfCode;
}
