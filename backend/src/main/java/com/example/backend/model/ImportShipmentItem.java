package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
@Data
@Document(
    "ImportShipmentItem"
)
public class ImportShipmentItem {
    @Id
    private String id;
    private String importshipmentId;
    private String productName;
    private int quantity;
    private BigDecimal totalPrice;

}
