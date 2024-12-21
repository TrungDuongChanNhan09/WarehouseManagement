package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;
@Data
@Document(
    "inventory"
)
public class Inventory {
    @Id
    private String inventory_id;
    private String warehouse_id;
    private List<String> shelves;
    private String typeInventory;
    private String nameInventory;
    private String typeInventoryDescription;
    private String status;
    private Date importdate;
    private int quantity;
}
