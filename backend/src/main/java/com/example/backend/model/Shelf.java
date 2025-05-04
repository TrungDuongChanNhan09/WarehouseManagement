package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("shelf")
public class Shelf {
    @Id
    private String id;
    private String shelfCode;
    private String inventoryid;
    private String productId;
    private int quantity;
    private int capacity;
    private int coloum;
    private int row;
}
