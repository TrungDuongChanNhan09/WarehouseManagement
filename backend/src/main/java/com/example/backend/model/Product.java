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
    @Field("supplier_id")
    private String supplierId;
    private String productName;
    private int inventory_quantity;
    private String unit;
    private String description;
    private String image;
    private Date production_date;
    private Date expiration_date;
    private int price;
    private PRODUCT_STATUS productStatus = PRODUCT_STATUS.IN_STOCK;
}
