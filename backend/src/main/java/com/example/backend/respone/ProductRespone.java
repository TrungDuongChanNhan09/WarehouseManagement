package com.example.backend.respone;

import com.example.backend.model.PRODUCT_STATUS;
import lombok.Data;

import java.util.Date;

@Data
public class ProductRespone{
    private String id;
    private String productName;
    private int inventory_quantity;
    private String supplierId;
    private String categoryId;
    private String unit;
    private String description;
    private String image;
    private Date production_date;
    private Date expiration_date;
    private int price;
    private PRODUCT_STATUS productStatus;
    private String supplierName;
    private String categoryName;
}
