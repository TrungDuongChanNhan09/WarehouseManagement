package com.example.backend.request;

import com.example.backend.model.ORDER_STATUS;
import lombok.Data;

@Data
public class OrderStatusRequest {
    private ORDER_STATUS orderStatus;
}
