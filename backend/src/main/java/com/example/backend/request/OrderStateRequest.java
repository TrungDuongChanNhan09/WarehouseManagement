package com.example.backend.request;

import com.example.backend.model.ORDER_STATE;
import lombok.Data;

@Data
public class OrderStateRequest {
    private ORDER_STATE state;
}
