package com.example.backend.model;

import lombok.Data;

@Data
public class OrderQuantity {
    private int confirmedQuantity;
    private int deliveredQuantity;
    private int pendingQuantity;
    private int cancelQuantity;
    private int onGoingQuantity;
}
