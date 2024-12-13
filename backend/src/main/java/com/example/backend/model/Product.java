package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(
        "products"
)
public class Product {
    @Id
    private String id;
    @Field("category_id")
    private String categoryId;
    private String productName;
    private int inventory_quantity;
    private String unit;
    private String description;
    private String image;
    private Date production_date;
    private Date expiration_date;
}
