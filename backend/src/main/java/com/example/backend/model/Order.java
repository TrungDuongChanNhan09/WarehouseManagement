package com.example.backend.model;

import com.example.backend.ENUM.ORDER_STATE;
import com.example.backend.ENUM.ORDER_STATUS;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.util.List;

@Data
@Document(
        "orders"
)
public class Order {
    @Id
    private String id;
    @Field("user_id")
    private String userId;
    private List<String> orderItem_code;
    private int orderItem_quantity;
    private ORDER_STATE orderState = ORDER_STATE.PENDING;
    private String delivery_Address;
    private LocalDate created_at;
    private LocalDate update_at;
    private int orderPrice;
    private String orderCode;
    private ORDER_STATUS orderStatus = ORDER_STATUS.OUT_EXPORT;
}
